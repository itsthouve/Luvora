// ============================================================
//  LUVORA — search.js
//  Filters the already-loaded `products` array (set by
//  loadMoreProduct.js) — no extra fetches needed.
// ============================================================

const searchInput = document.getElementById("searchBar");
const productList = document.getElementById("product-list");

// "Not found" message element
const notFoundMessage       = document.createElement("p");
notFoundMessage.innerHTML   = "Nothing to search here.<br>Try again :)";
notFoundMessage.classList.add("not-found-text");
notFoundMessage.style.display = "none";
productList.after(notFoundMessage);

searchInput.addEventListener("input", function () {
  const query      = this.value.toLowerCase().trim();
  let   matchFound = false;

  productList.innerHTML = ""; // clear current display

  if (query === "") {
    // Restore paginated view
    currentIndex = 0;
    loadProducts();
    document.getElementById("loadMore").style.display =
      products.length > itemsPerLoad ? "block" : "none";
    notFoundMessage.style.display = "none";
    return;
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(query)
  );

  filtered.forEach((p) => {
    const card     = document.createElement("div");
    card.className = "product-card";
    card.onclick   = () => window.open(p.link, "_blank");
    card.innerHTML = `
      <img src="${p.img}" class="product-img" loading="lazy" />
      <div class="product-details">
        <div class="product-title">${p.name}</div>
        <div class="product-row">
          <img src="${p.storeIcon}" class="store-icon" />
          <div class="arrow">↘</div>
        </div>
      </div>`;
    productList.appendChild(card);
    matchFound = true;
  });

  notFoundMessage.style.display = matchFound ? "none" : "block";
  document.getElementById("loadMore").style.display = "none";
});
