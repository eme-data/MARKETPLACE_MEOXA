import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Clients - Admin MEOXA",
};

export default async function AdminClientsPage() {
  const users = await prisma.user.findMany({
    include: {
      _count: { select: { orders: true, licenses: true, subscriptions: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-meoxa-blue mb-6">Clients</h1>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-meoxa-border">
                <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                  Nom
                </th>
                <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                  Email
                </th>
                <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                  R&ocirc;le
                </th>
                <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                  Commandes
                </th>
                <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                  Licences
                </th>
                <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                  Inscription
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-meoxa-border last:border-0"
                >
                  <td className="p-4 font-medium text-meoxa-blue">
                    {user.name || "-"}
                  </td>
                  <td className="p-4 text-meoxa-gray-dark">{user.email}</td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        user.role === "ADMIN"
                          ? "bg-meoxa-orange/10 text-meoxa-orange"
                          : "bg-meoxa-gray text-meoxa-gray-dark"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-meoxa-gray-dark">
                    {user._count.orders}
                  </td>
                  <td className="p-4 text-meoxa-gray-dark">
                    {user._count.licenses}
                  </td>
                  <td className="p-4 text-meoxa-gray-dark">
                    {new Date(user.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
