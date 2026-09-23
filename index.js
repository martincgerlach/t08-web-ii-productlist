const endpoint = "https://kea-alt-del.dk/t7/api/categories";
const categoryContainer = document.querySelector(".category_list_container");
const statusText = document.querySelector("#status");
const retryButton = document.querySelector("#retry");
const categoryImages = {
  Accessories: 1535,
  Apparel: 1528,
  Footwear: 1543,
  "Free Items": 16937,
  "Personal Care": 18445,
  "Sporting Goods": 2354,
};

retryButton.addEventListener("click", getCategories);
getCategories();

async function getCategories() {
  categoryContainer.setAttribute("aria-busy", "true");
  statusText.textContent = "Henter kategorier…";
  retryButton.hidden = true;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`API-fejl: ${response.status}`);
    const categories = await response.json();
    console.table(categories);
    showCategories(categories);
  } catch (error) {
    statusText.textContent = "Kategorierne kunne ikke hentes. Prøv igen.";
    retryButton.hidden = false;
    console.error(error);
  } finally {
    categoryContainer.setAttribute("aria-busy", "false");
  }
}

function showCategories(categories) {
  let markup = "";

  categories.forEach((item) => {
    const imageId = categoryImages[item.category];
    const image = imageId
      ? `<img src="https://kea-alt-del.dk/t7/images/webp/640/${imageId}.webp" alt="" loading="lazy" width="640" height="800" />`
      : "";
    markup += `
      <a class="category-card" href="productlist.html?category=${encodeURIComponent(item.category)}">
        <span class="category-photo">${image}</span>
        <span class="category-caption"><strong>${escapeHTML(item.category)}</strong><span aria-hidden="true">↗</span></span>
      </a>`;
  });

  categoryContainer.innerHTML = markup;
  statusText.textContent = `${categories.length} kategorier`;
}

function escapeHTML(value) {
  const element = document.createElement("span");
  element.textContent = String(value);
  return element.innerHTML.replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
