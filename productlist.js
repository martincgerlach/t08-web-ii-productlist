
const params = new URLSearchParams(window.location.search);
const category = params.get("category") || "Accessories";
const endpoint = `https://kea-alt-del.dk/t7/api/products?category=${encodeURIComponent(category)}&limit=30`;
const container = document.querySelector(".product_list_container");
const statusText = document.querySelector("#status");
const retryButton = document.querySelector("#retry");
const filterButtons = document.querySelectorAll(".filter-button");
const sortButtons = document.querySelectorAll(".sort-button");
let allProducts = [];
let currentFilter = "All";
let currentSort = "";
let productsLoaded = false;

document.querySelector("h1").textContent = category;
document.title = `${category} | Studio Shop`;
retryButton.addEventListener("click", getProducts);
filterButtons.forEach((button) => button.addEventListener("click", filterProducts));
sortButtons.forEach((button) => button.addEventListener("click", sortProducts));

getProducts();

// Hent produkterne og vis dem, når svaret fra API'et er klar.
function getProducts() {
  productsLoaded = false;
  container.setAttribute("aria-busy", "true");
  statusText.textContent = "Henter produkter…";
  retryButton.hidden = true;

  fetch(endpoint)
    .then((response) => {
      if (!response.ok) throw new Error(`API-fejl: ${response.status}`);
      return response.json();
    })
    .then((products) => {
      allProducts = products;
      productsLoaded = true;
      console.table(products);
      renderProducts();
      container.setAttribute("aria-busy", "false");
    })
    .catch((error) => {
      statusText.textContent = "Produkterne kunne ikke hentes. Prøv igen.";
      retryButton.hidden = false;
      container.setAttribute("aria-busy", "false");
      console.error(error);
    });
}

function filterProducts(event) {
  currentFilter = event.currentTarget.textContent.trim();

  filterButtons.forEach((button) => {
    if (button === event.currentTarget) {
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");
    } else {
      button.classList.remove("active");
      button.setAttribute("aria-pressed", "false");
    }
  });

  renderProducts();
}

function sortProducts(event) {
  currentSort = event.currentTarget.dataset.sort;

  sortButtons.forEach((button) => {
    if (button === event.currentTarget) {
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");
    } else {
      button.classList.remove("active");
      button.setAttribute("aria-pressed", "false");
    }
  });

  renderProducts();
}

// En kopi filtreres og sorteres, så den oprindelige produktliste bevares.
function renderProducts() {
  if (!productsLoaded) return;

  let visibleProducts = [...allProducts];
  if (currentFilter !== "All") {
    visibleProducts = visibleProducts.filter((product) => product.gender === currentFilter);
  }

  if (currentSort === "price-up") {
    visibleProducts.sort((a, b) => getProductPrice(a) - getProductPrice(b));
  } else if (currentSort === "price-down") {
    visibleProducts.sort((a, b) => getProductPrice(b) - getProductPrice(a));
  } else if (currentSort === "name-az") {
    visibleProducts.sort((a, b) => String(a.productdisplayname).localeCompare(String(b.productdisplayname), "da"));
  } else if (currentSort === "name-za") {
    visibleProducts.sort((a, b) => String(b.productdisplayname).localeCompare(String(a.productdisplayname), "da"));
  }

  showProducts(visibleProducts);
}

function showProducts(products) {
  let markup = "";

  products.forEach((product) => {
    const discount = Number(product.discount);
    let stateClasses = "";
    let badges = "";
    let priceMarkup = `<p class="price">DKK ${formatPrice(product.price)},-</p>`;

    if (product.soldout) {
      stateClasses += " sold-out";
      badges += '<span class="badge sold-out-badge">Udsolgt</span>';
    }

    if (discount > 0 && discount <= 100) {
      const discountedPrice = getProductPrice(product);
      stateClasses += " on-sale";
      badges += `<span class="badge sale-badge">-${discount}%</span>`;
      priceMarkup = `<p class="price original-price">DKK ${formatPrice(product.price)},-</p>
                     <p class="sale-price">Nu DKK ${formatPrice(discountedPrice)},-</p>`;
    }

    markup += `
      <article class="product-card${stateClasses}">
        <a href="productdetails.html?id=${encodeURIComponent(product.id)}&amp;category=${encodeURIComponent(category)}">
          <div class="product-image">
            <img src="https://kea-alt-del.dk/t7/images/webp/640/${encodeURIComponent(product.id)}.webp"
                 alt="${escapeHTML(product.productdisplayname)}" width="640" height="853" loading="lazy" />
            <div class="product-badges">${badges}</div>
          </div>
          <p class="brand">${escapeHTML(product.brandname)}</p>
          <h2>${escapeHTML(product.productdisplayname)}</h2>
          <div class="price-row">${priceMarkup}</div>
          <span class="product-link">Se produkt <span aria-hidden="true">↗</span></span>
        </a>
      </article>`;
  });

  container.innerHTML = markup;
  if (products.length > 0) {
    statusText.textContent = `${products.length} produkter`;
  } else {
    statusText.textContent = "Ingen produkter i denne kategori.";
  }
}

function formatPrice(price) {
  return new Intl.NumberFormat("da-DK").format(price);
}

// Sortering og produktkort skal bruge den samme pris, også ved tilbud.
function getProductPrice(product) {
  const price = Number(product.price);
  const discount = Number(product.discount);
  if (discount > 0 && discount <= 100) {
    return Math.round(price * (100 - discount) / 100);
  }
  return price;
}
