import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/ProductCard";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Catalogue - MEOXA Marketplace",
  description: "Découvrez tous nos logiciels et solutions IA disponibles.",
};

export default async function CataloguePage() {
  const products = await prisma.product.findMany({
    where: { published: true },
    include: {
      plans: {
        where: { active: true },
        orderBy: { price: "asc" },
        take: 1,
      },
      reviews: {
        where: { approved: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-meoxa-blue">
          Notre Catalogue
        </h1>
        <p className="mt-4 text-meoxa-gray-dark max-w-2xl mx-auto">
          Explorez nos solutions logicielles con&ccedil;ues pour optimiser votre
          activit&eacute;.
        </p>
      </div>

      {/* Categories filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <span className="bg-meoxa-blue text-white px-4 py-2 rounded-full text-sm font-medium cursor-pointer">
            Tous
          </span>
          {categories.map((cat) => (
            <span
              key={cat}
              className="bg-meoxa-gray text-meoxa-blue px-4 py-2 rounded-full text-sm font-medium cursor-pointer hover:bg-meoxa-orange/10 hover:text-meoxa-orange transition-colors"
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      {/* Products Grid */}
      {products.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              slug={product.slug}
              name={product.name}
              description={product.description}
              category={product.category}
              image={product.image}
              startingPrice={product.plans[0]?.price}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-meoxa-gray-dark text-lg">
            Aucun produit disponible pour le moment.
          </p>
          <p className="text-meoxa-gray-dark text-sm mt-2">
            Revenez bient&ocirc;t, nous pr&eacute;parons de nouvelles
            solutions !
          </p>
        </div>
      )}
    </div>
  );
}
