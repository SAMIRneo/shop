# BRICKFACE — Têtes de brique. Bande de potes.

Boutique de démonstration statique en HTML, CSS et JavaScript, sans installation.

**Site : https://samirneo.github.io/shop/**

## Les trois offres

La page s'ouvre sur les trois packs. Prix unitaire de comparaison : 39,90 €.

| Pack | Bonnets | Prix du pack | Économie |
|---|---:|---:|---:|
| Duo | 2 | 69,90 € | 9,90 € |
| Trio | 3 | 99,90 € | 19,80 € |
| Quatro | 4 | 129,90 € | 29,70 € |

Le prix Quatro est une proposition de démonstration. Le prix par bonnet est arrondi à deux décimales ; le total utilise le prix exact du pack en centimes.

Chaque bonnet se personnalise avec Sourire, Langue, Colère ou Surprise. Plusieurs bonnets peuvent porter la même expression. La quantité désigne le nombre de packs complets, de 1 à 10 par composition. La livraison est simulée comme offerte sur les trois offres.

## Parcours et images

- Trois cartes Duo, Trio, Quatro en premier, avec photos de 2, 3 et 4 skieurs portant les cagoules jaunes.
- Visuels carrés affichés sans recadrage, cartes pleine largeur sur mobile, accès rapide à chaque pack.
- Direction goofy/hype : jaune, violet, vert, contours noirs, stickers, ombres et bande animée.
- WebP avec variantes 640 / 960 / 1254 pixels, sélectionnées par `srcset` selon la largeur d'écran.
- Configurateur individuel avec aperçus et prix réactif.
- Galerie de huit images avec vignettes, légendes, flèches et balayage tactile.
- Visionneuse plein écran donnant accès aux quatorze images : produit, détails et nouvelles scènes de packs.
- Images entières avec `object-fit: contain`, dimensions explicites et chargement différé sous le premier écran.
- Série des quatre expressions, lookbook montagne et galerie de finitions.
- Panier de packs complets, compositions conservées et stockage local sur le navigateur.
- Fermeture par Échap, navigation clavier, gestion du focus et arrière-plan inactif dans les fenêtres.
- Barre de composition mobile et respect de la réduction des animations.

Les détails de référence ne sont pas des variantes supplémentaires vendues dans les packs. Les PNG sources et les JPEG existants sont conservés dans `assets/`.

## Lancement local

Ouvrir `index.html` ou servir le dossier :

```sh
python -m http.server 8000
```

Puis ouvrir http://localhost:8000.

## Modifier les prix et la collection

Les prix sont définis en centimes dans `PACKS` au début de `script.js`. Mettre aussi à jour les cartes de l'accueil, la FAQ et les valeurs initiales dans `index.html` pour garder le contenu sans JavaScript cohérent. Les couleurs, espacements et règles mobiles sont dans `styles.css`.

## Publication

GitHub Pages publie la racine de la branche `main`. Les chemins des fichiers sont relatifs pour fonctionner sous `/shop/`. Les métadonnées de partage utilisent l'adresse publique du site.

## Périmètre

Le panier est une démonstration : aucune commande, collecte d'adresse ou transaction réelle n'est envoyée. Aucun compte à rebours, stock aléatoire ou avis client inventé n'est affiché. Avant une ouverture réelle, connecter paiement, commandes, inventaire, livraison et informations commerciales.

BRICKFACE est non affilié à LEGO®. Visuels à titre d'illustration.

## Visuels de campagne ski

Les scènes Duo, Trio et Quatro ont été créées avec le générateur d’images intégré à partir de la photo du produit, puis vérifiées : exactement 2, 3 et 4 adultes, cagoules en tricot jaune avec sommet cylindrique, expressions visibles, décor de ski. Les fichiers `assets/pack-*-ski-v3*.webp` sont destinés au site. Les fichiers source et prompts de création sont conservés dans les livrables du chat. La mention de création par IA apparaît dans les légendes du zoom et le bas de page.

La boutique conserve son hébergement GitHub Pages ; le style s’inspire d’une boutique de streetwear, sans migration vers Shopify.
