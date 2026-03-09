import Link from "next/link";
import Button from "@/components/ui/Button";
import Card, { CardContent } from "@/components/ui/Card";

const features = [
  {
    icon: "01",
    title: "Choisissez votre logiciel",
    description:
      "Parcourez notre catalogue de solutions IA et trouvez celle qui correspond à vos besoins.",
  },
  {
    icon: "02",
    title: "Abonnez-vous",
    description:
      "Sélectionnez le plan qui vous convient : mensuel, annuel ou à vie. Paiement sécurisé via Stripe.",
  },
  {
    icon: "03",
    title: "Déployez & Utilisez",
    description:
      "Téléchargez votre logiciel, activez votre licence et commencez à optimiser votre activité.",
  },
];

const stats = [
  { value: "50+", label: "Logiciels disponibles" },
  { value: "1000+", label: "Clients satisfaits" },
  { value: "99.9%", label: "Disponibilité" },
  { value: "24/7", label: "Support technique" },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-meoxa-blue relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-meoxa-blue via-meoxa-blue-light to-meoxa-blue opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Des logiciels{" "}
              <span className="text-meoxa-orange">innovants</span> pour votre
              activit&eacute;
            </h1>
            <p className="mt-6 text-lg text-white/70 leading-relaxed">
              D&eacute;couvrez notre marketplace de solutions IA. Abonnez-vous et
              acc&eacute;dez instantan&eacute;ment &agrave; des outils puissants
              pour automatiser et optimiser vos processus.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/catalogue">
                <Button size="lg">D&eacute;couvrir le catalogue</Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-meoxa-blue">
                  Voir les tarifs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-meoxa-gray py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-meoxa-blue">
                  {stat.value}
                </p>
                <p className="text-meoxa-gray-dark text-sm mt-1">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-meoxa-blue">
              Comment &ccedil;a marche ?
            </h2>
            <p className="mt-4 text-meoxa-gray-dark max-w-2xl mx-auto">
              En 3 &eacute;tapes simples, acc&eacute;dez &agrave; nos logiciels
              et boostez votre productivit&eacute;.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.icon} hover>
                <CardContent>
                  <div className="w-12 h-12 bg-meoxa-orange/10 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-meoxa-orange font-bold text-lg">
                      {feature.icon}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-meoxa-blue mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-meoxa-gray-dark text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-meoxa-blue py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white">
            Pr&ecirc;t &agrave; optimiser votre activit&eacute; ?
          </h2>
          <p className="mt-4 text-white/70 text-lg">
            Rejoignez des centaines d&apos;entreprises qui utilisent d&eacute;j&agrave;
            nos solutions.
          </p>
          <div className="mt-8">
            <Link href="/register">
              <Button size="lg">Cr&eacute;er mon compte gratuitement</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
