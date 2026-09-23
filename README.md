# 08.01.A-E – Dynamisk webshop

Åbn `productlist.html` med VS Codes Live Server. Alternativt: kør
`python3 -m http.server 8000` i denne mappe, og åbn
http://localhost:8000/productlist.html.

## Sådan virker koden

1. HTML linker til `productlist.js` med `defer`, så HTML er klar først.
2. `URLSearchParams` læser kategorien. Standard er Accessories.
3. `getProducts()` henter 30 produkter fra skolens API og viser dem med `console.table`.
4. `showProducts()` bruger `forEach` og template literals til at samle kortenes markup.
5. `innerHTML` sætter kortene ind i `.product_list_container`.
6. Hvert kort linker til `productdetails.html?id=PRODUKT_ID`.
7. `productdetails.js` henter det valgte produkt ud fra ID'et i URL'en.
8. `index.js` henter de seks kategorier og sender kategorien videre i URL'en.
9. Tilbud og udsolgt vises ud fra API'ets `discount` og `soldout` værdier.
10. De fire filterknapper viser alle produkter eller filtrerer efter køn.

Prøv også `productlist.html?category=Apparel`.
Pris vises som API'ets tal; valuta er ikke angivet i datasættet.
`escapeHTML()` beskytter HTML-strukturen mod særlige tegn i API-teksten.
Ved netværksfejl vises en besked og en knap til at prøve igen.

## Sider

- `index.html`: dynamiske kategorier.
- `productlist.html`: produkter, betinget visning og filtrering.
- `productdetails.html`: dynamiske oplysninger om det valgte produkt.

Sortering hører til en senere øvelse og er ikke implementeret her.

Forsidefoto: [Roman Manshin på Unsplash](https://unsplash.com/photos/woman-poses-in-a-stylish-neutral-toned-outfit-5-Gyzo506fg), brugt under [Unsplash License](https://unsplash.com/license).
