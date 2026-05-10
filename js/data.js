// ============================================================
// DONNEES PRODUITS — La Cave des Senteurs
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
    nom: "Good Girl Gone Bad",
    marque: "By Kilian",
    categorie: "parfums",
    prix: 52000,
    devise: "FCFA",
    description: "Good Girl Gone Bad de By Kilian est une fragrance florale et fruitee pour femme. Un bouquet envoûtant d'osmanthus, tuberose et jasmin, avec une touche d'ambre. Sensuelle, audacieuse et inoubliable.",
    notes: { tete: "Osmanthus, Tuberose", coeur: "Jasmin, Narcisse, Rose", fond: "Ambre" },
    longevite: "7 heures",
    sillage: "Fort",
    genre: "Pour femme",
    volume: "50 ml",
    nouveaute: true,
    images: ["img/gone-girl-2026.jpeg"],
    emoji: "&#127801;"
  },
  {
    id: 3,
    nom: "Imagination",
    marque: "Louis Vuitton",
    categorie: "parfums",
    prix: 45000,
    devise: "FCFA",
    description: "Imagination de Louis Vuitton est une fragrance fraiche et agrumee pour homme. Un melange enivrant de the, cedrat et bergamote, rehausse de neroli et d'ambroxan. Elegance et modernite reunies.",
    notes: { tete: "The, Cedrat, Bergamote", coeur: "Orange, Neroli", fond: "Ambroxan, Ambre" },
    longevite: "7 heures",
    sillage: "Fort",
    genre: "Pour homme",
    volume: "100 ml",
    nouveaute: true,
    images: ["img/imagination-new.jpeg"],
    emoji: "&#128167;"
  },
  {
    id: 4,
    nom: "Tobacco Honey",
    marque: "Guerlain",
    categorie: "parfums",
    prix: 45000,
    devise: "FCFA",
    description: "Tobacco Honey de Guerlain est une fragrance orientale gourmande. Un accord envoûtant de miel, tabac et vanille, rehausse de feve de tonka et d'oud. Chaleureux, enveloppant et profondement sensuel.",
    notes: { tete: "Miel, Tabac", coeur: "Vanille, Feve de tonka", fond: "Clou de girofle, Oud" },
    longevite: "8 heures",
    sillage: "Fort",
    genre: "Pour homme et femme",
    volume: "200 ml",
    nouveaute: true,
    images: ["img/tabaco-new.jpeg"],
    emoji: "&#127855;"
  },
  {
    id: 5,
    nom: "Irresistible Rose Velvet",
    marque: "Givenchy",
    categorie: "parfums",
    prix: 40000,
    devise: "FCFA",
    description: "Irresistible Rose Velvet de Givenchy est une eau de parfum florale et veloutee pour femme. La rose se pare d'une intensite nouvelle, profonde et sensuelle. Un sillage envoûtant qui allie douceur et caractere.",
    notes: { tete: "Rose, Bergamote", coeur: "Rose veloutee, Pivoine", fond: "Musc blanc, Bois de santal" },
    longevite: "7 heures",
    sillage: "Modere",
    genre: "Pour femme",
    volume: "50 ml",
    nouveaute: true,
    images: ["img/parfums.jpeg"],
    emoji: "&#127801;"
  },
  {
    id: 6,
    nom: "Ultra Male",
    marque: "Jean Paul Gaultier",
    categorie: "parfums",
    prix: 46600,
    devise: "FCFA",
    description: "Ultra Male de Jean Paul Gaultier est une fragrance orientale et gourmande pour homme. Une version plus intense et seduisante du celebre Le Male. Notes de poire, lavande et vanille pour un homme audacieux et magnetique.",
    notes: { tete: "Poire, Bergamote", coeur: "Lavande, Iris", fond: "Vanille, Ambre, Musc" },
    longevite: "8 heures",
    sillage: "Fort",
    genre: "Pour homme",
    volume: "125 ml",
    nouveaute: true,
    images: ["img/ultra-male.jpeg"],
    emoji: "&#128171;"
  },

  // ── DIFFUSEURS ────────────────────────────────────────────
  {
    id: 7,
    nom: "Diffuseur Loris Mangue",
    marque: "Loris",
    categorie: "diffuseurs",
    prix: 8500,
    devise: "FCFA",
    description: "Diffuseur a roseaux Loris aux notes fruitees et gourmandes de mangue. Un parfum tropical et ensolleille qui transforme votre interieur en un veritable paradis olfactif.",
    volume: "Grand format",
    duree: "4 a 6 semaines",
    nouveaute: true,
    images: ["img/diffiseures.jpeg"],
    emoji: "&#127818;"
  },
  {
    id: 8,
    nom: "Diffuseur Loris Fruits",
    marque: "Loris",
    categorie: "diffuseurs",
    prix: 8500,
    devise: "FCFA",
    description: "Diffuseur a roseaux Loris aux notes fruitees et florales. Un melange frais et sucre qui parfume delicatement chaque piece de votre maison avec elegance.",
    volume: "Grand format",
    duree: "4 a 6 semaines",
    nouveaute: true,
    images: ["img/diffisueres5.jpeg"],
    emoji: "&#127815;"
  },
  {
    id: 9,
    nom: "Diffuseur Loris Fleurs Blanches",
    marque: "Loris",
    categorie: "diffuseurs",
    prix: 8500,
    devise: "FCFA",
    description: "Diffuseur a roseaux Loris aux notes florales blanches et poudrees. La purete des fleurs blanches capturee dans un diffuseur elegant pour un interieur toujours parfume.",
    volume: "Grand format",
    duree: "4 a 6 semaines",
    nouveaute: false,
    images: ["img/div1.jpeg"],
    emoji: "&#129716;"
  },
  {
    id: 10,
    nom: "Diffuseur Loris Mini",
    marque: "Loris",
    categorie: "diffuseurs",
    prix: 5500,
    devise: "FCFA",
    description: "Diffuseur a roseaux Loris format mini, ideal pour les petits espaces. Parfumez votre bureau, salle de bain ou entree avec cette fragrance delicate et persistante.",
    volume: "Petit format",
    duree: "2 a 3 semaines",
    nouveaute: false,
    images: ["img/div2.jpeg"],
    emoji: "&#127807;"
  },

  // ── HUILES PARFUMEES ──────────────────────────────────────
  {
    id: 11,
    nom: "Huile Parfumee Gloria",
    marque: "Gloria Perfume",
    categorie: "huiles-parfumees",
    prix: 8500,
    devise: "FCFA",
    description: "Huile parfumee Gloria Perfume en flacon roll-on de 10ml. Une fragrance concentree et longue tenue pour parfumer votre peau toute la journee. Pratique et elegante.",
    volume: "10 ml",
    utilisation: "Corps, poignets, cou",
    nouveaute: true,
    images: ["img/huile1.png"],
    emoji: "&#127801;"
  },
  {
    id: 12,
    nom: "Huile Parfumee Gloria Noire",
    marque: "Gloria Perfume",
    categorie: "huiles-parfumees",
    prix: 8500,
    devise: "FCFA",
    description: "Huile parfumee Gloria Perfume edition noire en flacon roll-on de 10ml. Une fragrance orientale intense et envoûtante. Quelques gouttes suffisent pour un sillage remarquable.",
    volume: "10 ml",
    utilisation: "Corps, poignets, cou",
    nouveaute: true,
    images: ["img/huile2.png"],
    emoji: "&#10024;"
  },
  {
    id: 13,
    nom: "Huile Parfumee Gloria Rouge",
    marque: "Gloria Perfume",
    categorie: "huiles-parfumees",
    prix: 8500,
    devise: "FCFA",
    description: "Huile parfumee Gloria Perfume edition rouge en flacon roll-on de 10ml. Une fragrance florale et fruitee, douce et feminine. Parfaite pour un usage quotidien.",
    volume: "10 ml",
    utilisation: "Corps, poignets, cou",
    nouveaute: false,
    images: ["img/huile.jpeg"],
    emoji: "&#128705;"
  },
  {
    id: 14,
    nom: "Huile Parfumee Gloria Or",
    marque: "Gloria Perfume",
    categorie: "huiles-parfumees",
    prix: 8500,
    devise: "FCFA",
    description: "Huile parfumee Gloria Perfume edition or en flacon roll-on de 10ml. Une fragrance precieuse et luxueuse aux notes orientales. Un tresor olfactif a porter sur soi.",
    volume: "10 ml",
    utilisation: "Corps, poignets, cou",
    nouveaute: true,
    images: ["img/Gloria.jpeg"],
    emoji: "&#127818;"
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
  if (produit.prix <= 9999)  return "moins-30";   // Moins de 10 000
  if (produit.prix <= 19999) return "30-60";       // 10 000 – 20 000
  if (produit.prix <= 46000) return "60-100";      // 40 000 – 46 000
  return "plus-100";                               // Plus de 46 000
}
