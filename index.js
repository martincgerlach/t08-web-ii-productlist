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
const heroSlides = [
  {
    eyebrow: "STUDIO SHOP / THE EDIT",
    title: "Din stil.<br /><em>Dit valg.</em>",
    description: "Udforsk accessories, tøj og de små detaljer, der gør stilen til din egen.",
    linkText: "Udforsk kategorierne",
    link: "#kategorier",
    image: "images/hero-fashion.jpg",
    imageAlt: "Model i lyst outfit ved et vindue",
    media: "editorial",
    label: "THE EVERYDAY EDIT / 2026",
  },
  {
    eyebrow: "STUDIO SHOP / APPAREL",
    title: "Klæd dig.<br /><em>Som dig selv.</em>",
    description: "Find tøj, der passer til både hverdagen og dit eget udtryk.",
    linkText: "Se apparel",
    link: "productlist.html?category=Apparel",
    image: "https://kea-alt-del.dk/t7/images/webp/640/1528.webp",
    imageAlt: "Model i sort overdel",
    media: "apparel",
    label: "THE APPAREL EDIT / 2026",
  },
  {
    eyebrow: "STUDIO SHOP / FOOTWEAR",
    title: "Gå din vej.<br /><em>I din stil.</em>",
    description: "Se sko, der gør det enkelt at sætte præg på dit look.",
    linkText: "Se footwear",
    link: "productlist.html?category=Footwear",
    image: "https://kea-alt-del.dk/t7/images/webp/640/1543.webp",
    imageAlt: "Sort sneaker med hvid sål",
    media: "footwear",
    label: "THE FOOTWEAR EDIT / 2026",
  },
  {
    eyebrow: "STUDIO SHOP / ACCESSORIES",
    title: "Små detaljer.<br /><em>Stor forskel.</em>",
    description: "Gør stilen personlig med de accessories, du vender tilbage til.",
    linkText: "Se accessories",
    link: "productlist.html?category=Accessories",
    image: "https://kea-alt-del.dk/t7/images/webp/640/1535.webp",
    imageAlt: "Model med sort kasket",
    media: "accessories",
    label: "THE ACCESSORIES EDIT / 2026",
  },
];
let currentHeroSlide = 0;

document.querySelector("#hero-previous").addEventListener("click", () => changeHeroSlide(-1));
document.querySelector("#hero-next").addEventListener("click", () => changeHeroSlide(1));

function changeHeroSlide(direction) {
  currentHeroSlide += direction;
  if (currentHeroSlide < 0) currentHeroSlide = heroSlides.length - 1;
  if (currentHeroSlide >= heroSlides.length) currentHeroSlide = 0;

  const slide = heroSlides[currentHeroSlide];
  document.querySelector("#hero-eyebrow").textContent = slide.eyebrow;
  document.querySelector("#home-title").innerHTML = slide.title;
  document.querySelector("#hero-description").textContent = slide.description;
  const heroLink = document.querySelector("#hero-link");
  heroLink.href = slide.link;
  document.querySelector("#hero-link-text").textContent = slide.linkText;
  const heroImage = document.querySelector("#hero-image");
  heroImage.src = slide.image;
  heroImage.alt = slide.imageAlt;
  document.querySelector(".home-hero-image").dataset.slide = slide.media;
  document.querySelector("#hero-image-label").textContent = slide.label;
  document.querySelector("#hero-image-label-mobile").textContent = slide.label;
  document.querySelector("#hero-current").textContent = `0${currentHeroSlide + 1}`;
  document.querySelector(".hero-controls").style.setProperty("--hero-progress", `${((currentHeroSlide + 1) / heroSlides.length) * 100}%`);
}

retryButton.addEventListener("click", getCategories);
getCategories();

function getCategories() {
  categoryContainer.setAttribute("aria-busy", "true");
  statusText.textContent = "Henter kategorier…";
  retryButton.hidden = true;

  fetch(endpoint)
    .then((response) => {
      if (!response.ok) throw new Error(`API-fejl: ${response.status}`);
      return response.json();
    })
    .then((categories) => {
      console.table(categories);
      showCategories(categories);
      categoryContainer.setAttribute("aria-busy", "false");
    })
    .catch((error) => {
      statusText.textContent = "Kategorierne kunne ikke hentes. Prøv igen.";
      retryButton.hidden = false;
      categoryContainer.setAttribute("aria-busy", "false");
      console.error(error);
    });
}

function showCategories(categories) {
  let markup = "";

  categories.forEach((item) => {
    const imageId = categoryImages[item.category];
    let image = "";
    if (imageId) {
      image = `<img src="https://kea-alt-del.dk/t7/images/webp/640/${imageId}.webp" alt="" loading="lazy" width="640" height="800" />`;
    }
    markup += `
      <a class="category-card" href="productlist.html?category=${encodeURIComponent(item.category)}">
        <span class="category-photo">${image}<span class="category-prompt" aria-hidden="true">Se kategori ↗</span></span>
        <span class="category-caption"><strong>${escapeHTML(item.category)}</strong><span aria-hidden="true">↗</span></span>
      </a>`;
  });

  categoryContainer.innerHTML = markup;
  statusText.textContent = "";
}
