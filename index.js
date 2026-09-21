const endpoint = "https://kea-alt-del.dk/t7/api/categories";
const categoryContainer = document.querySelector(".category_list_container");
const statusText = document.querySelector("#status");
const retryButton = document.querySelector("#retry");

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

  categories.forEach((item, index) => {
    const number = String(index + 1).padStart(2, "0");
    markup += `
      <a class="category-card" href="productlist.html?category=${encodeURIComponent(item.category)}">
        <span>${number}</span>
        <strong>${escapeHTML(item.category)}</strong>
        <span aria-hidden="true">↗</span>
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
