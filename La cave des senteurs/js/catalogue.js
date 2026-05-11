// ============================================================
// CATALOGUE.JS — Filtrage et affichage du catalogue
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initScrollHeader();
  initCatalogue();
});

function initCatalogue() {
  const grid = document.getElementById("catalogue-grid");
  const countEl = document.getElementById("product-count");
  const filterBtns = document.querySelectorAll("[data-filter]");
  const prixSelect = document.getElementById("filter-prix");
  const sortSelect = document.getElementById("sort-select");
  const searchInput = document.getElementById("search-input");

  let activeCategorie = "tous";
  let activePrix = "tous";
  let activeSort = "default";
  let searchQuery = "";

  // Lire le paramètre URL ?categorie=
  const urlParams = new URLSearchParams(window.location.search);
  const urlCat = urlParams.get("categorie");
  if (urlCat) {
    activeCategorie = urlCat;
    filterBtns.forEach(btn => {
      btn.classList.toggle("active", btn.dataset.filter === urlCat);
    });
  }

  function render() {
    let filtered = [...PRODUCTS];

    // Filtre catégorie
    if (activeCategorie !== "tous") {
      filtered = filtered.filter(p => p.categorie === activeCategorie);
    }

    // Filtre prix
    if (activePrix !== "tous") {
      filtered = filtered.filter(p => getPrixRange(p) === activePrix);
    }

    // Recherche
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.nom.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Tri
    if (activeSort === "prix-asc") filtered.sort((a, b) => a.prix - b.prix);
    else if (activeSort === "prix-desc") filtered.sort((a, b) => b.prix - a.prix);
    else if (activeSort === "nom") filtered.sort((a, b) => a.nom.localeCompare(b.nom));

    if (grid) {
      if (filtered.length === 0) {
        grid.innerHTML = `<div class="catalogue__empty"><p>Aucun produit ne correspond à votre recherche.</p><button class="btn btn--secondary" onclick="resetFilters()">Réinitialiser les filtres</button></div>`;
      } else {
        grid.innerHTML = filtered.map(p => createProductCard(p)).join("");
      }
    }
    if (countEl) countEl.textContent = filtered.length;
  }

  // Filtres catégorie
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeCategorie = btn.dataset.filter;
      render();
    });
  });

  // Filtre prix
  if (prixSelect) {
    prixSelect.addEventListener("change", () => {
      activePrix = prixSelect.value;
      render();
    });
  }

  // Tri
  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      activeSort = sortSelect.value;
      render();
    });
  }

  // Recherche
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      searchQuery = searchInput.value;
      render();
    });
  }

  window.resetFilters = function () {
    activeCategorie = "tous";
    activePrix = "tous";
    activeSort = "default";
    searchQuery = "";
    if (prixSelect) prixSelect.value = "tous";
    if (sortSelect) sortSelect.value = "default";
    if (searchInput) searchInput.value = "";
    filterBtns.forEach(b => b.classList.toggle("active", b.dataset.filter === "tous"));
    render();
  };

  render();
}
