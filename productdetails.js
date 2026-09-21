const params = new URLSearchParams(window.location.search);
const productId = params.get("id") || "1525";
const endpoint = `https://kea-alt-del.dk/t7/api/products/${encodeURIComponent(productId)}`;
const productContainer = document.querySelector(".product-detail");
const statusText = document.querySelector("#status");
const retryButton = document.querySelector("#retry");

retryButton.addEventListener("click", getProduct);
getProduct();

async function getProduct() {
  productContainer.setAttribute("aria-busy", "true");
  statusText.textContent = "Henter produkt…";
  retryButton.hidden = true;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`API-fejl: ${response.status}`);
    const product = await response.json();
    console.log(product);
    showProduct(product);
  } catch (error) {
    statusText.textContent = "Produktet kunne ikke hentes. Prøv igen.";
    retryButton.hidden = false;
    console.error(error);
  } finally {
    productContainer.setAttribute("aria-busy", "false");
  }
}

function showProduct(product) {
  const discountedPrice = Math.round(product.price - (product.price * product.discount) / 100);
  document.title = `${product.productdisplayname} | Studio Shop`;
  productContainer.innerHTML = `
    <div class="detail-image ${product.soldout ? "sold-out" : ""}">
      <img src="https://kea-alt-del.dk/t7/images/webp/640/${product.id}.webp"
           alt="${escapeHTML(product.productdisplayname)}" width="640" height="853" />
      <div class="product-badges">
        ${product.soldout ? '<span class="badge sold-out-badge">Udsolgt</span>' : ""}
        ${product.discount ? `<span class="badge sale-badge">-${product.discount}%</span>` : ""}
      </div>
    </div>
    <div class="detail-copy">
      <p class="eyebrow">${escapeHTML(product.category)} / ${escapeHTML(product.articletype)}</p>
      <h1>${escapeHTML(product.productdisplayname)}</h1>
      <p class="detail-brand">${escapeHTML(product.brandname)}</p>
      <div class="detail-price">
        <span class="${product.discount ? "original-price" : ""}">DKK ${formatPrice(product.price)},-</span>
        ${product.discount ? `<strong>Nu DKK ${formatPrice(discountedPrice)},-</strong>` : ""}
      </div>
      <dl class="product-facts">
        <div><dt>Farve</dt><dd>${escapeHTML(product.basecolour || "Ikke angivet")}</dd></div>
        <div><dt>Sæson</dt><dd>${escapeHTML(product.season)}</dd></div>
        <div><dt>Brug</dt><dd>${escapeHTML(product.usagetype)}</dd></div>
        <div><dt>Produktnummer</dt><dd>${escapeHTML(product.id)}</dd></div>
      </dl>
      <button class="basket-button" type="button" ${product.soldout ? "disabled" : ""}>
        ${product.soldout ? "Udsolgt" : "Læg i kurv"}
      </button>
    </div>`;
  statusText.textContent = "";
}

function formatPrice(price) {
  return new Intl.NumberFormat("da-DK").format(price);
}

function escapeHTML(value) {
  const element = document.createElement("span");
  element.textContent = String(value);
  return element.innerHTML.replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
