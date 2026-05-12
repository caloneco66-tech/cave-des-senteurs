// ============================================================
// PANIER.JS — La Cave des Senteurs
// Panier localStorage + commande WhatsApp
// ============================================================

var Panier = (function() {
  var STORAGE_KEY = "cds_panier";

  // ── Lire / Sauvegarder ──────────────────────────────────
  function lire() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch(e) { return []; }
  }
  function sauvegarder(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    rafraichirCompteur();
    rafraichirUI();
  }

  // ── Ajouter ─────────────────────────────────────────────
  function ajouter(produit) {
    var items = lire();
    var existant = items.find(function(i) { return i.id === produit.id; });
    if (existant) {
      existant.qte += 1;
    } else {
      items.push({
        id: produit.id,
        nom: produit.nom,
        marque: produit.marque || "",
        prix: produit.prix,
        devise: produit.devise || "FCFA",
        image: (produit.images && produit.images[0]) || "",
        emoji: produit.emoji || "🛍️",
        qte: 1
      });
    }
    sauvegarder(items);
    afficherToast(produit.nom + " ajouté au panier !");
  }

  // ── Retirer ─────────────────────────────────────────────
  function retirer(id) {
    sauvegarder(lire().filter(function(i) { return i.id !== id; }));
  }

  // ── Modifier quantité ───────────────────────────────────
  function modifierQte(id, delta) {
    var items = lire();
    var item = items.find(function(i) { return i.id === id; });
    if (!item) return;
    item.qte = Math.max(1, item.qte + delta);
    sauvegarder(items);
  }

  // ── Vider ───────────────────────────────────────────────
  function vider() { sauvegarder([]); }

  // ── Total ───────────────────────────────────────────────
  function total() {
    return lire().reduce(function(s, i) { return s + (i.prix * i.qte); }, 0);
  }

  // ── Compteur badge ──────────────────────────────────────
  function rafraichirCompteur() {
    var nb = lire().reduce(function(s, i) { return s + i.qte; }, 0);
    document.querySelectorAll(".panier-count").forEach(function(el) {
      el.textContent = nb;
      el.style.display = nb > 0 ? "flex" : "none";
    });
  }

  // ── Toast notification ──────────────────────────────────
  function afficherToast(msg) {
    var t = document.getElementById("panier-toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("panier-toast--visible");
    setTimeout(function() { t.classList.remove("panier-toast--visible"); }, 2500);
  }

  // ── Générer message WhatsApp ────────────────────────────
  function genererMessageWA() {
    var items = lire();
    if (!items.length) return "";
    var lignes = items.map(function(i) {
      var prixLigne = i.prix > 0
        ? i.prix.toLocaleString() + " " + i.devise + " x" + i.qte + " = " + (i.prix * i.qte).toLocaleString() + " " + i.devise
        : "Prix à confirmer x" + i.qte;
      return "• " + i.nom + (i.marque ? " (" + i.marque + ")" : "") + "\n  " + prixLigne;
    });
    var totalVal = total();
    var totalTxt = totalVal > 0 ? "\n\n💰 *Total estimé : " + totalVal.toLocaleString() + " FCFA*" : "";
    return encodeURIComponent(
      "Bonjour ! Je souhaite commander :\n\n" +
      lignes.join("\n\n") +
      totalTxt +
      "\n\nMerci de confirmer la disponibilité et les modalités de livraison."
    );
  }

  // ── Rendu du panneau panier ─────────────────────────────
  function rafraichirUI() {
    var panel = document.getElementById("panier-panel");
    if (!panel) return;
    var items = lire();
    var body = panel.querySelector(".panier-body");
    var footer = panel.querySelector(".panier-footer");
    if (!body || !footer) return;

    if (items.length === 0) {
      body.innerHTML = '<div class="panier-empty"><span>🛍️</span><p>Votre panier est vide</p></div>';
      footer.innerHTML = '';
      return;
    }

    body.innerHTML = items.map(function(item) {
      var imgHTML = item.image
        ? '<img src="' + item.image + '" alt="' + item.nom + '" onerror="this.style.display=\'none\'" />'
        : '<span class="panier-item__emoji">' + item.emoji + '</span>';
      var prixHTML = item.prix > 0
        ? (item.prix * item.qte).toLocaleString() + ' ' + item.devise
        : 'Prix sur demande';
      return '<div class="panier-item" data-id="' + item.id + '">'
        + '<div class="panier-item__img">' + imgHTML + '</div>'
        + '<div class="panier-item__info">'
        + '<p class="panier-item__nom">' + item.nom + '</p>'
        + (item.marque ? '<p class="panier-item__marque">' + item.marque + '</p>' : '')
        + '<p class="panier-item__prix">' + prixHTML + '</p>'
        + '</div>'
        + '<div class="panier-item__actions">'
        + '<button class="panier-qte-btn" onclick="Panier.modifierQte(' + item.id + ',-1)">−</button>'
        + '<span class="panier-qte">' + item.qte + '</span>'
        + '<button class="panier-qte-btn" onclick="Panier.modifierQte(' + item.id + ',1)">+</button>'
        + '<button class="panier-suppr" onclick="Panier.retirer(' + item.id + ')" aria-label="Supprimer">✕</button>'
        + '</div>'
        + '</div>';
    }).join('');

    var tot = total();
    footer.innerHTML = (tot > 0 ? '<p class="panier-total">Total : <strong>' + tot.toLocaleString() + ' FCFA</strong></p>' : '')
      + '<a href="https://wa.me/' + WHATSAPP_NUMBER + '?text=' + genererMessageWA() + '" class="btn btn--whatsapp panier-commander" target="_blank" rel="noopener">'
      + '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>'
      + ' Commander sur WhatsApp</a>'
      + '<button class="panier-vider" onclick="Panier.vider()">Vider le panier</button>';
  }

  // ── Injecter le HTML du panier dans le DOM ──────────────
  function init() {
    // Toast
    var toast = document.createElement("div");
    toast.id = "panier-toast";
    toast.className = "panier-toast";
    document.body.appendChild(toast);

    // Overlay
    var overlay = document.createElement("div");
    overlay.id = "panier-overlay";
    overlay.className = "panier-overlay";
    overlay.onclick = function() { fermer(); };
    document.body.appendChild(overlay);

    // Panneau
    var panel = document.createElement("div");
    panel.id = "panier-panel";
    panel.className = "panier-panel";
    panel.innerHTML =
      '<div class="panier-header">'
      + '<h3>🛍️ Mon Panier</h3>'
      + '<button class="panier-close" onclick="Panier.fermer()" aria-label="Fermer">✕</button>'
      + '</div>'
      + '<div class="panier-body"></div>'
      + '<div class="panier-footer"></div>';
    document.body.appendChild(panel);

    rafraichirCompteur();
    rafraichirUI();

    // Ajouter bouton panier dans le header
    var headerInner = document.querySelector(".header__inner");
    if (headerInner) {
      var btn = document.createElement("button");
      btn.className = "panier-btn";
      btn.setAttribute("aria-label", "Ouvrir le panier");
      btn.onclick = function() { ouvrir(); };
      btn.innerHTML =
        '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>'
        + '<span class="panier-count" style="display:none">0</span>';
      // Insérer avant le burger
      var burger = headerInner.querySelector(".burger");
      if (burger) headerInner.insertBefore(btn, burger);
      else headerInner.appendChild(btn);
    }
  }

  function ouvrir() {
    rafraichirUI();
    document.getElementById("panier-panel").classList.add("panier-panel--open");
    document.getElementById("panier-overlay").classList.add("panier-overlay--visible");
    document.body.classList.add("no-scroll");
  }

  function fermer() {
    var p = document.getElementById("panier-panel");
    var o = document.getElementById("panier-overlay");
    if (p) p.classList.remove("panier-panel--open");
    if (o) o.classList.remove("panier-overlay--visible");
    document.body.classList.remove("no-scroll");
  }

  // API publique
  return { ajouter: ajouter, retirer: retirer, modifierQte: modifierQte, vider: vider,
           total: total, lire: lire, ouvrir: ouvrir, fermer: fermer, init: init };
})();

document.addEventListener("DOMContentLoaded", function() { Panier.init(); });
