// Produktets id kommer fra linket på produktlisten.
const id = new URLSearchParams(window.location.search).get("id") || "1525";
const endpoint = `https://kea-alt-del.dk/t7/api/products/${id}`;
const productContainer = document.querySelector(".product-detail");
const statusText = document.querySelector("#status");
const retryButton = document.querySelector("#retry");

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
  let price = `<span>DKK ${product.price},-</span>`;

  if (product.soldout) {
    badges += '<span class="badge sold-out-badge">Udsolgt</span>';
  }

  if (product.discount) {
    const salePrice = Math.round(product.price * (100 - product.discount) / 100);
    badges += `<span class="badge sale-badge">-${product.discount}%</span>`;
    price = `<span class="original-price">DKK ${product.price},-</span>
             <strong>Nu DKK ${salePrice},-</strong>`;
  }

  productContainer.innerHTML = `
    <div class="detail-image">
      <img src="https://kea-alt-del.dk/t7/images/webp/640/${product.id}.webp"
           alt="${product.productdisplayname}" width="640" height="853" />
      <div class="product-badges">${badges}</div>
    </div>
    <div class="detail-copy">
      <p class="eyebrow">${product.category} / ${product.articletype}</p>
      <h1>${product.productdisplayname}</h1>
      <p class="detail-brand">${product.brandname}</p>
      <div class="detail-price">${price}</div>
      <dl class="product-facts">
        <div><dt>Farve</dt><dd>${product.basecolour || "Ikke angivet"}</dd></div>
        <div><dt>Sæson</dt><dd>${product.season}</dd></div>
        <div><dt>Brug</dt><dd>${product.usagetype}</dd></div>
        <div><dt>Produktnummer</dt><dd>${product.id}</dd></div>
      </dl>
    </div>`;

  document.title = `${product.productdisplayname} | Studio Shop`;
  statusText.textContent = "";
  productContainer.setAttribute("aria-busy", "false");
}
