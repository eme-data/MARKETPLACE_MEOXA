import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Card, { CardContent } from "@/components/ui/Card";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Mon espace - MEOXA Marketplace",
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = session!.user.id;

  const [licenses, subscriptions, orders] = await Promise.all([
    prisma.license.findMany({
      where: { userId, status: "ACTIVE" },
      include: { product: true },
    }),
    prisma.subscription.findMany({
      where: { userId, status: "ACTIVE" },
      include: { plan: { include: { product: true } } },
    }),
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { product: true },
    }),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-meoxa-blue mb-6">
        Bienvenue, {session!.user.name}
      </h1>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent>
            <p className="text-meoxa-gray-dark text-sm">Licences actives</p>
            <p className="text-2xl font-bold text-meoxa-blue mt-1">
              {licenses.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-meoxa-gray-dark text-sm">Abonnements</p>
            <p className="text-2xl font-bold text-meoxa-blue mt-1">
              {subscriptions.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <p className="text-meoxa-gray-dark text-sm">Commandes totales</p>
            <p className="text-2xl font-bold text-meoxa-blue mt-1">
              {orders.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active subscriptions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-meoxa-blue mb-4">
          Abonnements actifs
        </h2>
        {subscriptions.length > 0 ? (
          <div className="space-y-3">
            {subscriptions.map((sub) => (
              <Card key={sub.id}>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-meoxa-blue">
                      {sub.plan.product.name} - {sub.plan.name}
                    </p>
                    <p className="text-sm text-meoxa-gray-dark">
                      Renouvellement :{" "}
                      {new Date(sub.currentPeriodEnd).toLocaleDateString(
                        "fr-FR"
                      )}
                    </p>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    Actif
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-meoxa-gray-dark">
                Aucun abonnement actif.
              </p>
              <Link
                href="/catalogue"
                className="text-meoxa-orange hover:text-meoxa-orange-hover text-sm font-medium mt-2 inline-block"
              >
                D&eacute;couvrir nos logiciels &rarr;
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent orders */}
      <div>
        <h2 className="text-lg font-semibold text-meoxa-blue mb-4">
          Derni&egrave;res commandes
        </h2>
        {orders.length > 0 ? (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-meoxa-border">
                    <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                      Produit
                    </th>
                    <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                      Montant
                    </th>
                    <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                      Statut
                    </th>
                    <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-meoxa-border last:border-0"
                    >
                      <td className="p-4 text-meoxa-blue font-medium">
                        {order.product.name}
                      </td>
                      <td className="p-4">
                        {order.amount.toFixed(2)} {order.currency}
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                            order.status === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : order.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.status === "COMPLETED"
                            ? "Compl\u00e9t\u00e9e"
                            : order.status === "PENDING"
                            ? "En attente"
                            : "Annul\u00e9e"}
                        </span>
                      </td>
                      <td className="p-4 text-meoxa-gray-dark">
                        {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-meoxa-gray-dark">Aucune commande.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
