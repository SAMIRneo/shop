# 🧱 BRICKFACE™ — Boutique hype "LEGO Balaclava Minifigure"

Boutique e-commerce **statique** (HTML / CSS / JS vanilla, zéro dépendance) au style **goofy / hype** :
jaune LEGO + encre noire, stickers penchés, marquee qui défile, confettis au panier, compte à rebours.

## ▶️ Lancer la boutique

Aucune installation nécessaire. Ouvre simplement **`index.html`** dans ton navigateur
(double-clic, ou clic droit → Ouvrir avec → Chrome/Edge/Firefox).

> Astuce : pour un rendu 100% identique au vrai Shop, tu peux servir le dossier avec un petit serveur local :
> `python -m http.server 8000` puis ouvrir `http://localhost:8000`.

## 🖼️ Les visuels produits (déjà en place !)

Les 11 photos sont dans **`assets/`** (PNG sources conservés + JPEG optimisés **22 Mo → 1,41 Mo**, vignettes 320 px dans `assets/thumbs/`) :

| Fichier | Utilisation |
|---|---|
| `assets/01-produit-sourire.jpg` | **Image principale de la galerie** + carte *Sourire* |
| `assets/02-produit-langue.jpg` | Galerie + carte *Langue* |
| `assets/03-produit-colere.jpg` | Galerie + carte *Colère* |
| `assets/04-produit-surprise.jpg` | Galerie + carte *Surprise* |
| `assets/05-ski-portrait.jpg` | **Section lifestyle** + galerie + `og:image` — portrait montagne |
| `assets/06-ski-action.jpg` | **Hero** — photo d'action sur la neige + galerie |
| `assets/07-marketing-impact.jpg` | **Section Impact** — preuve sociale et chiffres clés |
| `assets/08-marketing-collection.jpg` | **Section Pack duo** — visuel collection |
| `assets/09-reference-sourire-blanc.jpg` | Section *3 styles de bouche* — Modèle 01 |
| `assets/10-reference-sourire-simple.jpg` | Section *3 styles de bouche* — Modèle 02 |
| `assets/11-reference-dents-quadrillees.jpg` | Section *3 styles de bouche* — Modèle 03 |
| `assets/thumbs/*.jpg` | Vignettes 320 px de la galerie (chargement léger) |

> Les **titres des fichiers décrivent le visuel** : ils servent d'`alt`, de légende de lightbox et de titre de carte.
> Pour changer une photo : remplace le JPEG en gardant le même nom (et régénère la vignette dans `thumbs/`). Aucune modif de code nécessaire.

## 🛒 Ce que fait la boutique

- **Galerie 6 photos** : vignettes + **dots** + flèches + **compteur**, **lightbox** 🔍 (clavier `←` `→` / `Échap`), **swipe tactile**, squelette de chargement, recadrage `object-position` des visuels portrait
- **Barre d'achat mobile fixe** (prix + CTA) qui apparaît quand le buybox sort de l'écran
- **Barre de progression de scroll** dans l'en-tête
- **Barre de progression livraison offerte** dans le panier (jusqu'à 50€)
- **Variantes** : 4 couleurs · **Quantité** · **packs** 1/2/3 avec remises
- **Panier coulissant** : +/−, retrait, sous-total, livraison offerte dès 50€, total
- **Confettis** 🎉 + **toasts** (aria-live) à l'ajout / newsletter
- **Compte à rebours**, **stock limité**, **"+X personnes regardent"**
- **Révélations au scroll** échelonnées, **bouton retour en haut**
- **FAQ** dépliable, **avis clients**, **section lifestyle**, **footer newsletter**
- **4 cartes Expressions** (titres `Sourire` / `Langue` / `Colère` / `Surprise`) cliquables → elles affichent la photo dans la galerie
- **3 cartes « styles de bouche »** (Modèle 01/02/03) et **section Impact** (2 947 têtes · 4,9/5 · 48h · 30j)
- **Section Pack duo** : le bouton sélectionne le bundle 2 (69,90 €) et ramène au buybox

### ♿ Accessibilité
Focus clavier visible (`:focus-visible`), `role="dialog"` sur panier + lightbox, `aria-live` sur les toasts,
navigation clavier complète, `prefers-reduced-motion` respecté, images avec `alt` et `loading="lazy"`.

> Le panier fonctionne en mémoire (démo). Pour un vrai paiement, branche un backend / Shopify Buy Button
> ou Stripe Checkout sur le bouton `#checkout` dans `script.js`.

## 📁 Structure

```
shop/
├── index.html      → toute la structure de la page
├── styles.css      → le design goofy/hype complet
├── script.js        → galerie, panier, confettis, compte à rebours
├── assets/          → tes visuels (product / lifestyle / hero)
└── README.md
```

## 🎨 Personnaliser rapidement

- **Couleurs** : variables CSS en haut de `styles.css` (`--yellow`, `--red`, `--ink`…)
- **Prix** : `UNIT_PRICE` et `BUNDLES` en haut de `script.js`
- **Textes** : directement dans `index.html`

---
Démo à but illustratif — non affilié à LEGO®.


## Site en ligne

https://SAMIRneo.github.io/shop/

Publication via GitHub Pages depuis la branche `main`. Le paiement reste une simulation.
