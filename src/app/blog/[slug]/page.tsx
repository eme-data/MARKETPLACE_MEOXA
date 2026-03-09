import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: "Article introuvable" };
  return { title: `${post.title} - Blog MEOXA`, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
  });

  if (!post) notFound();

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/blog"
        className="text-meoxa-orange hover:text-meoxa-orange-hover text-sm font-medium mb-6 inline-block"
      >
        &larr; Retour au blog
      </Link>

      {post.coverImage && (
        <div className="rounded-xl overflow-hidden mb-8 h-64 sm:h-80">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {post.publishedAt && (
        <p className="text-meoxa-gray-dark text-sm mb-4">
          {new Date(post.publishedAt).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      )}

      <h1 className="text-3xl font-bold text-meoxa-blue mb-6">
        {post.title}
      </h1>

      <div className="prose prose-lg max-w-none text-foreground">
        {post.content.split("\n").map((paragraph, i) => (
          <p key={i} className="mb-4 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
    </article>
  );
}
