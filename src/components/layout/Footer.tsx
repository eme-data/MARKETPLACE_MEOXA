import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-meoxa-blue text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <span className="text-meoxa-orange font-bold text-2xl">MEOXA</span>
            <p className="text-white/60 mt-3 text-sm leading-relaxed">
              Marketplace de logiciels innovants. Des solutions IA pour
              optimiser votre activit&eacute;.
            </p>
          </div>

          {/* Produits */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Produits
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/catalogue"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Catalogue
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Tarifs
                </Link>
              </li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Ressources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/blog"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="https://meoxa.fr"
                  target="_blank"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Site vitrine
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-2">
              <li className="text-white/60 text-sm">contact@meoxa.fr</li>
              <li>
                <Link
                  href="/mentions-legales"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  Mentions l&eacute;gales
                </Link>
              </li>
              <li>
                <Link
                  href="/cgv"
                  className="text-white/60 hover:text-white text-sm transition-colors"
                >
                  CGV
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center">
          <p className="text-white/40 text-sm">
            &copy; {new Date().getFullYear()} MEOXA. Tous droits
            r&eacute;serv&eacute;s.
          </p>
        </div>
      </div>
    </footer>
  );
}
