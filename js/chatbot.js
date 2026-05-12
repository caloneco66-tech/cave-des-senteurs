// ============================================================
// CHATBOT — La Cave des Senteurs — Conseiller Universel
// Gère : parfums, diffuseurs, huiles, sprays, voiture
// ============================================================

var CHATBOT_STEPS = [
  {
    id: "welcome",
    message: "Bonjour ! Je suis votre conseiller olfactif. Je peux vous aider à trouver un parfum, un diffuseur, une huile parfumée ou un spray. Par où commençons-nous ?",
    options: [
      { label: "🌸 Un parfum", value: "cat_parfums" },
      { label: "🕯️ Un diffuseur", value: "cat_diffuseurs" },
      { label: "✨ Une huile parfumée", value: "cat_huiles" },
      { label: "💨 Un spray d'intérieur", value: "cat_sprays" },
      { label: "🚗 Diffuseur voiture", value: "cat_voiture" }
    ],
    key: "categorie_souhaitee",
    next: "usage"
  },
  {
    id: "usage",
    message: "C'est pour qui ?",
    options: [
      { label: "Pour moi", value: "moi" },
      { label: "Un cadeau", value: "cadeau" },
      { label: "Ma maison / voiture", value: "maison" }
    ],
    key: "usage",
    next: "ambiance"
  },
  {
    id: "ambiance",
    message: "Quelle ambiance vous attire ?",
    options: [
      { label: "🌸 Floral & Doux", value: "floral" },
      { label: "🔥 Oriental & Chaud", value: "oriental" },
      { label: "🍋 Frais & Citrus", value: "frais" },
      { label: "🍬 Gourmand & Sucré", value: "gourmand" },
      { label: "🌿 Boisé & Naturel", value: "boise" },
      { label: "🍑 Fruité", value: "fruite" }
    ],
    key: "ambiance",
    next: "budget"
  },
  {
    id: "budget",
    message: "Quel est votre budget ?",
    options: [
      { label: "Moins de 5 000 FCFA", value: "tres_petit" },
      { label: "5 000 – 10 000 FCFA", value: "petit" },
      { label: "10 000 – 40 000 FCFA", value: "moyen" },
      { label: "Plus de 40 000 FCFA", value: "grand" },
      { label: "Pas de limite", value: "illimite" }
    ],
    key: "budget",
    next: "result"
  }
];

// ── Algorithme de scoring universel ─────────────────────────
function scoreProduct(p, prefs) {
  var score = 0;
  var desc = (p.description + " " + (p.notes ? JSON.stringify(p.notes) : "")).toLowerCase();
  var cat = prefs.categorie_souhaitee || "";

  // ── CATÉGORIE (poids fort) ──
  if (cat === "cat_parfums" && p.categorie === "parfums") score += 8;
  else if (cat === "cat_diffuseurs" && p.categorie === "diffuseurs" && p.prix > 3000) score += 8;
  else if (cat === "cat_huiles" && p.categorie === "huiles-parfumees") score += 8;
  else if (cat === "cat_sprays" && p.categorie === "sprays") score += 8;
  else if (cat === "cat_voiture" && p.categorie === "diffuseurs" && p.prix <= 2000) score += 8;
  else score += 1; // autre catégorie = score faible

  // ── AMBIANCE ──
  var amb = prefs.ambiance || "";
  if (amb === "floral") {
    if (desc.match(/floral|rose|jasmin|fleur|pivoine|hibiscus|cerisier|lilas/)) score += 5;
  } else if (amb === "oriental") {
    if (desc.match(/oriental|oud|ambre|tabac|vanille|miel|praline|encens|musc/)) score += 5;
  } else if (amb === "frais") {
    if (desc.match(/frais|agrume|bergamote|cedrat|the|citron|menthe|aquatique/)) score += 5;
  } else if (amb === "gourmand") {
    if (desc.match(/gourmand|miel|vanille|praline|poire|sucr|caramel|barbe|candy/)) score += 5;
  } else if (amb === "boise") {
    if (desc.match(/bois|santal|vetiver|patchouli|cedre|cuir/)) score += 5;
  } else if (amb === "fruite") {
    if (desc.match(/fruit|peche|mangue|framboise|grenade|melon|cerise|agrume|poire/)) score += 5;
  }

  // ── BUDGET ──
  var bud = prefs.budget || "";
  if (bud === "tres_petit") {
    if (p.prix > 0 && p.prix <= 2000) score += 6;
    else if (p.prix > 2000 && p.prix <= 5000) score += 3;
    else if (p.prix > 5000) score -= 2;
  } else if (bud === "petit") {
    if (p.prix > 0 && p.prix <= 10000) score += 6;
    else if (p.prix > 10000) score -= 1;
  } else if (bud === "moyen") {
    if (p.prix > 5000 && p.prix <= 40000) score += 6;
    else if (p.prix === 0) score += 3;
  } else if (bud === "grand" || bud === "illimite") {
    if (p.prix > 40000 || p.prix === 0) score += 6;
    else score += 2;
  }

  // ── USAGE ──
  var usage = prefs.usage || "";
  if (usage === "maison" && (p.categorie === "diffuseurs" || p.categorie === "sprays")) score += 3;
  if (usage === "moi" && p.categorie === "parfums") score += 2;
  if (usage === "moi" && p.categorie === "huiles-parfumees") score += 2;

  // ── BONUS qualité ──
  if (p.bestSeller) score += 2;
  if (p.nouveaute) score += 1;

  return score;
}

