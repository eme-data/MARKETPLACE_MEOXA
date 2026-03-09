import { prisma } from "@/lib/prisma";
import Card, { CardContent } from "@/components/ui/Card";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Admin Dashboard - MEOXA Marketplace",
};

export default async function AdminDashboard() {
  const [
    totalUsers,
    totalProducts,
    totalOrders,
    totalRevenue,
    recentOrders,
    activeSubscriptions,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count({ where: { status: "COMPLETED" } }),
    prisma.order.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: true, product: true, plan: true },
    }),
    prisma.subscription.count({ where: { status: "ACTIVE" } }),
  ]);

  const stats = [
    { label: "Utilisateurs", value: totalUsers },
    { label: "Produits", value: totalProducts },
    { label: "Commandes", value: totalOrders },
    {
      label: "Revenus",
      value: `${(totalRevenue._sum.amount || 0).toFixed(2)} \u20ac`,
    },
    { label: "Abonnements actifs", value: activeSubscriptions },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-meoxa-blue mb-6">
        Tableau de bord
      </h1>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent>
              <p className="text-meoxa-gray-dark text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-meoxa-blue mt-1">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <h2 className="text-lg font-semibold text-meoxa-blue mb-4">
        Derni&egrave;res commandes
      </h2>
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
                  Plan
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
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-meoxa-border last:border-0"
                >
                  <td className="p-4">
                    <p className="font-medium text-meoxa-blue text-sm">
                      {order.user.name}
                    </p>
                    <p className="text-xs text-meoxa-gray-dark">
                      {order.user.email}
                    </p>
                  </td>
                  <td className="p-4 text-meoxa-blue">{order.product.name}</td>
                  <td className="p-4 text-meoxa-gray-dark">
                    {order.plan.name}
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
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-meoxa-gray-dark">
                    {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="p-8 text-center text-meoxa-gray-dark"
                  >
                    Aucune commande.
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
