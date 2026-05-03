// ============================================================
// PRODUIT.JS — Page détail produit
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initScrollHeader();
  initProductPage();
});

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
          <span class="product-notes__value">${produit.notes.cœur}</span>
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
            <span class="product-gallery__emoji" aria-hidden="true">${produit.emoji}</span>
            ${produit.nouveaute ? '<span class="product-card__badge product-card__badge--lg">Nouveau</span>' : ""}
          </div>
        </div>

        <!-- Infos -->
        <div class="product-info">
          <p class="product-info__cat">${getCategorieLabel(produit.categorie)}</p>
          <h1 class="product-info__title">${produit.nom}</h1>
          <p class="product-info__prix">${produit.prix.toLocaleString()} ${produit.devise || 'FCFA'}</p>
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
