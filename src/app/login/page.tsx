"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou mot de passe incorrect.");
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-meoxa-blue">Connexion</h1>
          <p className="text-meoxa-gray-dark mt-2 text-sm">
            Acc&eacute;dez &agrave; votre espace MEOXA Marketplace
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
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            {loading ? "Connexion..." : "Se connecter"}
          </Button>

          <p className="text-center text-sm text-meoxa-gray-dark mt-4">
            Pas encore de compte ?{" "}
            <Link
              href="/register"
              className="text-meoxa-orange hover:text-meoxa-orange-hover font-medium"
            >
              S&apos;inscrire
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
