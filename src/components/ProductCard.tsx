import Link from "next/link";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface ProductCardProps {
  slug: string;
  name: string;
  description: string;
  category: string;
  image?: string | null;
  startingPrice?: number;
}

export default function ProductCard({
  slug,
  name,
  description,
  category,
  image,
  startingPrice,
}: ProductCardProps) {
  return (
    <Card hover>
      {/* Image */}
      <div className="h-48 bg-meoxa-gray rounded-t-xl flex items-center justify-center overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-meoxa-blue/20 text-6xl font-bold">
            {name.charAt(0)}
          </div>
        )}
      </div>
      <CardContent>
        <span className="inline-block bg-meoxa-orange/10 text-meoxa-orange text-xs font-medium px-2.5 py-1 rounded-full mb-3">
          {category}
        </span>
        <h3 className="text-lg font-semibold text-meoxa-blue mb-2">{name}</h3>
        <p className="text-meoxa-gray-dark text-sm mb-4 line-clamp-2">
          {description}
        </p>
        <div className="flex items-center justify-between">
          {startingPrice !== undefined && (
            <span className="text-meoxa-blue font-bold">
              {startingPrice.toFixed(2)} &euro;/mois
            </span>
          )}
          <Link href={`/catalogue/${slug}`}>
            <Button size="sm">D&eacute;couvrir</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
