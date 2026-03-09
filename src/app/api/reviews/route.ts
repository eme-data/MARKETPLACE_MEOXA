import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non connect\u00e9." }, { status: 401 });
  }

  try {
    const { productId, rating, title, comment } = await req.json();

    if (!productId || !rating || !title || !comment) {
      return NextResponse.json(
        { error: "Tous les champs sont requis." },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "La note doit \u00eatre entre 1 et 5." },
        { status: 400 }
      );
    }

    // Check user has a license for this product
    const license = await prisma.license.findFirst({
      where: { userId: session.user.id, productId, status: "ACTIVE" },
    });

    if (!license) {
      return NextResponse.json(
        { error: "Vous devez avoir une licence active pour laisser un avis." },
        { status: 403 }
      );
    }

    const review = await prisma.review.create({
      data: {
        userId: session.user.id,
        productId,
        rating,
        title,
        comment,
        approved: false,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la cr\u00e9ation de l'avis." },
      { status: 500 }
    );
  }
}
