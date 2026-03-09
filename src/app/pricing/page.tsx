import PricingCard from "@/components/PricingCard";

export const metadata = {
  title: "Tarifs - MEOXA Marketplace",
  description: "Découvrez nos plans d'abonnement adaptés à vos besoins.",
};

const plans = [
  {
    name: "Starter",
    price: 29,
    interval: "MONTHLY",
    features: [
      "1 logiciel au choix",
      "Mises à jour incluses",
      "Support par email",
      "Licence mono-utilisateur",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: 79,
    interval: "MONTHLY",
    features: [
      "3 logiciels au choix",
      "Mises à jour incluses",
      "Support prioritaire",
      "Licence 5 utilisateurs",
      "API access",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: 199,
    interval: "MONTHLY",
    features: [
      "Tous les logiciels",
      "Mises à jour incluses",
      "Support dédié 24/7",
      "Licence illimitée",
      "API access",
      "Intégration sur mesure",
    ],
    popular: false,
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h1 className="text-3xl font-bold text-meoxa-blue">
          Des tarifs simples et transparents
        </h1>
        <p className="mt-4 text-meoxa-gray-dark max-w-2xl mx-auto">
          Choisissez le plan qui correspond &agrave; vos besoins. Tous les plans
          incluent un essai gratuit de 14 jours.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-start">
        {plans.map((plan) => (
          <PricingCard key={plan.name} {...plan} />
        ))}
      </div>

      {/* FAQ */}
      <div className="mt-20 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-meoxa-blue text-center mb-10">
          Questions fr&eacute;quentes
        </h2>
        <div className="space-y-6">
          {[
            {
              q: "Puis-je changer de plan à tout moment ?",
              a: "Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. La différence sera calculée au prorata.",
            },
            {
              q: "Y a-t-il un engagement ?",
              a: "Non, tous nos plans sont sans engagement. Vous pouvez annuler votre abonnement à tout moment.",
            },
            {
              q: "Comment fonctionne l'essai gratuit ?",
              a: "Vous bénéficiez de 14 jours d'essai gratuit sur tous nos plans. Aucune carte bancaire n'est requise pour commencer.",
            },
            {
              q: "Proposez-vous des réductions annuelles ?",
              a: "Oui, en choisissant un abonnement annuel, vous bénéficiez de 2 mois offerts sur tous les plans.",
            },
          ].map((faq) => (
            <div
              key={faq.q}
              className="bg-meoxa-gray rounded-xl p-6"
            >
              <h3 className="font-semibold text-meoxa-blue mb-2">{faq.q}</h3>
              <p className="text-meoxa-gray-dark text-sm">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
