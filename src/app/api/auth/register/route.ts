import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendEmail, welcomeEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Un compte avec cet email existe déjà." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    // Send welcome email (non-blocking)
    const { subject, html } = welcomeEmail(name);
    sendEmail({ to: email, subject, html }).catch(console.error);

    return NextResponse.json(
      { message: "Compte créé avec succès.", userId: user.id },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
