import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const { searchParams } = new URL(req.url);
    const planId = searchParams.get("planId");

    if (!planId) {
      return NextResponse.json({ error: "Plan requis." }, { status: 400 });
    }

    const plan = await prisma.plan.findUnique({
      where: { id: planId },
      include: { product: true },
    });

    if (!plan || !plan.stripePriceId) {
      return NextResponse.json({ error: "Plan introuvable." }, { status: 404 });
    }

    const isSubscription = plan.interval !== "LIFETIME";

    const checkoutSession = await stripe.checkout.sessions.create({
      customer_email: session.user.email!,
      mode: isSubscription ? "subscription" : "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        planId: plan.id,
        productId: plan.productId,
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/catalogue/${plan.product.slug}?checkout=cancelled`,
    });

    return NextResponse.redirect(checkoutSession.url!);
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la création du paiement." },
      { status: 500 }
    );
  }
}
