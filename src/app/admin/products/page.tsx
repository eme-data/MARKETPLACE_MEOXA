import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";
import Link from "next/link";
import Button from "@/components/ui/Button";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "G\u00e9rer les produits - Admin MEOXA",
};

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      plans: true,
      _count: { select: { orders: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-meoxa-blue">Produits</h1>
        <Link href="/admin/products/new">
          <Button>Ajouter un produit</Button>
        </Link>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-meoxa-border">
                <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                  Nom
                </th>
                <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                  Cat&eacute;gorie
                </th>
                <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                  Plans
                </th>
                <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                  Commandes
                </th>
                <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                  Statut
                </th>
                <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-meoxa-border last:border-0"
                >
                  <td className="p-4">
                    <p className="font-medium text-meoxa-blue">
                      {product.name}
                    </p>
                    <p className="text-xs text-meoxa-gray-dark">
                      v{product.version}
                    </p>
                  </td>
                  <td className="p-4 text-meoxa-gray-dark">
                    {product.category}
                  </td>
                  <td className="p-4 text-meoxa-gray-dark">
                    {product.plans.length}
                  </td>
                  <td className="p-4 text-meoxa-gray-dark">
                    {product._count.orders}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        product.published
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {product.published ? "Publi\u00e9" : "Brouillon"}
                    </span>
                  </td>
                  <td className="p-4">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-meoxa-orange hover:text-meoxa-orange-hover text-sm font-medium"
                    >
                      Modifier
                    </Link>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-meoxa-gray-dark"
                  >
                    Aucun produit. Commencez par en cr&eacute;er un.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
