// ============================================================
// MAIN.JS — La Cave des Senteurs
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initScrollHeader();
  renderNouveautes();
});

// ── Navigation mobile ────────────────────────────────────────
function initNav() {
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  if (!burger || !nav) return;

  burger.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("nav--open");
    burger.classList.toggle("burger--open", isOpen);
    burger.setAttribute("aria-expanded", isOpen);
    document.body.classList.toggle("no-scroll", isOpen);
  });

  // Fermer le menu au clic sur un lien
  nav.querySelectorAll(".nav__link").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("nav--open");
      burger.classList.remove("burger--open");
      burger.setAttribute("aria-expanded", false);
      document.body.classList.remove("no-scroll");
    });
  });
}

// ── Header scroll ────────────────────────────────────────────
function initScrollHeader() {
  const header = document.getElementById("header");
  if (!header) return;
  window.addEventListener("scroll", () => {
    header.classList.toggle("header--scrolled", window.scrollY > 50);
  }, { passive: true });
}

// ── Rendu des nouveautés (page accueil) ──────────────────────
function renderNouveautes() {
  const grid = document.getElementById("nouveautes-grid");
  if (!grid) return;

  const nouveautes = PRODUCTS.filter(p => p.nouveaute).slice(0, 4);
  grid.innerHTML = nouveautes.map(p => createProductCard(p)).join("");
}

// ── Carte produit ────────────────────────────────────────────
function createProductCard(produit) {
  const imagePrincipale = produit.images && produit.images[0];

  const mediaHTML = imagePrincipale
    ? `<img src="${imagePrincipale}" alt="${produit.nom}" class="product-card__photo" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" /><span class="product-card__emoji" aria-hidden="true" style="display:none;">${produit.emoji}</span>`
    : `<span class="product-card__emoji" aria-hidden="true">${produit.emoji}</span>`;

  const badgeHTML = produit.stockLimite
    ? '<span class="product-card__badge product-card__badge--stock">⚡ Stock limité</span>'
    : produit.nouveaute
      ? '<span class="product-card__badge">Nouveau</span>'
      : produit.bestSeller
        ? '<span class="product-card__badge product-card__badge--best">⭐ Best-seller</span>'
        : "";

  const starsHTML = produit.bestSeller
    ? `<div class="product-card__stars">⭐⭐⭐⭐⭐ <span class="product-card__stars-count">(${Math.floor(Math.random()*50)+20})</span></div>`
    : "";

  return `
    <article class="product-card" data-categorie="${produit.categorie}" data-prix="${getPrixRange(produit)}" data-bestseller="${produit.bestSeller ? 'true' : 'false'}">
      <a href="produit.html?id=${produit.id}" class="product-card__img-link" aria-label="Voir ${produit.nom}">
        <div class="product-card__img">
          ${mediaHTML}
          ${badgeHTML}
        </div>
      </a>
      <div class="product-card__body">
        <p class="product-card__cat">${getCategorieLabel(produit.categorie)}</p>
        <h3 class="product-card__title">
          <a href="produit.html?id=${produit.id}">${produit.nom}</a>
        </h3>
        ${starsHTML}
        <p class="product-card__desc">${produit.description.substring(0, 90)}…</p>
        <div class="product-card__footer">
          <span class="product-card__prix">${produit.prix > 0 ? produit.prix.toLocaleString() + ' ' + (produit.devise || 'FCFA') : '<em style="font-size:var(--text-sm);color:var(--color-text-muted);">Prix sur demande</em>'}</span>
          <a href="${getWhatsAppLink(produit)}" class="btn btn--whatsapp btn--sm" target="_blank" rel="noopener">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Commander
          </a>
        </div>
      </div>
    </article>
  `;
}