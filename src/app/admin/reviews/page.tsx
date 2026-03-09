import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Avis - Admin MEOXA",
};

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: {
      user: { select: { name: true, email: true } },
      product: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-meoxa-blue mb-6">
        Avis clients
      </h1>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-meoxa-border">
                <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                  Client
                </th>
                <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                  Produit
                </th>
                <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                  Note
                </th>
                <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                  Titre
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
              {reviews.map((review) => (
                <tr
                  key={review.id}
                  className="border-b border-meoxa-border last:border-0"
                >
                  <td className="p-4">
                    <p className="font-medium text-meoxa-blue">
                      {review.user.name}
                    </p>
                    <p className="text-xs text-meoxa-gray-dark">
                      {review.user.email}
                    </p>
                  </td>
                  <td className="p-4 text-meoxa-blue">
                    {review.product.name}
                  </td>
                  <td className="p-4">
                    <span className="text-meoxa-orange font-bold">
                      {review.rating}/5
                    </span>
                  </td>
                  <td className="p-4 text-meoxa-gray-dark">{review.title}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        review.approved
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {review.approved ? "Approuv\u00e9" : "En attente"}
                    </span>
                  </td>
                  <td className="p-4">
                    <form
                      action={`/api/admin/reviews/${review.id}/approve`}
                      method="POST"
                    >
                      {!review.approved && (
                        <button
                          type="submit"
                          className="text-meoxa-orange hover:text-meoxa-orange-hover text-sm font-medium"
                        >
                          Approuver
                        </button>
                      )}
                    </form>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-meoxa-gray-dark"
                  >
                    Aucun avis.
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
