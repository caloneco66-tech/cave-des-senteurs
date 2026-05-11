// ============================================================
// CHATBOT — La Cave des Senteurs — Guide Olfactif
// ============================================================

var CHATBOT_STEPS = [
  {
    id: "welcome",
    message: "Bonjour ! Repondez a quelques questions et je vous trouve le parfum fait pour vous.",
    options: [ { label: "Decouvrir mon parfum", value: "start" } ],
    next: "genre"
  },
  {
    id: "genre",
    message: "Ce parfum est pour qui ?",
    options: [
      { label: "Pour moi (femme)", value: "femme" },
      { label: "Pour moi (homme)", value: "homme" },
      { label: "Un cadeau", value: "mixte" }
    ],
    key: "genre",
    next: "famille"
  },
  {
    id: "famille",
    message: "Quelle senteur vous attire ?",
    options: [
      { label: "Floral et Doux", value: "floral" },
      { label: "Oriental et Chaud", value: "oriental" },
      { label: "Frais et Citrus", value: "frais" },
      { label: "Gourmand et Sucre", value: "gourmand" }
    ],
    key: "famille",
    next: "occasion"
  },
  {
    id: "occasion",
    message: "Pour quelle occasion ?",
    options: [
      { label: "Quotidien", value: "quotidien" },
      { label: "Soiree", value: "soiree" },
      { label: "Travail", value: "travail" }
    ],
    key: "occasion",
    next: "budget"
  },
  {
    id: "budget",
    message: "Quel est votre budget ?",
    options: [
      { label: "Moins de 10 000 FCFA", value: "petit" },
      { label: "40 000 - 50 000 FCFA", value: "moyen" },
      { label: "Plus de 50 000 FCFA", value: "grand" }
    ],
    key: "budget",
    next: "result"
  }
];

// ── Algorithme de matching ───────────────────────────────────
function getRecommendations(prefs) {
  var results = [];

  for (var i = 0; i < PRODUCTS.length; i++) {
    var p = PRODUCTS[i];
    var score = 0;
    var desc = (p.description + " " + (p.notes ? JSON.stringify(p.notes) : "")).toLowerCase();
    var genre = p.genre ? p.genre.toLowerCase() : "";

    // GENRE
    if (prefs.genre === "femme") {
      if (genre.indexOf("femme") !== -1) score += 3;
    } else if (prefs.genre === "homme") {
      if (genre.indexOf("homme") !== -1) score += 3;
    } else {
      score += 2; // cadeau = tous eligibles
    }

    // FAMILLE
    if (prefs.famille === "floral") {
      if (desc.indexOf("floral") !== -1 || desc.indexOf("rose") !== -1 || desc.indexOf("jasmin") !== -1 || desc.indexOf("fleur") !== -1 || desc.indexOf("pivoine") !== -1 || desc.indexOf("hibiscus") !== -1) score += 4;
      else score += 1;
    } else if (prefs.famille === "oriental") {
      if (desc.indexOf("oriental") !== -1 || desc.indexOf("oud") !== -1 || desc.indexOf("ambre") !== -1 || desc.indexOf("tabac") !== -1 || desc.indexOf("vanille") !== -1 || desc.indexOf("miel") !== -1 || desc.indexOf("praline") !== -1) score += 4;
      else score += 1;
    } else if (prefs.famille === "frais") {
      if (desc.indexOf("frais") !== -1 || desc.indexOf("agrume") !== -1 || desc.indexOf("bergamote") !== -1 || desc.indexOf("cedrat") !== -1 || desc.indexOf("the") !== -1) score += 4;
      else score += 1;
    } else if (prefs.famille === "gourmand") {
      if (desc.indexOf("gourmand") !== -1 || desc.indexOf("miel") !== -1 || desc.indexOf("vanille") !== -1 || desc.indexOf("praline") !== -1 || desc.indexOf("poire") !== -1 || desc.indexOf("sucr") !== -1) score += 4;
      else score += 1;
    }

    // OCCASION
    if (prefs.occasion === "soiree") {
      if (p.sillage === "Fort") score += 3; else score += 1;
    } else if (prefs.occasion === "quotidien") {
      if (p.sillage === "Modere") score += 3; else score += 1;
    } else if (prefs.occasion === "travail") {
      if (p.sillage === "Modere") score += 2; else score += 1;
    }

    // BUDGET
    if (prefs.budget === "petit") {
      if (p.prix > 0 && p.prix <= 10000) score += 5;
      else if (p.prix > 10000) score -= 1;
    } else if (prefs.budget === "moyen") {
      if (p.prix > 10000 && p.prix <= 50000) score += 5;
      else if (p.prix === 0) score += 3;
      else score += 1;
    } else if (prefs.budget === "grand") {
      if (p.prix > 50000 || p.prix === 0) score += 5;
      else score += 2;
    }

    // BONUS
    if (p.bestSeller) score += 1;
    if (p.categorie === "parfums") score += 1;

    results.push({ produit: p, score: score });
  }

  results.sort(function(a, b) { return b.score - a.score; });
  return results.slice(0, 2).map(function(r) { return r.produit; });
}

