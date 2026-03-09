import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

const adminNav = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Produits" },
  { href: "/admin/clients", label: "Clients" },
  { href: "/admin/orders", label: "Commandes" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/reviews", label: "Avis" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-meoxa-gray">
      {/* Admin top bar */}
      <div className="bg-white border-b border-meoxa-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 h-12 overflow-x-auto">
            <span className="text-meoxa-orange font-bold text-sm whitespace-nowrap">
              Admin Panel
            </span>
            {adminNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-meoxa-gray-dark hover:text-meoxa-blue whitespace-nowrap transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </div>
    </div>
  );
}
