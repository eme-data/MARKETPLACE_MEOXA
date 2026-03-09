"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (form.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Erreur lors de l'inscription.");
      setLoading(false);
    } else {
      router.push("/login?registered=true");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-meoxa-blue">
            Cr&eacute;er un compte
          </h1>
          <p className="text-meoxa-gray-dark mt-2 text-sm">
            Rejoignez MEOXA Marketplace et acc&eacute;dez &agrave; nos logiciels
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl border border-meoxa-border p-8 shadow-sm"
        >
          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-meoxa-blue mb-1">
                Nom complet
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-meoxa-border rounded-lg focus:ring-2 focus:ring-meoxa-orange focus:border-transparent outline-none text-sm"
                placeholder="Jean Dupont"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-meoxa-blue mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-meoxa-border rounded-lg focus:ring-2 focus:ring-meoxa-orange focus:border-transparent outline-none text-sm"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-meoxa-blue mb-1">
                Mot de passe
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="w-full px-4 py-2.5 border border-meoxa-border rounded-lg focus:ring-2 focus:ring-meoxa-orange focus:border-transparent outline-none text-sm"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-meoxa-blue mb-1">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
                required
                className="w-full px-4 py-2.5 border border-meoxa-border rounded-lg focus:ring-2 focus:ring-meoxa-orange focus:border-transparent outline-none text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full mt-6"
          >
            {loading ? "Inscription..." : "S'inscrire"}
          </Button>

          <p className="text-center text-sm text-meoxa-gray-dark mt-4">
            D&eacute;j&agrave; un compte ?{" "}
            <Link
              href="/login"
              className="text-meoxa-orange hover:text-meoxa-orange-hover font-medium"
            >
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
