# 08.01.A – Dynamisk produktliste

Åbn `productlist.html` med VS Codes Live Server. Alternativt: kør
`python3 -m http.server 8000` i denne mappe, og åbn
http://localhost:8000/productlist.html.

## Sådan virker koden

1. HTML linker til `productlist.js` med `defer`, så HTML er klar først.
2. `URLSearchParams` læser kategorien. Standard er Accessories.
3. `getProducts()` henter 10 produkter fra skolens API og viser dem med `console.table`.
4. `showProducts()` bruger `forEach` og template literals til at samle kortenes markup.
5. `innerHTML` sætter kortene ind i `.product_list_container`.
6. Hvert kort linker til `productdetails.html?id=PRODUKT_ID`.

Prøv også `productlist.html?category=Apparel`.
Pris vises som API'ets tal; valuta er ikke angivet i datasættet.
`escapeHTML()` beskytter HTML-strukturen mod særlige tegn i API-teksten.
Ved netværksfejl vises en besked og en knap til at prøve igen.

## Afgrænsning

Produktdetaljesiden er kun en tydelig pladsholder til næste øvelse.
Forside, betinget visning af tilbud/udsolgt, filtreringskontroller og sortering
hører til de øvrige opgaver og er ikke implementeret her.
