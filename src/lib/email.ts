import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

export function welcomeEmail(name: string) {
  return {
    subject: "Bienvenue sur MEOXA Marketplace !",
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0B1B42; padding: 30px; text-align: center;">
          <h1 style="color: #F36C21; margin: 0;">MEOXA</h1>
          <p style="color: white; margin: 5px 0 0;">Marketplace</p>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #0B1B42;">Bienvenue ${name} !</h2>
          <p>Merci de vous être inscrit sur MEOXA Marketplace. Découvrez nos logiciels et choisissez l'abonnement qui vous convient.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/catalogue"
             style="display: inline-block; background: #F36C21; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin-top: 15px;">
            Découvrir le catalogue
          </a>
        </div>
      </div>
    `,
  };
}

export function orderConfirmationEmail(orderNumber: string, productName: string, amount: number) {
  return {
    subject: `Confirmation de commande #${orderNumber}`,
    html: `
      <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0B1B42; padding: 30px; text-align: center;">
          <h1 style="color: #F36C21; margin: 0;">MEOXA</h1>
        </div>
        <div style="padding: 30px; background: #f8f9fa;">
          <h2 style="color: #0B1B42;">Commande confirmée !</h2>
          <p>Votre commande <strong>#${orderNumber}</strong> a été confirmée.</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Produit :</strong> ${productName}</p>
            <p><strong>Montant :</strong> ${amount.toFixed(2)} €</p>
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard"
             style="display: inline-block; background: #F36C21; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
            Accéder à mon espace
          </a>
        </div>
      </div>
    `,
  };
}
