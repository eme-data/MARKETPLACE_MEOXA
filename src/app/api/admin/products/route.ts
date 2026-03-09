import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autoris\u00e9." }, { status: 403 });
  }

  try {
    const data = await req.json();

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        longDescription: data.longDescription || null,
        category: data.category,
        version: data.version || "1.0.0",
        demoUrl: data.demoUrl || null,
        downloadUrl: data.downloadUrl || null,
        published: data.published || false,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la cr\u00e9ation du produit." },
      { status: 500 }
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autoris\u00e9." }, { status: 403 });
  }

  const products = await prisma.product.findMany({
    include: { plans: true, _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(products);
}
