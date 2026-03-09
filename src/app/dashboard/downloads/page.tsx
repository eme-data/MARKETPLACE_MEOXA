import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "T\u00e9l\u00e9chargements - MEOXA Marketplace",
};

export default async function DownloadsPage() {
  const session = await getServerSession(authOptions);

  const licenses = await prisma.license.findMany({
    where: { userId: session!.user.id, status: "ACTIVE" },
    include: { product: true },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-meoxa-blue mb-6">
        T&eacute;l&eacute;chargements
      </h1>

      {licenses.length > 0 ? (
        <div className="space-y-4">
          {licenses.map((license) => (
            <Card key={license.id}>
              <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-meoxa-blue">
                    {license.product.name}
                  </h3>
                  <p className="text-xs text-meoxa-gray-dark mt-1">
                    Version {license.product.version}
                  </p>
                </div>
                {license.product.downloadUrl ? (
                  <a href={license.product.downloadUrl}>
                    <Button size="sm">
                      T&eacute;l&eacute;charger v{license.product.version}
                    </Button>
                  </a>
                ) : (
                  <span className="text-meoxa-gray-dark text-sm">
                    Bient&ocirc;t disponible
                  </span>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-meoxa-gray-dark">
              Aucun logiciel &agrave; t&eacute;l&eacute;charger.
            </p>
            <p className="text-meoxa-gray-dark text-sm mt-2">
              Abonnez-vous &agrave; un logiciel pour commencer.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
