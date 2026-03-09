import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PricingCard from "@/components/PricingCard";
import Card, { CardContent } from "@/components/ui/Card";

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: "Produit introuvable" };
  return {
    title: `${product.name} - MEOXA Marketplace`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug, published: true },
    include: {
      plans: { where: { active: true }, orderBy: { price: "asc" } },
      reviews: {
        where: { approved: true },
        include: { user: { select: { name: true, image: true } } },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!product) notFound();

  const avgRating =
    product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
        product.reviews.length
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Product Header */}
      <div className="grid lg:grid-cols-2 gap-12 mb-16">
        <div className="bg-meoxa-gray rounded-xl h-80 flex items-center justify-center">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <span className="text-meoxa-blue/20 text-8xl font-bold">
              {product.name.charAt(0)}
            </span>
          )}
        </div>
        <div>
          <span className="inline-block bg-meoxa-orange/10 text-meoxa-orange text-sm font-medium px-3 py-1 rounded-full mb-4">
            {product.category}
          </span>
          <h1 className="text-3xl font-bold text-meoxa-blue mb-4">
            {product.name}
          </h1>
          <p className="text-meoxa-gray-dark leading-relaxed mb-4">
            {product.description}
          </p>
          {product.reviews.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(avgRating)
                        ? "text-meoxa-orange"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-meoxa-gray-dark">
                {avgRating.toFixed(1)} ({product.reviews.length} avis)
              </span>
            </div>
          )}
          <p className="text-sm text-meoxa-gray-dark">
            Version : {product.version}
          </p>
          {product.demoUrl && (
            <a
              href={product.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-meoxa-orange hover:text-meoxa-orange-hover font-medium text-sm"
            >
              Voir la d&eacute;mo &rarr;
            </a>
          )}
        </div>
      </div>

      {/* Long Description */}
      {product.longDescription && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-meoxa-blue mb-6">
            Description d&eacute;taill&eacute;e
          </h2>
          <div className="prose max-w-none text-meoxa-gray-dark">
            {product.longDescription.split("\n").map((p, i) => (
              <p key={i} className="mb-4">
                {p}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Plans */}
      {product.plans.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-meoxa-blue mb-8 text-center">
            Choisissez votre plan
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {product.plans.map((plan) => (
              <PricingCard
                key={plan.id}
                name={plan.name}
                price={plan.price}
                interval={plan.interval}
                features={plan.features}
                popular={plan.popular}
                planId={plan.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Reviews */}
      {product.reviews.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-meoxa-blue mb-8">
            Avis clients
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {product.reviews.map((review) => (
              <Card key={review.id}>
                <CardContent>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-meoxa-orange/10 rounded-full flex items-center justify-center">
                      <span className="text-meoxa-orange font-bold text-sm">
                        {review.user.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-meoxa-blue text-sm">
                        {review.user.name || "Utilisateur"}
                      </p>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? "text-meoxa-orange"
                                : "text-gray-300"
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <h4 className="font-semibold text-meoxa-blue text-sm mb-1">
                    {review.title}
                  </h4>
                  <p className="text-meoxa-gray-dark text-sm">
                    {review.comment}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
