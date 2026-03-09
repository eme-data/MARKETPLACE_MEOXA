import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autoris\u00e9." }, { status: 403 });
  }

  const { id } = await params;

  await prisma.review.update({
    where: { id },
    data: { approved: true },
  });

  return NextResponse.redirect(new URL("/admin/reviews", process.env.NEXT_PUBLIC_APP_URL));
}
