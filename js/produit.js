// ============================================================
// PRODUIT.JS — Page détail produit + Thème couleur dynamique
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initScrollHeader();
  initProductPage();
});

// ── Extraction couleur dominante via Canvas ──────────────────
function extractDominantColor(imgEl, callback) {
  try {
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext("2d");
    // Réduire pour perf
    canvas.width = 80;
    canvas.height = 80;
    ctx.drawImage(imgEl, 0, 0, 80, 80);
    var data = ctx.getImageData(0, 0, 80, 80).data;

    // Compter les couleurs par blocs (évite blanc/noir/gris)
    var colorMap = {};
    for (var i = 0; i < data.length; i += 16) {
      var r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
      if (a < 128) continue; // transparent
      // Ignorer blanc, noir, gris
      var max = Math.max(r, g, b), min = Math.min(r, g, b);
      var saturation = max === 0 ? 0 : (max - min) / max;
      var brightness = max / 255;
      if (saturation < 0.15 || brightness < 0.15 || brightness > 0.95) continue;
      // Quantifier en blocs de 32
      var rq = Math.round(r / 32) * 32;
      var gq = Math.round(g / 32) * 32;
      var bq = Math.round(b / 32) * 32;
      var key = rq + "," + gq + "," + bq;
      colorMap[key] = (colorMap[key] || 0) + 1;
    }

    // Trouver la couleur la plus fréquente
    var best = null, bestCount = 0;
    Object.keys(colorMap).forEach(function(k) {
      if (colorMap[k] > bestCount) { bestCount = colorMap[k]; best = k; }
    });

    if (!best) { callback(null); return; }
    var parts = best.split(",");
    callback({ r: +parts[0], g: +parts[1], b: +parts[2] });
  } catch(e) {
    callback(null);
  }
}

// ── Convertir RGB → HSL ─────────────────────────────────────
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  var max = Math.max(r,g,b), min = Math.min(r,g,b), h, s, l = (max+min)/2;
  if (max === min) { h = s = 0; }
  else {
    var d = max - min;
    s = l > 0.5 ? d/(2-max-min) : d/(max+min);
    switch(max) {
      case r: h = ((g-b)/d + (g<b?6:0))/6; break;
      case g: h = ((b-r)/d + 2)/6; break;
      case b: h = ((r-g)/d + 4)/6; break;
    }
  }
  return { h: Math.round(h*360), s: Math.round(s*100), l: Math.round(l*100) };
}

// ── Appliquer le thème couleur ───────────────────────────────
function applyColorTheme(rgb) {
  if (!rgb) return;
  var hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  var h = hsl.h, s = Math.max(hsl.s, 30);

  // Couleurs dérivées
  var primary    = "hsl(" + h + "," + s + "%,35%)";
  var primaryDk  = "hsl(" + h + "," + s + "%,22%)";
  var primaryLt  = "hsl(" + h + "," + s + "%,48%)";
  var bgLight    = "hsl(" + h + "," + Math.round(s*0.3) + "%,96%)";
  var bgMid      = "hsl(" + h + "," + Math.round(s*0.25) + "%,91%)";
  var accent     = "hsl(" + h + "," + Math.round(s*0.6) + "%,80%)";

  // Injecter les variables CSS sur la page
  var root = document.documentElement;
  root.style.setProperty("--color-bordeaux",       primary);
  root.style.setProperty("--color-bordeaux-dark",  primaryDk);
  root.style.setProperty("--color-bordeaux-light", primaryLt);
  root.style.setProperty("--color-beige",          bgLight);
  root.style.setProperty("--color-beige-dark",     bgMid);
  root.style.setProperty("--color-rose-light",     accent);

  // Animation d'entrée sur le hero produit
  var gallery = document.querySelector(".product-gallery__main");
  if (gallery) {
    gallery.style.background = "linear-gradient(135deg, " + bgLight + " 0%, " + accent + " 50%, " + bgMid + " 100%)";
    gallery.style.transition = "background 0.8s ease";
  }

  // Teinte sur le breadcrumb
  var breadcrumb = document.querySelector(".breadcrumb");
  if (breadcrumb) {
    breadcrumb.style.backgroundColor = bgLight;
    breadcrumb.style.transition = "background-color 0.6s ease";
  }

  // Badge couleur sur le header de la page
  var pageHero = document.querySelector(".product-info__cat");
  if (pageHero) {
    pageHero.style.color = primary;
  }

  // Indicateur visuel discret — barre de couleur en haut
  var bar = document.getElementById("color-bar");
  if (!bar) {
    bar = document.createElement("div");
    bar.id = "color-bar";
    bar.style.cssText = "position:fixed;top:0;left:0;right:0;height:3px;z-index:9999;transition:background 0.8s ease;";
    document.body.prepend(bar);
  }
  bar.style.background = "linear-gradient(90deg, " + primaryDk + ", " + primaryLt + ", " + accent + ")";
}

function initProductPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get("id"));
  const produit = PRODUCTS.find(p => p.id === id);

  if (!produit) {
    document.getElementById("product-detail").innerHTML = `
      <div class="container" style="padding: 4rem 1rem; text-align:center;">
        <h1>Produit introuvable</h1>
        <p>Ce produit n'existe pas ou a été retiré.</p>
        <a href="catalogue.html" class="btn btn--primary" style="margin-top:1.5rem;">Retour au catalogue</a>
      </div>`;
    return;
  }

  document.title = `${produit.nom} – La Cave des Senteurs`;

  // Breadcrumb
  const breadcrumb = document.getElementById("breadcrumb-product");
  if (breadcrumb) {
    breadcrumb.innerHTML = `
      <nav class="breadcrumb" aria-label="Fil d'Ariane">
        <ol>
          <li><a href="index.html">Accueil</a></li>
          <li><a href="catalogue.html">Catalogue</a></li>
          <li><a href="${produit.categorie}.html">${getCategorieLabel(produit.categorie)}</a></li>
          <li aria-current="page">${produit.nom}</li>
        </ol>
      </nav>`;
  }

  const detail = document.getElementById("product-detail");
  if (!detail) return;

  const notesHTML = produit.notes ? `
    <div class="product-notes" style="margin-top:var(--space-5);">
      <h3 style="font-family:var(--font-serif);font-size:var(--text-lg);margin-bottom:var(--space-4);">Notes olfactives</h3>
      <div class="product-notes__grid">
        <div class="product-notes__item">
          <span class="product-notes__label">Tête</span>
          <span class="product-notes__value">${produit.notes.tete}</span>
        </div>
        <div class="product-notes__item">
          <span class="product-notes__label">Cœur</span>
          <span class="product-notes__value">${produit.notes.coeur}</span>
        </div>
        <div class="product-notes__item">
          <span class="product-notes__label">Fond</span>
          <span class="product-notes__value">${produit.notes.fond}</span>
        </div>
      </div>
    </div>` : "";

  const infoExtra = [];
  if (produit.volume)      infoExtra.push({ label: "Volume",      value: produit.volume });
  if (produit.duree)       infoExtra.push({ label: "Durée",       value: produit.duree });
  if (produit.utilisation) infoExtra.push({ label: "Utilisation", value: produit.utilisation });
  if (produit.longevite)   infoExtra.push({ label: "Longévité",   value: produit.longevite });
  if (produit.sillage)     infoExtra.push({ label: "Sillage",     value: produit.sillage });
  if (produit.genre)       infoExtra.push({ label: "Genre",       value: produit.genre });

  const imgSrc = produit.images && produit.images[0] ? produit.images[0] : null;

  detail.innerHTML = `
    <div class="container">
      <div class="product-detail__inner">
        <div class="product-gallery">
          <div class="product-gallery__main" id="gallery-main">
            ${imgSrc
              ? `<img id="product-main-img" src="${imgSrc}" alt="${produit.nom}" crossorigin="anonymous" style="width:100%;height:100%;object-fit:contain;border-radius:var(--radius-lg);transition:opacity 0.4s ease;" onerror="this.style.display='none';document.getElementById('gallery-emoji').style.display='flex';" /><span id="gallery-emoji" class="product-gallery__emoji" aria-hidden="true" style="display:none;">${produit.emoji}</span>`
              : `<span class="product-gallery__emoji" aria-hidden="true">${produit.emoji}</span>`
            }
            ${produit.nouveaute ? '<span class="product-card__badge" style="position:absolute;top:12px;left:12px;">Nouveau</span>' : ""}
            ${produit.bestSeller ? '<span class="product-card__badge product-card__badge--best" style="position:absolute;top:12px;left:12px;">⭐ Best-seller</span>' : ""}
          </div>
        </div>

        <div class="product-info">
          <p class="product-info__cat">${getCategorieLabel(produit.categorie)}</p>
          <h1 class="product-info__title">${produit.nom}</h1>
          ${produit.marque ? `<p style="font-size:var(--text-sm);color:var(--color-text-muted);margin-top:-var(--space-2);margin-bottom:var(--space-2);">${produit.marque}</p>` : ""}
          <p class="product-info__prix">${produit.prix > 0 ? produit.prix.toLocaleString() + ' ' + (produit.devise || 'FCFA') : '<span style="font-size:var(--text-base);font-style:italic;">Prix sur demande</span>'}</p>
          <p class="product-info__desc">${produit.description}</p>

          ${infoExtra.length ? `
          <dl class="product-info__specs">
            ${infoExtra.map(i => `<dt>${i.label}</dt><dd>${i.value}</dd>`).join("")}
          </dl>` : ""}

          ${notesHTML}

          <div style="display:flex;gap:var(--space-3);flex-wrap:wrap;margin-top:var(--space-4);">
            <button class="btn btn--primary" onclick="Panier&&Panier.ajouter({id:${produit.id},nom:'${produit.nom.replace(/'/g,"\\'")}',marque:'${(produit.marque||'').replace(/'/g,"\\'")}',prix:${produit.prix},devise:'${produit.devise||'FCFA'}',images:${JSON.stringify(produit.images||[])},emoji:'${produit.emoji||'🛍️'}'})" style="flex:1;min-width:140px;">
              🛍️ Ajouter au panier
            </button>
            <a href="${getWhatsAppLink(produit)}" class="btn btn--whatsapp btn--lg" target="_blank" rel="noopener" style="flex:1;min-width:140px;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Commander via WhatsApp
            </a>
          </div>
          <p class="product-info__whatsapp-hint">Réponse rapide · Livraison personnalisée</p>
        </div>
      </div>
    </div>`;

  // ── Extraction couleur après chargement image ──
  if (imgSrc) {
    var img = document.getElementById("product-main-img");
    if (img) {
      var tryExtract = function() {
        extractDominantColor(img, function(color) {
          if (color) {
            applyColorTheme(color);
          }
        });
      };
      if (img.complete && img.naturalWidth > 0) {
        tryExtract();
      } else {
        img.addEventListener("load", tryExtract);
      }
    }
  }

  renderSimilaires(produit);
}

