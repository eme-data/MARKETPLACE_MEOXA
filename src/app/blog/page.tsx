import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Card from "@/components/ui/Card";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Blog - MEOXA Marketplace",
  description: "Actualités, tutoriels et guides sur nos solutions logicielles.",
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-meoxa-blue">Blog</h1>
        <p className="mt-4 text-meoxa-gray-dark max-w-2xl mx-auto">
          Actualit&eacute;s, tutoriels et guides pour tirer le meilleur parti de
          nos solutions.
        </p>
      </div>

      {posts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card hover className="h-full">
                <div className="h-48 bg-meoxa-gray rounded-t-xl overflow-hidden">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-meoxa-blue/20 text-4xl font-bold">
                        MEOXA
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  {post.publishedAt && (
                    <p className="text-meoxa-gray-dark text-xs mb-2">
                      {new Date(post.publishedAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  )}
                  <h2 className="text-lg font-semibold text-meoxa-blue mb-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-meoxa-gray-dark text-sm line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-meoxa-gray-dark text-lg">
            Aucun article pour le moment.
          </p>
          <p className="text-meoxa-gray-dark text-sm mt-2">
            Revenez bient&ocirc;t pour d&eacute;couvrir nos premiers articles !
          </p>
        </div>
      )}
    </div>
  );
}
