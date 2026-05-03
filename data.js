// ============================================================
// DONNEES PRODUITS — La Cave des Senteurs
// Modifiez ce fichier pour ajouter/modifier vos produits
// ============================================================

const WHATSAPP_NUMBER = "22898879988";

const PRODUCTS = [
  // ── PARFUMS ──────────────────────────────────────────────
  {
    id: 1,
    nom: "Sakura",
    marque: "Christian Dior",
    categorie: "parfums",
    prix: 45000,
    devise: "FCFA",
    description: "Un voyage olfactif au coeur du Japon. Sakura de Christian Dior capture la delicatesse de la fleur de cerisier, melee a la douceur de la rose et du musc. Une fragrance florale et poudree, legere comme un souffle de printemps.",
    notes: { tete: "Fleur de cerisier, Notes vertes", coeur: "Rose, Mimosa, Violette", fond: "Musc" },
    longevite: "6 heures",
    sillage: "Modere",
    genre: "Pour homme et femme",
    volume: "125 ml",
    nouveaute: true,
    images: ["img/sakura.jpg"],
    emoji: "&#127800;"
  },
  {
    id: 2,
    nom: "Rose Eternelle",
    categorie: "parfums",
    prix: 35000,
    devise: "FCFA",
    description: "Une fragrance florale envoutante aux notes de rose de Damas, de jasmin et de musc blanc. Un parfum intemporel qui evoque la feminite dans toute sa splendeur.",
    notes: { tete: "Bergamote, Citron", coeur: "Rose de Damas, Jasmin", fond: "Musc blanc, Santal" },
    volume: "50 ml",
    nouveaute: true,
    images: ["img/placeholder-parfum-1.jpg"],
    emoji: "&#127801;"
  },
  {
    id: 3,
    nom: "Oud Mystique",
    categorie: "parfums",
    prix: 55000,
    devise: "FCFA",
    description: "Un voyage olfactif vers l'Orient avec des notes profondes d'oud, de rose et d'ambre. Une fragrance de caractere pour les ames aventurieres.",
    notes: { tete: "Safran, Cardamome", coeur: "Rose, Oud", fond: "Ambre, Vanille, Musc" },
    volume: "100 ml",
    nouveaute: true,
    images: ["img/placeholder-parfum-2.jpg"],
    emoji: "&#10024;"
  },
  {
    id: 4,
    nom: "Fleur de Coton",
    categorie: "parfums",
    prix: 28000,
    devise: "FCFA",
    description: "Une fragrance douce et enveloppante aux notes de coton frais, de muguet et de vanille legere. La douceur a l'etat pur.",
    notes: { tete: "Muguet, Poire", coeur: "Coton, Pivoine", fond: "Vanille, Musc doux" },
    volume: "50 ml",
    nouveaute: false,
    images: ["img/placeholder-parfum-3.jpg"],
    emoji: "&#127800;"
  },
  {
    id: 5,
    nom: "Jasmin de Nuit",
    categorie: "parfums",
    prix: 42000,
    devise: "FCFA",
    description: "L'intensite du jasmin capturee au crepuscule. Une fragrance sensuelle et mysterieuse pour les soirees inoubliables.",
    notes: { tete: "Neroli, Bergamote", coeur: "Jasmin, Tuberose", fond: "Patchouli, Musc" },
    volume: "50 ml",
    nouveaute: true,
    images: ["img/placeholder-parfum-5.jpg"],
    emoji: "&#127769;"
  },

  // ── DIFFUSEURS ────────────────────────────────────────────
  {
    id: 6,
    nom: "Diffuseur Roses & Pivoine",
    categorie: "diffuseurs",
    prix: 18000,
    devise: "FCFA",
    description: "Un diffuseur a roseaux elegant aux senteurs florales de rose et de pivoine. Parfait pour parfumer votre salon ou chambre.",
    volume: "200 ml",
    duree: "4 a 6 semaines",
    nouveaute: true,
    images: ["img/placeholder-diffuseur-1.jpg"],
    emoji: "&#127802;"
  },
  {
    id: 7,
    nom: "Diffuseur Oud & Ambre",
    categorie: "diffuseurs",
    prix: 25000,
    devise: "FCFA",
    description: "Un diffuseur de luxe aux notes profondes d'oud et d'ambre. Une presence olfactive intense et raffinees.",
    volume: "250 ml",
    duree: "6 a 8 semaines",
    nouveaute: true,
    images: ["img/placeholder-diffuseur-4.jpg"],
    emoji: "&#10024;"
  },
  {
    id: 8,
    nom: "Diffuseur Linge Frais",
    categorie: "diffuseurs",
    prix: 15000,
    devise: "FCFA",
    description: "La fraicheur du linge propre capturee dans un diffuseur delicat. Une senteur propre et apaisante pour toutes les pieces.",
    volume: "150 ml",
    duree: "3 a 4 semaines",
    nouveaute: false,
    images: ["img/placeholder-diffuseur-3.jpg"],
    emoji: "&#128168;"
  },

  // ── HUILES PARFUMEES ──────────────────────────────────────
  {
    id: 9,
    nom: "Huile Rose & Argan",
    categorie: "huiles-parfumees",
    prix: 12000,
    devise: "FCFA",
    description: "Une huile precieuse melant l'argan et la rose de Damas. Nourrissante et parfumee, elle sublime la peau et les cheveux.",
    volume: "30 ml",
    utilisation: "Corps, cheveux",
    nouveaute: true,
    images: ["img/placeholder-huile-1.jpg"],
    emoji: "&#127801;"
  },
  {
    id: 10,
    nom: "Huile Precieuse Oud",
    categorie: "huiles-parfumees",
    prix: 30000,
    devise: "FCFA",
    description: "L'huile d'oud pure, un tresor de la parfumerie orientale. Quelques gouttes suffisent pour une fragrance intense et persistante.",
    volume: "10 ml",
    utilisation: "Corps, parfum",
    nouveaute: true,
    images: ["img/placeholder-huile-5.jpg"],
    emoji: "&#10024;"
  },
  {
    id: 11,
    nom: "Huile Bain Orientale",
    categorie: "huiles-parfumees",
    prix: 10000,
    devise: "FCFA",
    description: "Transformez votre bain en rituel de luxe avec cette huile aux notes d'oud, de rose et de musc. Peau douce et parfumee garantie.",
    volume: "100 ml",
    utilisation: "Bain",
    nouveaute: false,
    images: ["img/placeholder-huile-3.jpg"],
    emoji: "&#128705;"
  }
];

// Lien WhatsApp avec message pre-rempli
function getWhatsAppLink(produit) {
  const devise = produit.devise || "FCFA";
  const msg = encodeURIComponent(
    "Bonjour, je souhaite commander :\n\n" +
    "Produit : *" + produit.nom + "*\n" +
    (produit.marque ? "Marque : " + produit.marque + "\n" : "") +
    "Prix : " + produit.prix.toLocaleString() + " " + devise + "\n" +
    (produit.volume ? "Volume : " + produit.volume + "\n" : "") +
    "\nMerci de me confirmer la disponibilite."
  );
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + msg;
}

function getCategorieLabel(cat) {
  const labels = {
    "parfums": "Parfums",
    "diffuseurs": "Diffuseurs",
    "huiles-parfumees": "Huiles Parfumees"
  };
  return labels[cat] || cat;
}

function getPrixRange(produit) {
  if (produit.prix <= 10000) return "moins-30";
  if (produit.prix <= 25000) return "30-60";
  if (produit.prix <= 40000) return "60-100";
  return "plus-100";
}
