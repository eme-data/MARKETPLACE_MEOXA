import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Commandes - Admin MEOXA",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { user: true, product: true, plan: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-meoxa-blue mb-6">Commandes</h1>

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
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-meoxa-border last:border-0"
                >
                  <td className="p-4">
                    <p className="font-medium text-meoxa-blue">
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
              {orders.length === 0 && (
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