// ── HTML du chatbot ──────────────────────────────────────────
function buildChatbotHTML() {
  return '<div class="chatbot-bubble" id="chatbot-bubble" onclick="toggleChatbot()" aria-label="Trouver mon parfum">'
    + '<img src="img/parfum-icon.png" alt="parfum" class="chatbot-bubble__img" />'
    + '<span class="chatbot-bubble__label">Mon parfum</span>'
    + '<span class="chatbot-bubble__notif" id="chatbot-notif">1</span>'
    + '</div>'
    + '<div class="chatbot-window" id="chatbot-window" role="dialog" aria-hidden="true">'
    + '<div class="chatbot-header">'
    + '<div class="chatbot-header__info">'
    + '<img src="img/parfum-icon.png" alt="parfum" class="chatbot-header__img" />'
    + '<div><strong>Guide Olfactif</strong><span class="chatbot-header__status">&#9679; En ligne</span></div>'
    + '</div>'
    + '<button class="chatbot-close" onclick="toggleChatbot()" aria-label="Fermer">&#10005;</button>'
    + '</div>'
    + '<div class="chatbot-messages" id="chatbot-messages"></div>'
    + '<div class="chatbot-options" id="chatbot-options"></div>'
    + '</div>';
}

// ── Etat ─────────────────────────────────────────────────────
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
  div.innerHTML = '<img src="img/parfum-icon.png" alt="" class="chatbot-msg__avatar" /><div class="chatbot-msg__bubble">' + text + '</div>';
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
    var lbl = options[i].label.replace(/'/g, "\\'");
    html += '<button class="chatbot-opt" onclick="selectOption(\'' + options[i].value + '\',\'' + lbl + '\')">' + options[i].label + '</button>';
  }
  container.innerHTML = html;
}

function selectOption(value, label) {
  document.getElementById("chatbot-options").innerHTML = "";
  addUserMessage(label);
  var step = CHATBOT_STEPS[chatState.stepIndex];
  if (step.key) chatState.prefs[step.key] = value;

  if (value === "start") {
    setTimeout(function() { showStep(1); }, 500);
    return;
  }
  if (step.next === "result") {
    setTimeout(function() { showResults(); }, 800);
  } else {
    var nextIndex = -1;
    for (var i = 0; i < CHATBOT_STEPS.length; i++) {
      if (CHATBOT_STEPS[i].id === step.next) { nextIndex = i; break; }
    }
    if (nextIndex !== -1) setTimeout(function() { showStep(nextIndex); }, 500);
  }
}

