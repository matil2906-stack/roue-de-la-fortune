# La Roue de la Fortune — mettre le jeu en ligne (GitHub + Render)

Pas besoin de terminal, pas besoin d'installer Node.js. Tout se fait dans le
navigateur. Une fois en ligne, l'adresse marche depuis n'importe où (pas
besoin d'être sur le même Wi-Fi).

## Étape 1 — Créer un compte GitHub
Si tu n'en as pas déjà un : https://github.com/signup

## Étape 2 — Créer un nouveau dépôt (repository)
1. En haut à droite, clique sur **+** puis **New repository**
2. Donne-lui un nom, par exemple `roue-de-la-fortune`
3. Laisse-le en **Public**, ne coche rien d'autre
4. Clique sur **Create repository**

## Étape 3 — Envoyer les fichiers
1. Sur la page du dépôt tout neuf, clique sur **uploading an existing file**
   (ou **Add file** → **Upload files**)
2. Fais glisser **tout le contenu** de ce dossier dans la fenêtre :
   - `server.js`
   - `package.json`
   - `.gitignore`
   - le dossier `public` (avec `index.html` et `cinematique.mp4` dedans)
   - Ne mets **pas** le dossier `node_modules` s'il existe (il n'y en a pas
     ici, c'est normal)
3. En bas de page, clique sur **Commit changes**

## Étape 4 — Créer un compte Render
https://render.com → **Get Started** → connecte-toi avec ton compte GitHub

## Étape 5 — Créer le service
1. Sur Render, clique sur **New +** → **Web Service**
2. Choisis ton dépôt `roue-de-la-fortune` dans la liste (autorise l'accès si demandé)
3. Renseigne :
   - **Name** : ce que tu veux, ex. `roue-de-la-fortune`
   - **Build Command** : `npm install`
   - **Start Command** : `npm start`
   - **Instance Type** : `Free`
4. Clique sur **Create Web Service**

## Étape 6 — Attendre le déploiement
Render installe et démarre le serveur automatiquement (1 à 2 minutes).
Une fois que c'est prêt, en haut de la page Render, tu vois une adresse du
genre :
```
https://roue-de-la-fortune.onrender.com
```
**C'est cette adresse qu'il faut utiliser** sur tous les téléphones et sur
l'écran télé.

## Étape 7 — Jouer
- **Toi (chef de partie)** : ouvre l'adresse, clique sur "Chef de partie"
- **Les joueurs** : ouvrent la même adresse sur leur téléphone (en 4G ou en
  Wi-Fi, peu importe), cliquent sur "Joueur", entrent le code
- **La télé** : ouvre la même adresse sur l'appareil branché à la télé,
  clique sur "Écran d'affichage", entre le code télé

## Pour rejouer une prochaine fois
Rien à refaire : l'adresse Render reste la même. Ouvre-la simplement à
nouveau et clique sur "Chef de partie" pour une nouvelle partie.

## Un détail à savoir
Sur la version gratuite de Render, si personne ne s'en sert pendant un
moment, le serveur se met en pause automatiquement et met 30-60 secondes à
se "réveiller" à la prochaine ouverture — c'est normal, il suffit
d'attendre un peu la première fois.

## Si tu changes le jeu plus tard
Si je te redonne une nouvelle version de `server.js` ou du dossier
`public`, retourne sur ton dépôt GitHub, ouvre le fichier concerné, clique
sur le crayon (modifier), colle le nouveau contenu, et **Commit changes**.
Render redéploie automatiquement tout seul en 1-2 minutes.