// ── HTML du chatbot ──────────────────────────────────────────
function buildChatbotHTML() {
  return '<div class="chatbot-bubble" id="chatbot-bubble" onclick="toggleChatbot()" aria-label="Conseiller olfactif">'
    + '<img src="img/parfum-icon.png" alt="" class="chatbot-bubble__img" onerror="this.style.display=\'none\'" />'
    + '<span class="chatbot-bubble__label">Conseiller</span>'
    + '<span class="chatbot-bubble__notif" id="chatbot-notif">1</span>'
    + '</div>'
    + '<div class="chatbot-window" id="chatbot-window" role="dialog" aria-hidden="true">'
    + '<div class="chatbot-header">'
    + '<div class="chatbot-header__info">'
    + '<img src="img/parfum-icon.png" alt="" class="chatbot-header__img" onerror="this.style.display=\'none\'" />'
    + '<div><strong>Conseiller La Cave</strong><span class="chatbot-header__status">&#9679; En ligne</span></div>'
    + '</div>'
    + '<button class="chatbot-close" onclick="toggleChatbot()" aria-label="Fermer">&#10005;</button>'
    + '</div>'
    + '<div class="chatbot-messages" id="chatbot-messages"></div>'
    + '<div class="chatbot-options" id="chatbot-options"></div>'
    + '</div>';
}

// ── État ─────────────────────────────────────────────────────
var chatState = { open: false, stepIndex: 0, prefs: {}, started: false };

function toggleChatbot() {
  chatState.open = !chatState.open;
  var win = document.getElementById("chatbot-window");
  var notif = document.getElementById("chatbot-notif");
  if (chatState.open) {
    win.classList.add("chatbot-window--open");
    win.setAttribute("aria-hidden", "false");
    if (notif) notif.style.display = "none";
    if (!chatState.started) {
      chatState.started = true;
      setTimeout(function() { showStep(0); }, 300);
    }
  } else {
    win.classList.remove("chatbot-window--open");
    win.setAttribute("aria-hidden", "true");
  }
}

function showStep(index) {
  var step = CHATBOT_STEPS[index];
  if (!step) return;
  chatState.stepIndex = index;
  addBotMessage(step.message);
  setTimeout(function() { showOptions(step.options); }, 600);
}

