import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autoris\u00e9." }, { status: 403 });
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autoris\u00e9." }, { status: 403 });
  }

  try {
    const data = await req.json();

    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || null,
        content: data.content,
        published: data.published || false,
        publishedAt: data.published ? new Date() : null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Erreur lors de la cr\u00e9ation." },
      { status: 500 }
    );
  }
}
