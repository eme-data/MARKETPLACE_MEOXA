"use client";

import { useState, useEffect } from "react";
import Card, { CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/blog")
      .then((r) => r.json())
      .then(setPosts)
      .catch(console.error);
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/admin/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.get("title"),
        slug: formData.get("slug"),
        excerpt: formData.get("excerpt"),
        content: formData.get("content"),
        published: formData.get("published") === "on",
      }),
    });

    if (res.ok) {
      const post = await res.json();
      setPosts([post, ...posts]);
      setShowForm(false);
    }
    setLoading(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-meoxa-blue">Blog</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Annuler" : "Nouvel article"}
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  name="title"
                  required
                  placeholder="Titre de l'article"
                  className="px-4 py-2.5 border border-meoxa-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-meoxa-orange"
                />
                <input
                  name="slug"
                  required
                  placeholder="slug-de-larticle"
                  className="px-4 py-2.5 border border-meoxa-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-meoxa-orange"
                />
              </div>
              <textarea
                name="excerpt"
                rows={2}
                placeholder="R&eacute;sum&eacute; (optionnel)"
                className="w-full px-4 py-2.5 border border-meoxa-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-meoxa-orange"
              />
              <textarea
                name="content"
                required
                rows={8}
                placeholder="Contenu de l'article..."
                className="w-full px-4 py-2.5 border border-meoxa-border rounded-lg text-sm outline-none focus:ring-2 focus:ring-meoxa-orange"
              />
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="published"
                    className="w-4 h-4 accent-meoxa-orange"
                  />
                  Publier
                </label>
                <Button type="submit" disabled={loading}>
                  {loading ? "Cr\u00e9ation..." : "Cr\u00e9er"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-meoxa-border">
                <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                  Titre
                </th>
                <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                  Statut
                </th>
                <th className="text-left p-4 text-meoxa-gray-dark font-medium">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-meoxa-border last:border-0"
                >
                  <td className="p-4 font-medium text-meoxa-blue">
                    {post.title}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        post.published
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {post.published ? "Publi\u00e9" : "Brouillon"}
                    </span>
                  </td>
                  <td className="p-4 text-meoxa-gray-dark">
                    {new Date(post.createdAt).toLocaleDateString("fr-FR")}
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="p-8 text-center text-meoxa-gray-dark"
                  >
                    Aucun article.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