function addBotMessage(text) {
  var msgs = document.getElementById("chatbot-messages");
  if (!msgs) return;
  var div = document.createElement("div");
  div.className = "chatbot-msg chatbot-msg--bot";
  div.innerHTML = '<div class="chatbot-msg__bubble">' + text + '</div>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function addUserMessage(text) {
  var msgs = document.getElementById("chatbot-messages");
  if (!msgs) return;
  var div = document.createElement("div");
  div.className = "chatbot-msg chatbot-msg--user";
  div.innerHTML = '<div class="chatbot-msg__bubble">' + text + '</div>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showOptions(options) {
  var container = document.getElementById("chatbot-options");
  if (!container) return;
  var html = "";
  for (var i = 0; i < options.length; i++) {
    var lbl = options[i].label.replace(/'/g, "&#39;");
    html += '<button class="chatbot-opt" onclick="selectOption(\'' + options[i].value + '\',\'' + lbl + '\')">' + options[i].label + '</button>';
  }
  container.innerHTML = html;
}

function selectOption(value, label) {
  document.getElementById("chatbot-options").innerHTML = "";
  addUserMessage(label);
  var step = CHATBOT_STEPS[chatState.stepIndex];
  if (step.key) chatState.prefs[step.key] = value;

  if (step.next === "result") {
    setTimeout(function() { showResults(); }, 800);
  } else {
    var nextIndex = CHATBOT_STEPS.findIndex(function(s) { return s.id === step.next; });
    if (nextIndex !== -1) setTimeout(function() { showStep(nextIndex); }, 500);
  }
}

function showResults() {
  var msgs = document.getElementById("chatbot-messages");

  // Scorer tous les produits
  var results = PRODUCTS.map(function(p) {
    return { produit: p, score: scoreProduct(p, chatState.prefs) };
  });
  results.sort(function(a, b) { return b.score - a.score; });
  var recs = results.slice(0, 3).map(function(r) { return r.produit; });

  // Message contextuel selon catégorie
  var catLabels = {
    cat_parfums: "parfums", cat_diffuseurs: "diffuseurs",
    cat_huiles: "huiles parfumées", cat_sprays: "sprays d'intérieur",
    cat_voiture: "diffuseurs de voiture"
  };
  var catLabel = catLabels[chatState.prefs.categorie_souhaitee] || "produits";
  addBotMessage("Voici mes meilleures recommandations en " + catLabel + " pour vous ✨");

  recs.forEach(function(p, j) {
    setTimeout(function() {
      var card = document.createElement("div");
      card.className = "chatbot-product-card";
      var imgHTML = (p.images && p.images[0])
        ? '<img src="' + p.images[0] + '" alt="' + p.nom + '" style="width:100%;height:100%;object-fit:cover;display:block;" onerror="this.style.display=\'none\'" />'
        : '<span style="font-size:2rem;display:flex;align-items:center;justify-content:center;height:100%;">' + (p.emoji || "🛍️") + '</span>';
      var prixHTML = p.prix > 0 ? p.prix.toLocaleString() + ' ' + (p.devise || 'FCFA') : 'Prix sur demande';

      card.innerHTML =
        '<a href="produit.html?id=' + p.id + '" class="chatbot-product-card__link">'
        + '<div class="chatbot-product-card__media">' + imgHTML + '</div>'
        + '<div class="chatbot-product-card__info">'
        + '<p class="chatbot-product-card__cat">' + getCategorieLabel(p.categorie) + '</p>'
        + '<strong class="chatbot-product-card__name">' + p.nom + '</strong>'
        + '<p class="chatbot-product-card__marque">' + (p.marque || '') + '</p>'
        + '<p class="chatbot-product-card__prix">' + prixHTML + '</p>'
        + '</div></a>'
        + '<div class="chatbot-product-card__footer">'
        + '<button class="chatbot-btn chatbot-btn--panier" onclick="Panier&&Panier.ajouter(' + JSON.stringify({id:p.id,nom:p.nom,marque:p.marque||"",prix:p.prix,devise:p.devise||"FCFA",images:p.images,emoji:p.emoji||"🛍️"}).replace(/"/g,"'") + ')">🛍️ Panier</button>'
        + '<a href="' + getWhatsAppLink(p) + '" class="chatbot-btn chatbot-btn--wa" target="_blank" rel="noopener">Commander</a>'
        + '</div>';

      msgs.appendChild(card);
      msgs.scrollTop = msgs.scrollHeight;
    }, 400 + j * 500);
  });

  setTimeout(function() {
    addBotMessage("Vous pouvez ajouter au panier ou commander directement sur WhatsApp 😊");
    document.getElementById("chatbot-options").innerHTML =
      '<a href="https://wa.me/' + WHATSAPP_NUMBER + '?text=Bonjour%2C%20j%27ai%20besoin%20de%20conseils." class="chatbot-opt chatbot-opt--whatsapp" target="_blank" rel="noopener">💬 Parler sur WhatsApp</a>'
      + '<button class="chatbot-opt" onclick="resetChatbot()">🔄 Recommencer</button>';
  }, 400 + recs.length * 500 + 600);
}

function resetChatbot() {
  chatState.prefs = {};
  chatState.stepIndex = 0;
  document.getElementById("chatbot-messages").innerHTML = "";
  document.getElementById("chatbot-options").innerHTML = "";
  setTimeout(function() { showStep(0); }, 300);
}

// ── Init ─────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function() {
  var container = document.createElement("div");
  container.id = "chatbot-container";
  container.innerHTML = buildChatbotHTML();
  document.body.appendChild(container);
  setTimeout(function() {
    var notif = document.getElementById("chatbot-notif");
    if (notif && !chatState.open) notif.style.display = "flex";
  }, 3000);
});
