// ============================================================
//  LUVORA — loadMoreProduct.js
//  Reads products.json directly from your GitHub repo.
//  No Netlify, no third-party services, no caps.
// ============================================================

// ── CONFIG — fill these in ──────────────────────────────────
const GITHUB_USER = "itsthouve";   // e.g. "johnsmith"
const GITHUB_REPO = "Luvora";                 // your repo name
const FILE_PATH   = "products.json";          // path to the file in repo
// ────────────────────────────────────────────────────────────

let products     = [];
let currentIndex = 0;
const itemsPerLoad = 9;

// Fetch products from GitHub (public read — no token needed)
async function loadProductsFromServer() {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${FILE_PATH}`,
      { headers: { Accept: "application/vnd.github+json" } }
    );

    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);

    const data    = await res.json();
    const decoded = JSON.parse(atob(data.content.replace(/\n/g, "")));
    products      = decoded.items || [];

    updateCount();
    loadProducts();
  } catch (err) {
    console.error("Failed to load products:", err);
    document.getElementById("product-list").innerHTML =
      "<p style='text-align:center;padding:40px;font-family:Poppins;'>Failed to load products. Check your GitHub config.</p>";
  }
}

// Render products in batches of 9
function loadProducts() {
  const container = document.getElementById("product-list");
  const end       = currentIndex + itemsPerLoad;

  for (let i = currentIndex; i < end && i < products.length; i++) {
    const p    = products[i];
    const card = document.createElement("div");
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
    container.appendChild(card);
  }

  currentIndex = end;

  if (currentIndex >= products.length) {
    document.getElementById("loadMore").style.display = "none";
  }
}

// Update the count badge
function updateCount() {
  document.getElementById("count").innerText = products.length;
}

// Load More button
document.getElementById("loadMore").addEventListener("click", loadProducts);

// Kick off on page load
loadProductsFromServer();
