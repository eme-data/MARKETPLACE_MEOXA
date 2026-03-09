"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Card, { CardContent } from "@/components/ui/Card";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      longDescription: formData.get("longDescription"),
      category: formData.get("category"),
      version: formData.get("version"),
      demoUrl: formData.get("demoUrl"),
      downloadUrl: formData.get("downloadUrl"),
      published: formData.get("published") === "on",
    };

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const result = await res.json();
      setError(result.error || "Erreur lors de la création.");
      setLoading(false);
    } else {
      router.push("/admin/products");
      router.refresh();
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-meoxa-blue mb-6">
        Nouveau produit
      </h1>

      <Card>
        <CardContent>
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-meoxa-blue mb-1">
                  Nom du produit
                </label>
                <input
                  name="name"
                  required
                  className="w-full px-4 py-2.5 border border-meoxa-border rounded-lg focus:ring-2 focus:ring-meoxa-orange focus:border-transparent outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-meoxa-blue mb-1">
                  Slug (URL)
                </label>
                <input
                  name="slug"
                  required
                  placeholder="mon-logiciel"
                  className="w-full px-4 py-2.5 border border-meoxa-border rounded-lg focus:ring-2 focus:ring-meoxa-orange focus:border-transparent outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-meoxa-blue mb-1">
                Description courte
              </label>
              <textarea
                name="description"
                required
                rows={2}
                className="w-full px-4 py-2.5 border border-meoxa-border rounded-lg focus:ring-2 focus:ring-meoxa-orange focus:border-transparent outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-meoxa-blue mb-1">
                Description d&eacute;taill&eacute;e
              </label>
              <textarea
                name="longDescription"
                rows={6}
                className="w-full px-4 py-2.5 border border-meoxa-border rounded-lg focus:ring-2 focus:ring-meoxa-orange focus:border-transparent outline-none text-sm"
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-meoxa-blue mb-1">
                  Cat&eacute;gorie
                </label>
                <input
                  name="category"
                  required
                  placeholder="IA, Automatisation..."
                  className="w-full px-4 py-2.5 border border-meoxa-border rounded-lg focus:ring-2 focus:ring-meoxa-orange focus:border-transparent outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-meoxa-blue mb-1">
                  Version
                </label>
                <input
                  name="version"
                  defaultValue="1.0.0"
                  className="w-full px-4 py-2.5 border border-meoxa-border rounded-lg focus:ring-2 focus:ring-meoxa-orange focus:border-transparent outline-none text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-meoxa-blue mb-1">
                  URL D&eacute;mo
                </label>
                <input
                  name="demoUrl"
                  type="url"
                  className="w-full px-4 py-2.5 border border-meoxa-border rounded-lg focus:ring-2 focus:ring-meoxa-orange focus:border-transparent outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-meoxa-blue mb-1">
                URL de t&eacute;l&eacute;chargement
              </label>
              <input
                name="downloadUrl"
                type="url"
                className="w-full px-4 py-2.5 border border-meoxa-border rounded-lg focus:ring-2 focus:ring-meoxa-orange focus:border-transparent outline-none text-sm"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="published"
                id="published"
                className="w-4 h-4 accent-meoxa-orange"
              />
              <label htmlFor="published" className="text-sm text-meoxa-blue">
                Publier imm&eacute;diatement
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Cr\u00e9ation..." : "Cr\u00e9er le produit"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.back()}
              >
                Annuler
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