function showResults() {
  var msgs = document.getElementById("chatbot-messages");
  
  // Algorithme de matching
  var results = [];
  for (var i = 0; i < PRODUCTS.length; i++) {
    var p = PRODUCTS[i];
    var score = 0;
    var desc = (p.description + " " + (p.notes ? JSON.stringify(p.notes) : "")).toLowerCase();
    var genre = p.genre ? p.genre.toLowerCase() : "";

    // GENRE
    if (chatState.prefs.genre === "femme") {
      if (genre.indexOf("femme") !== -1) score += 3;
    } else if (chatState.prefs.genre === "homme") {
      if (genre.indexOf("homme") !== -1) score += 3;
    } else {
      score += 2;
    }

    // FAMILLE
    if (chatState.prefs.famille === "floral") {
      if (desc.indexOf("floral") !== -1 || desc.indexOf("rose") !== -1 || desc.indexOf("jasmin") !== -1 || desc.indexOf("fleur") !== -1 || desc.indexOf("pivoine") !== -1 || desc.indexOf("hibiscus") !== -1) score += 4;
      else score += 1;
    } else if (chatState.prefs.famille === "oriental") {
      if (desc.indexOf("oriental") !== -1 || desc.indexOf("oud") !== -1 || desc.indexOf("ambre") !== -1 || desc.indexOf("tabac") !== -1 || desc.indexOf("vanille") !== -1 || desc.indexOf("miel") !== -1 || desc.indexOf("praline") !== -1) score += 4;
      else score += 1;
    } else if (chatState.prefs.famille === "frais") {
      if (desc.indexOf("frais") !== -1 || desc.indexOf("agrume") !== -1 || desc.indexOf("bergamote") !== -1 || desc.indexOf("cedrat") !== -1 || desc.indexOf("the") !== -1) score += 4;
      else score += 1;
    } else if (chatState.prefs.famille === "gourmand") {
      if (desc.indexOf("gourmand") !== -1 || desc.indexOf("miel") !== -1 || desc.indexOf("vanille") !== -1 || desc.indexOf("praline") !== -1 || desc.indexOf("poire") !== -1 || desc.indexOf("sucr") !== -1) score += 4;
      else score += 1;
    }

    // OCCASION
    if (chatState.prefs.occasion === "soiree") {
      if (p.sillage === "Fort") score += 3; else score += 1;
    } else if (chatState.prefs.occasion === "quotidien") {
      if (p.sillage === "Modere") score += 3; else score += 1;
    } else {
      score += 1;
    }

    // BUDGET
    if (chatState.prefs.budget === "petit") {
      if (p.prix > 0 && p.prix <= 10000) score += 5;
      else if (p.prix > 10000) score -= 1;
    } else if (chatState.prefs.budget === "moyen") {
      if (p.prix > 10000 && p.prix <= 50000) score += 5;
      else if (p.prix === 0) score += 3;
      else score += 1;
    } else if (chatState.prefs.budget === "grand") {
      if (p.prix > 50000 || p.prix === 0) score += 5;
      else score += 2;
    }

    if (p.bestSeller) score += 1;
    if (p.categorie === "parfums") score += 1;

    results.push({ produit: p, score: score });
  }

  results.sort(function(a, b) { return b.score - a.score; });
  var recs = results.slice(0, 2).map(function(r) { return r.produit; });

  addBotMessage("Voici les parfums faits pour vous !");

  for (var j = 0; j < recs.length; j++) {
    (function(p, delay) {
      setTimeout(function() {
        var card = document.createElement("div");
        card.className = "chatbot-product-card";

        var imgHTML = (p.images && p.images[0])
          ? '<img src="' + p.images[0] + '" alt="' + p.nom + '" style="width:100%;height:100%;object-fit:cover;display:block;" />'
          : '<span style="font-size:2rem;display:flex;align-items:center;justify-content:center;height:100%;">' + p.emoji + '</span>';

        var prixHTML = (p.prix > 0)
          ? p.prix.toLocaleString() + ' ' + (p.devise || 'FCFA')
          : 'Prix sur demande';

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
          + '<a href="' + getWhatsAppLink(p) + '" class="chatbot-btn chatbot-btn--wa" target="_blank" rel="noopener">Commander</a>'
          + '</div>';

        msgs.appendChild(card);
        msgs.scrollTop = msgs.scrollHeight;
      }, delay);
    })(recs[j], 400 + j * 600);
  }

  setTimeout(function() {
    addBotMessage("Cliquez sur un parfum pour voir tous les details !");
    document.getElementById("chatbot-options").innerHTML =
      '<a href="https://wa.me/' + WHATSAPP_NUMBER + '?text=Bonjour%2C%20j%27ai%20besoin%20de%20conseils%20sur%20un%20parfum." class="chatbot-opt chatbot-opt--whatsapp" target="_blank" rel="noopener">Parler sur WhatsApp</a>'
      + '<button class="chatbot-opt chatbot-opt--reset" onclick="resetChatbot()">Recommencer</button>';
  }, 400 + recs.length * 600 + 500);
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