function renderSimilaires(produit) {
  const grid = document.getElementById("similaires-grid");
  if (!grid) return;
  const similaires = PRODUCTS
    .filter(p => p.categorie === produit.categorie && p.id !== produit.id)
    .slice(0, 4);
  if (similaires.length === 0) {
    document.getElementById("similaires-section").style.display = "none";
    return;
  }
  grid.innerHTML = similaires.map(p => createProductCard(p)).join("");
}


function initProductPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = parseInt(urlParams.get("id"));
  const produit = PRODUCTS.find(p => p.id === id);

  if (!produit) {
    document.getElementById("product-detail").innerHTML = `
      <div class="container" style="padding: 4rem 1rem; text-align:center;">
        <h1>Produit introuvable</h1>
        <p>Ce produit n'existe pas ou a été retiré.</p>
        <a href="catalogue.html" class="btn btn--primary" style="margin-top:1.5rem;">Retour au catalogue</a>
      </div>`;
    return;
  }

  // Titre de la page
  document.title = `${produit.nom} – La Cave des Senteurs`;

  // Breadcrumb
  const breadcrumb = document.getElementById("breadcrumb-product");
  if (breadcrumb) {
    breadcrumb.innerHTML = `
      <nav class="breadcrumb" aria-label="Fil d'Ariane">
        <ol>
          <li><a href="index.html">Accueil</a></li>
          <li><a href="catalogue.html">Catalogue</a></li>
          <li><a href="${produit.categorie}.html">${getCategorieLabel(produit.categorie)}</a></li>
          <li aria-current="page">${produit.nom}</li>
        </ol>
      </nav>`;
  }

  // Contenu principal
  const detail = document.getElementById("product-detail");
  if (!detail) return;

  const notesHTML = produit.notes ? `
    <div class="product-notes">
      <h3>Notes olfactives</h3>
      <div class="product-notes__grid">
        <div class="product-notes__item">
          <span class="product-notes__label">Tête</span>
          <span class="product-notes__value">${produit.notes.tete}</span>
        </div>
        <div class="product-notes__item">
          <span class="product-notes__label">Cœur</span>
          <span class="product-notes__value">${produit.notes.coeur}</span>
        </div>
        <div class="product-notes__item">
          <span class="product-notes__label">Fond</span>
          <span class="product-notes__value">${produit.notes.fond}</span>
        </div>
      </div>
    </div>` : "";

  const infoExtra = [];
  if (produit.volume) infoExtra.push({ label: "Volume", value: produit.volume });
  if (produit.duree) infoExtra.push({ label: "Durée", value: produit.duree });
  if (produit.utilisation) infoExtra.push({ label: "Utilisation", value: produit.utilisation });

  detail.innerHTML = `
    <div class="container">
      <div class="product-detail__inner">
        <!-- Galerie -->
        <div class="product-gallery">
          <div class="product-gallery__main">
            ${produit.images && produit.images[0]
              ? `<img src="${produit.images[0]}" alt="${produit.nom}" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-lg);" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" /><span class="product-gallery__emoji" aria-hidden="true" style="display:none;">${produit.emoji}</span>`
              : `<span class="product-gallery__emoji" aria-hidden="true">${produit.emoji}</span>`
            }
            ${produit.nouveaute ? '<span class="product-card__badge product-card__badge--lg">Nouveau</span>' : ""}
          </div>
        </div>

        <!-- Infos -->
        <div class="product-info">
          <p class="product-info__cat">${getCategorieLabel(produit.categorie)}</p>
          <h1 class="product-info__title">${produit.nom}</h1>
          <p class="product-info__prix">${produit.prix > 0 ? produit.prix.toLocaleString() + ' ' + (produit.devise || 'FCFA') : 'Prix sur demande'}</p>
          <p class="product-info__desc">${produit.description}</p>

          ${infoExtra.length ? `
          <ul class="product-info__specs">
            ${infoExtra.map(i => `<li><strong>${i.label} :</strong> ${i.value}</li>`).join("")}
          </ul>` : ""}

          ${notesHTML}

          <a href="${getWhatsAppLink(produit)}" class="btn btn--whatsapp btn--lg" target="_blank" rel="noopener">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Commander via WhatsApp
          </a>
          <p class="product-info__whatsapp-hint">Réponse rapide · Livraison personnalisée · Paiement sécurisé</p>
        </div>
      </div>
    </div>`;

  // Produits similaires
  renderSimilaires(produit);
}

function renderSimilaires(produit) {
  const grid = document.getElementById("similaires-grid");
  if (!grid) return;
  const similaires = PRODUCTS
    .filter(p => p.categorie === produit.categorie && p.id !== produit.id)
    .slice(0, 4);
  if (similaires.length === 0) {
    document.getElementById("similaires-section").style.display = "none";
    return;
  }
  grid.innerHTML = similaires.map(p => createProductCard(p)).join("");
}
