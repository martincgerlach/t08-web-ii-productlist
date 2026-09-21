// Læs kategorien fra URL'en, fx productlist.html?category=Apparel.
// Når der ikke står en kategori, viser vi Accessories.
const params = new URLSearchParams(window.location.search);
const category = params.get("category") || "Accessories";
const endpoint = `https://kea-alt-del.dk/t7/api/products?category=${encodeURIComponent(category)}&limit=10`;
const container = document.querySelector(".product_list_container");
const statusText = document.querySelector("#status");
const retryButton = document.querySelector("#retry");

document.querySelector("h1").textContent = category;
document.title = `${category} | Studio Shop`;
retryButton.addEventListener("click", getProducts);

getProducts();

// Hent JSON fra API'et, og send produkterne videre til visningen.
async function getProducts() {
  container.setAttribute("aria-busy", "true");
  statusText.textContent = "Henter produkter…";
  retryButton.hidden = true;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`API-fejl: ${response.status}`);
    const products = await response.json();
    console.table(products);
    showProducts(products);
  } catch (error) {
    statusText.textContent = "Produkterne kunne ikke hentes. Prøv igen.";
    retryButton.hidden = false;
    console.error(error);
  } finally {
    container.setAttribute("aria-busy", "false");
  }
}

// Saml kortene i én tekststreng, og indsæt dem i HTML'en efter loopet.
function showProducts(products) {
  let markup = "";

  products.forEach((product) => {
    const discountedPrice = Math.round(product.price - (product.price * product.discount) / 100);
    const stateClasses = `${product.soldout ? "sold-out" : ""} ${product.discount ? "on-sale" : ""}`;
    markup += `
      <article class="product-card ${stateClasses}">
        <a href="productdetails.html?id=${encodeURIComponent(product.id)}">
          <div class="product-image">
            <img src="https://kea-alt-del.dk/t7/images/webp/640/${encodeURIComponent(product.id)}.webp"
                 alt="${escapeHTML(product.productdisplayname)}" width="640" height="853" loading="lazy" />
            <div class="product-badges">
              ${product.soldout ? '<span class="badge sold-out-badge">Udsolgt</span>' : ""}
              ${product.discount ? `<span class="badge sale-badge">-${product.discount}%</span>` : ""}
            </div>
          </div>
          <p class="brand">${escapeHTML(product.brandname)}</p>
          <h2>${escapeHTML(product.productdisplayname)}</h2>
          <div class="price-row">
            <p class="price ${product.discount ? "original-price" : ""}">DKK ${formatPrice(product.price)},-</p>
            ${product.discount ? `<p class="sale-price">Nu DKK ${formatPrice(discountedPrice)},-</p>` : ""}
          </div>
          <span class="product-link">Se produkt <span aria-hidden="true">↗</span></span>
        </a>
      </article>`;
  });

  container.innerHTML = markup;
  statusText.textContent = products.length ? `${products.length} produkter` : "Ingen produkter i denne kategori.";
}

function formatPrice(price) {
  return new Intl.NumberFormat("da-DK").format(price);
}

// Sørg for, at tekst fra API'et behandles som tekst i vores HTML.
function escapeHTML(value) {
  const element = document.createElement("span");
  element.textContent = String(value);
  return element.innerHTML.replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
