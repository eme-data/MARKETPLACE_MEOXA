import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Card from "@/components/ui/Card";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Factures - MEOXA Marketplace",
};

export default async function InvoicesPage() {
  const session = await getServerSession(authOptions);

  const invoices = await prisma.invoice.findMany({
    where: { order: { userId: session!.user.id } },
    include: { order: { include: { product: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-meoxa-blue mb-6">Mes factures</h1>

      {invoices.length > 0 ? (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-meoxa-border">
                  <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                    N&deg; Facture
                  </th>
                  <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                    Produit
                  </th>
                  <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                    Montant
                  </th>
                  <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                    Date
                  </th>
                  <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                    PDF
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-meoxa-border last:border-0"
                  >
                    <td className="p-4 font-mono text-meoxa-blue text-xs">
                      {invoice.number}
                    </td>
                    <td className="p-4 text-meoxa-blue font-medium">
                      {invoice.order.product.name}
                    </td>
                    <td className="p-4">
                      {invoice.amount.toFixed(2)} {invoice.currency}
                    </td>
                    <td className="p-4 text-meoxa-gray-dark">
                      {new Date(invoice.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="p-4">
                      {invoice.pdfUrl ? (
                        <a
                          href={invoice.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-meoxa-orange hover:text-meoxa-orange-hover text-xs font-medium"
                        >
                          T&eacute;l&eacute;charger
                        </a>
                      ) : (
                        <span className="text-meoxa-gray-dark text-xs">
                          -
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="p-6 text-center py-12">
            <p className="text-meoxa-gray-dark">Aucune facture.</p>
          </div>
        </Card>
      )}
    </div>
  );
}
