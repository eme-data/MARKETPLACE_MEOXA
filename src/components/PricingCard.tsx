import Button from "@/components/ui/Button";
import Link from "next/link";

interface PricingCardProps {
  name: string;
  price: number;
  interval: string;
  features: string[];
  popular?: boolean;
  planId?: string;
}

export default function PricingCard({
  name,
  price,
  interval,
  features,
  popular = false,
  planId,
}: PricingCardProps) {
  const intervalLabel =
    interval === "MONTHLY" ? "/mois" : interval === "YEARLY" ? "/an" : "";

  return (
    <div
      className={`relative bg-white rounded-xl border-2 p-8 ${
        popular
          ? "border-meoxa-orange shadow-lg scale-105"
          : "border-meoxa-border"
      }`}
    >
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-meoxa-orange text-white text-xs font-bold px-4 py-1 rounded-full">
          Populaire
        </span>
      )}
      <h3 className="text-xl font-bold text-meoxa-blue">{name}</h3>
      <div className="mt-4 mb-6">
        <span className="text-4xl font-bold text-meoxa-blue">
          {price.toFixed(2)} &euro;
        </span>
        <span className="text-meoxa-gray-dark text-sm">{intervalLabel}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm">
            <svg
              className="w-5 h-5 text-meoxa-orange shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-meoxa-gray-dark">{feature}</span>
          </li>
        ))}
      </ul>
      <Link href={planId ? `/api/stripe/checkout?planId=${planId}` : "/register"}>
        <Button
          variant={popular ? "primary" : "outline"}
          className="w-full"
        >
          Choisir ce plan
        </Button>
      </Link>
    </div>
  );
}
