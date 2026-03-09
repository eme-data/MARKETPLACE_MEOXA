import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@meoxa.fr" },
    update: {},
    create: {
      name: "Admin MEOXA",
      email: "admin@meoxa.fr",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("Admin created:", admin.email);

  // Create demo user
  const userPassword = await bcrypt.hash("user123456", 12);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@meoxa.fr" },
    update: {},
    create: {
      name: "Jean Dupont",
      email: "demo@meoxa.fr",
      password: userPassword,
      role: "USER",
    },
  });
  console.log("Demo user created:", demoUser.email);

  // Create products
  const products = [
    {
      name: "MEOXA Analytics",
      slug: "meoxa-analytics",
      description:
        "Solution d'analyse de données alimentée par l'IA. Visualisez et comprenez vos données en temps réel.",
      longDescription:
        "MEOXA Analytics est une solution complète d'analyse de données qui utilise l'intelligence artificielle pour vous aider à comprendre vos données.\n\nGrâce à des algorithmes avancés de machine learning, notre outil détecte automatiquement les tendances, anomalies et opportunités dans vos données.\n\nFonctionnalités principales :\n- Tableaux de bord personnalisables\n- Détection automatique d'anomalies\n- Prédictions basées sur l'IA\n- Export de rapports PDF\n- API REST complète",
      category: "Analytics",
      tags: ["IA", "Analytics", "Data"],
      featured: true,
      published: true,
      version: "2.1.0",
    },
    {
      name: "MEOXA Automate",
      slug: "meoxa-automate",
      description:
        "Automatisez vos processus métier grâce à l'IA. Créez des workflows intelligents sans code.",
      longDescription:
        "MEOXA Automate vous permet de créer des workflows d'automatisation complexes avec une interface visuelle simple.\n\nPlus besoin de coder : notre IA comprend vos besoins et configure les automatisations pour vous.\n\nCas d'usage :\n- Automatisation des emails\n- Traitement de documents\n- Synchronisation de données\n- Notifications intelligentes",
      category: "Automatisation",
      tags: ["IA", "Automatisation", "No-code"],
      featured: true,
      published: true,
      version: "1.5.0",
    },
    {
      name: "MEOXA CRM",
      slug: "meoxa-crm",
      description:
        "CRM intelligent avec scoring IA des leads et prédiction de conversion.",
      longDescription:
        "MEOXA CRM est un outil de gestion de la relation client qui intègre l'intelligence artificielle pour scorer vos leads et prédire les conversions.\n\nOptimisez votre pipeline commercial grâce à des insights IA actionables.",
      category: "CRM",
      tags: ["IA", "CRM", "Ventes"],
      featured: false,
      published: true,
      version: "3.0.0",
    },
    {
      name: "MEOXA Chatbot",
      slug: "meoxa-chatbot",
      description:
        "Chatbot IA personnalisable pour votre site web. Support client 24/7 intelligent.",
      longDescription:
        "Déployez un chatbot IA sur votre site en quelques minutes. Notre technologie NLP avancée comprend les questions de vos clients et y répond avec précision.",
      category: "Support",
      tags: ["IA", "Chatbot", "Support"],
      featured: false,
      published: true,
      version: "1.2.0",
    },
  ];

  for (const productData of products) {
    const product = await prisma.product.upsert({
      where: { slug: productData.slug },
      update: {},
      create: productData,
    });

    // Create plans for each product
    const plans = [
      {
        productId: product.id,
        name: "Starter",
        description: "Pour les petites équipes",
        price: 29,
        interval: "MONTHLY" as const,
        features: [
          "1 utilisateur",
          "Fonctionnalités de base",
          "Support email",
          "Mises à jour incluses",
        ],
        popular: false,
      },
      {
        productId: product.id,
        name: "Pro",
        description: "Pour les équipes en croissance",
        price: 79,
        interval: "MONTHLY" as const,
        features: [
          "5 utilisateurs",
          "Toutes les fonctionnalités",
          "Support prioritaire",
          "API access",
          "Mises à jour incluses",
        ],
        popular: true,
      },
      {
        productId: product.id,
        name: "Enterprise",
        description: "Pour les grandes organisations",
        price: 199,
        interval: "MONTHLY" as const,
        features: [
          "Utilisateurs illimités",
          "Toutes les fonctionnalités",
          "Support dédié 24/7",
          "API access",
          "Intégration sur mesure",
          "SLA garanti",
        ],
        popular: false,
      },
    ];

    for (const planData of plans) {
      await prisma.plan.create({ data: planData });
    }

    console.log(`Product created: ${product.name} with 3 plans`);
  }

  // Create blog posts
  const blogPosts = [
    {
      title: "Comment l'IA transforme les entreprises en 2026",
      slug: "ia-transforme-entreprises-2026",
      excerpt:
        "Découvrez comment l'intelligence artificielle révolutionne les processus métier et booste la productivité.",
      content:
        "L'intelligence artificielle n'est plus un concept futuriste. En 2026, elle est devenue un outil incontournable pour les entreprises de toutes tailles.\n\nDe l'automatisation des tâches répétitives à l'analyse prédictive, l'IA offre des possibilités infinies pour optimiser vos opérations.\n\nChez MEOXA, nous développons des solutions IA accessibles à tous. Nos outils sont conçus pour être simples à utiliser tout en offrant des résultats professionnels.\n\nDécouvrez notre catalogue de logiciels IA et commencez votre transformation digitale dès aujourd'hui.",
      published: true,
      publishedAt: new Date(),
    },
    {
      title: "5 raisons d'automatiser vos processus métier",
      slug: "5-raisons-automatiser-processus",
      excerpt:
        "L'automatisation est la clé de la productivité. Voici 5 raisons de franchir le pas.",
      content:
        "1. Gain de temps considérable\nL'automatisation élimine les tâches répétitives et libère vos équipes pour des missions à plus forte valeur ajoutée.\n\n2. Réduction des erreurs\nLes processus automatisés sont plus fiables et réduisent significativement les erreurs humaines.\n\n3. Scalabilité\nVos processus automatisés peuvent gérer un volume croissant sans augmentation proportionnelle des coûts.\n\n4. Meilleure expérience client\nDes réponses plus rapides et plus cohérentes améliorent la satisfaction de vos clients.\n\n5. Avantage concurrentiel\nLes entreprises automatisées sont plus agiles et s'adaptent plus rapidement aux changements du marché.",
      published: true,
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    });
    console.log(`Blog post created: ${post.title}`);
  }

  console.log("\nSeed completed successfully!");
  console.log("\nTest accounts:");
  console.log("  Admin: admin@meoxa.fr / admin123456");
  console.log("  User:  demo@meoxa.fr / user123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
