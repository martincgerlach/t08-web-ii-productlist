// Produktets id kommer fra linket på produktlisten.
const params = new URLSearchParams(window.location.search);
const id = params.get("id") || "1525";
const category = params.get("category");
const endpoint = `https://kea-alt-del.dk/t7/api/products/${encodeURIComponent(id)}`;
const productContainer = document.querySelector(".product-detail");
const statusText = document.querySelector("#status");
const retryButton = document.querySelector("#retry");
const backLink = document.querySelector("#back-to-products");

backLink.href = `productlist.html?category=${encodeURIComponent(category || "Accessories")}`;

retryButton.addEventListener("click", getProduct);
getProduct();

function getProduct() {
  statusText.textContent = "Henter produkt…";
  retryButton.hidden = true;
  productContainer.setAttribute("aria-busy", "true");

  fetch(endpoint)
    .then((response) => {
      if (!response.ok) throw new Error("Produktet blev ikke fundet");
      return response.json();
    })
    .then(showProduct)
    .catch((error) => {
      statusText.textContent = "Produktet kunne ikke hentes. Prøv igen.";
      retryButton.hidden = false;
      productContainer.setAttribute("aria-busy", "false");
      console.error(error);
    });
}

function showProduct(product) {
  let badges = "";
  const productPrice = Number(product.price);
  const discount = Number(product.discount);
  let price = `<span>DKK ${productPrice},-</span>`;

  if (product.soldout) {
    badges += '<span class="badge sold-out-badge">Udsolgt</span>';
  }

  if (discount > 0 && discount <= 100) {
    const salePrice = Math.round(productPrice * (100 - discount) / 100);
    badges += `<span class="badge sale-badge">-${discount}%</span>`;
    price = `<span class="original-price">DKK ${productPrice},-</span>
             <strong>Nu DKK ${salePrice},-</strong>`;
  }

  productContainer.innerHTML = `
    <div class="detail-image">
      <img src="https://kea-alt-del.dk/t7/images/webp/640/${encodeURIComponent(product.id)}.webp"
           alt="${escapeHTML(product.productdisplayname)}" width="640" height="853" />
      <div class="product-badges">${badges}</div>
    </div>
    <div class="detail-copy">
      <p class="eyebrow">${escapeHTML(product.category)} / ${escapeHTML(product.articletype)}</p>
      <h1>${escapeHTML(product.productdisplayname)}</h1>
      <p class="detail-brand">${escapeHTML(product.brandname)}</p>
      <div class="detail-price">${price}</div>
      <dl class="product-facts">
        <div><dt>Farve</dt><dd>${escapeHTML(product.basecolour || "Ikke angivet")}</dd></div>
        <div><dt>Sæson</dt><dd>${escapeHTML(product.season)}</dd></div>
        <div><dt>Brug</dt><dd>${escapeHTML(product.usagetype)}</dd></div>
        <div><dt>Produktnummer</dt><dd>${escapeHTML(product.id)}</dd></div>
      </dl>
    </div>`;

  document.title = `${product.productdisplayname} | Studio Shop`;
  const returnCategory = category || product.category || "Accessories";
  backLink.href = `productlist.html?category=${encodeURIComponent(returnCategory)}`;
  statusText.textContent = "";
  productContainer.setAttribute("aria-busy", "false");
}
