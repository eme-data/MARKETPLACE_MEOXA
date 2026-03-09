import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Card, { CardContent } from "@/components/ui/Card";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Mes licences - MEOXA Marketplace",
};

export default async function LicensesPage() {
  const session = await getServerSession(authOptions);

  const licenses = await prisma.license.findMany({
    where: { userId: session!.user.id },
    include: { product: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-meoxa-blue mb-6">Mes licences</h1>

      {licenses.length > 0 ? (
        <div className="space-y-4">
          {licenses.map((license) => (
            <Card key={license.id}>
              <CardContent>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-meoxa-blue">
                      {license.product.name}
                    </h3>
                    <p className="text-xs text-meoxa-gray-dark mt-1 font-mono">
                      Cl&eacute; : {license.key}
                    </p>
                    {license.expiresAt && (
                      <p className="text-xs text-meoxa-gray-dark mt-1">
                        Expire le :{" "}
                        {new Date(license.expiresAt).toLocaleDateString("fr-FR")}
                      </p>
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1 rounded-full self-start ${
                      license.status === "ACTIVE"
                        ? "bg-green-100 text-green-700"
                        : license.status === "EXPIRED"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {license.status === "ACTIVE"
                      ? "Active"
                      : license.status === "EXPIRED"
                      ? "Expir\u00e9e"
                      : "R\u00e9voqu\u00e9e"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-meoxa-gray-dark">
              Vous n&apos;avez pas encore de licence.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
