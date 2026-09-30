# 08.01 – Dynamisk webshop

Åbn `productlist.html` med VS Codes Live Server. Alternativt: kør
`python3 -m http.server 8000` i denne mappe, og åbn
http://localhost:8000/productlist.html.

## Sådan virker koden

1. HTML indlæser `helpers.js` før sidens eget script med `defer`, så HTML og den fælles `escapeHTML()` er klar først.
2. `URLSearchParams` læser kategorien. Standard er Accessories.
3. `getProducts()` henter 30 produkter fra skolens API og viser dem med `console.table`.
4. `renderProducts()` laver en kopi af data, anvender det valgte filter og den valgte sortering og kalder `showProducts()`.
5. `showProducts()` bruger `forEach` og template literals til at samle kortenes markup.
6. `innerHTML` sætter kortene ind i `.product_list_container`.
7. Hvert kort linker til `productdetails.html?id=PRODUKT_ID&category=KATEGORI`, så tilbage-linket kan bevare kategorien.
8. `productdetails.js` henter det valgte produkt ud fra ID'et i URL'en.
9. `index.js` henter de seks kategorier og sender kategorien videre i URL'en.
10. Tilbud og udsolgt vises ud fra API'ets `discount` og `soldout` værdier.
11. De fire filterknapper viser alle produkter eller filtrerer efter køn.
12. De fire sorteringsknapper sorterer det aktuelle udsnit efter den viste pris eller navn, i begge retninger. `getProductPrice()` bruger tilbudsprisen ved gyldig rabat og ellers normalprisen.

`allProducts`, `currentFilter` og `currentSort` gemmer sidens tilstand. Hvis et filter eller en sortering vælges under indlæsning, bruges valget, når API-data ankommer. Sortering kræver ikke et nyt API-kald, og kildearrayet ændres ikke.

Prøv også `productlist.html?category=Apparel`.
Pris vises som API'ets tal; valuta er ikke angivet i datasættet.
Den fælles `escapeHTML()` beskytter tekst og HTML-attributter mod særlige tegn i API-teksten. Dynamiske URL-værdier kodes med `encodeURIComponent()`, og priser/rabat behandles som tal.
Ved netværksfejl vises en besked og en knap til at prøve igen.
Hvis kategorien mangler på produktsiden, bruges produktets kategori efter indlæsning; før indlæsning eller ved fejl er fallback Accessories. Hvis produkt-ID mangler, vises standardproduktet 1525. Et ugyldigt ID håndteres gennem samme fejlbesked som et produkt, der ikke findes.

## Sider

- `index.html`: dynamiske kategorier.
- `productlist.html`: produkter, betinget visning, filtrering og sortering.
- `productdetails.html`: dynamiske oplysninger om det valgte produkt.

Forsidefoto: [Roman Manshin på Unsplash](https://unsplash.com/photos/woman-poses-in-a-stylish-neutral-toned-outfit-5-Gyzo506fg), brugt under [Unsplash License](https://unsplash.com/license).
