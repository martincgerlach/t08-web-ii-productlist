// API-tekst skal vises som tekst, også når den indeholder HTML-tegn eller anførselstegn.
function escapeHTML(value) {
  const element = document.createElement("span");
  element.textContent = String(value);
  return element.innerHTML.replaceAll('"', "&quot;").replaceAll("'", "&#39;");
}
