import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendEmail, orderConfirmationEmail } from "@/lib/email";
import Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const { userId, planId, productId } = session.metadata!;

      const plan = await prisma.plan.findUnique({ where: { id: planId } });
      if (!plan) break;

      // Create order
      const order = await prisma.order.create({
        data: {
          userId,
          productId,
          planId,
          status: "COMPLETED",
          amount: plan.price,
          currency: plan.currency,
          stripeSessionId: session.id,
        },
      });

      // Create invoice
      const invoiceNumber = `INV-${Date.now()}`;
      await prisma.invoice.create({
        data: {
          orderId: order.id,
          number: invoiceNumber,
          amount: plan.price,
          currency: plan.currency,
        },
      });

      // Create license
      await prisma.license.create({
        data: {
          userId,
          productId,
          status: "ACTIVE",
          expiresAt:
            plan.interval === "LIFETIME"
              ? null
              : plan.interval === "YEARLY"
              ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      // Create subscription if recurring
      if (plan.interval !== "LIFETIME" && session.subscription) {
        const now = new Date();
        const periodEnd =
          plan.interval === "YEARLY"
            ? new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
            : new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

        await prisma.subscription.create({
          data: {
            userId,
            planId,
            status: "ACTIVE",
            stripeSubscriptionId: session.subscription as string,
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
          },
        });
      }

      // Send confirmation email
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (user?.email && product) {
        const { subject, html } = orderConfirmationEmail(
          invoiceNumber,
          product.name,
          plan.price
        );
        sendEmail({ to: user.email, subject, html }).catch(console.error);
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: { status: "CANCELLED" },
      });
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice & { subscription?: string };
      if (invoice.subscription) {
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: invoice.subscription },
          data: { status: "PAST_DUE" },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
