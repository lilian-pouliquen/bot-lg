---
hide:
  - navigation
---

# Bot-lg

<div style="text-align: center;">
    <img src="assets/images/logo.png" width="25%">
</div>

## Qu'est-ce que Bot-lg ?

Bot-lg est un robot que vous pouvez inviter sur vos serveurs Discord. Il vous permet d'organiser des parties de ***Loups-garous de Thiercelieux***. Ce robot apporte tout un lot de commandes pour faciliter la vie du maître du jeu et permet de préparer votre serveur à accueillir vos parties en créant les rôles et salons nécessaires.

## Roles

Voici la liste des rôles disponibles et leur description. Pour plus de détail, n'hésitez pas à vous rendre sur la page [Rôles](roles.md).

| Nom              | Description                                                                                                                                                                                                |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Amoureux         | Choisis par Cupidon, si l'un des deux amoureux est éliminé, l'autre le rejoint, mort de chagrin.                                                                                                           |
| Ancien           | Il peut survivre à une attaque des loups-garous. S'il est éliminé par les villageois, ces derniers perdent toutes leurs compétences.                                                                       |
| Ange             | L'ange doit mourir des mains des villageois lors du premier vote de la partie. S'il réussi, il gagne. Sinon, il devient un simple villageois.                                                              |
| Ankou            | L'Ankou est un villageois normal jusqu'à sa mort. Lorsqu'il est éliminé, il a la capacité de voter encore deux fois lors des votes du village.                                                             |
| Assassin         | Une fois par nuit, l'assassion peut éliminer un autre joueur.                                                                                                                                              |
| Chaman           | Le chaman à la capacité d'entendre les morts. Il peut donc lire dans le salon réservé aux joueurs éliminés.                                                                                                |
| Chasseur         | Lorsque le chasseur est éliminé, il peut emmener un autre joueur avec lui dans la mort.                                                                                                                    |
| Cupidon          | Durant la première nuit, il choisit deux joueur qui tomberont amoureux.                                                                                                                                    |
| Envoûté          | Les envoûtés sont choisis par le joueur de flûte. Ils ne peuvent essayer de l'éliminer et doivent le défendre à tout prix.                                                                                 |
| Gardien          | Chaque nuit, le gardien choisi une personne à protéger des loups-garous. Il ne peut protéger deux fois la même personne d'affilé.                                                                          |
| Imbibé d'essence | Désigné par le pyromane. Si ce dernier décide de brûler ses victimes, les imbibés sont éliminés.                                                                                                           |
| Infecté          | Choisi par le père des loups, il devient l'un des leurs, tout en gardant ses autres compétences.                                                                                                           |
| Joueur de flûte  | Son but est d'envoûter tout le village. Il peut envouter deux personnes par nuit.                                                                                                                          |
| Loup blanc       | Le loup blanc est un loup-garou solitaire. Il agit comme un loup-garou normal, mais peut éliminer l'un des sien toutes les deux nuits.                                                                     |
| Loup-garou       | Les loups-garous choisissent chaque soir une victime à dévorer.                                                                                                                                            |
| Maître du jeu    | Le maître du jeu est aux commandes de la partie, c'est lui qui peut utiliser la majeure partie des commandes de Bot-lg.                                                                                    |
| Mort             | Les joueurs éliminés se voient attribuer ce rôle et perdre tous les autres.                                                                                                                                                          |
| Muet             | Ce rôle empêche les joueurs de parler dans le salon vocal.                                                                                                                                                 |
| Père des loups   | Une fois par partie, le père des loups peut choisir d'infecter la cible des loups-garous.                                                                                                                  |
| Pyromane         | Une fois par nuit, le pyromane peut choisir d'imbiber un joueur d'essence ou de brûler ceux qui le sont déjà.                                                                                              |
| Sorcière         | La sorcière possède deux potions par partie : une potion de vie et une potion de mort. La première permet de sauver la cible des loups-garous. La deuxième permet d'éliminer un autre joueur de son choix. |
| Villageois       | Le villageois n'a aucune compétence particulière.                                                                                                                                                          |
| Voyante          | Chaque nuit, la voyante peut observer le rôle d'un autre joueur. Les rôles `Amoureux`, `Envoûté`, `Imbibé d'essence` et `Infecté` ne lui sont pas communiqués.                                             |

## Salons

Voici la liste des salons et de leur spécificités. Vous retrouverez les informations détaillées des salons sur la page [Salons](salons.md):

| Nom              | Spécificité                                                                           |
| ---------------- | ------------------------------------------------------------------------------------- |
| amoureux         | Salon réservé au rôle `Amoureux`.                                                    |
| ancien           | Salon réservé au rôle `Ancien`.                                                      |
| ange             | Salon réservé au rôle `Ange`.                                                        |
| ankou            | Salon réservé au rôle `Ankou`.                                                       |
| assassin         | Salon réservé au rôle `Assassin`.                                                    |
| chaman           | Salon réservé au rôle `Chaman`.                                                      |
| chasseur         | Salon réservé au rôle `Chasseur`.                                                    |
| cupidon          | Salon réservé au rôle `Cupidon`.                                                     |
| envoûté          | Salon réservé au rôle `Envoûté`.                                                     |
| gardien          | Salon réservé au rôle `Gardien`.                                                     |
| imbibé-dessence  | Salon réservé au rôle `Imbibé d'essence`.                                            |
| infecté          | Salon réservé au rôle `Infecté`.                                                     |
| joueur-de-flûte  | Salon réservé au rôle `Joueur de flûte`.                                             |
| loup-blanc       | Salon réservé au rôle `Loup blanc`.                                                  |
| loup-garou       | Salon réservé aux rôles `Loup-garou`, `Loup blanc`, `Père des loups` et `Infecté`.   |
| maître-du-jeu    | Salon réservé au rôle `Maître du jeu`.                                               |
| mort             | Salon réservé au rôle `Mort`. Le rôle `Chaman` peut lire les messages de ce salon.   |
| père-des-loups   | Salon réservé au rôle `Père des loups`.                                              |
| Place du village | Salon vocal où les joueurs se connecte pour jouer.                                    |
| pyromane         | Salon réservé au rôle `Pyromane`.                                                    |
| sorcière         | Salon réservé au rôle `Sorcière`.                                                    |
| village          | Salon textuel servant aux débats de la journée, afin de décider du joueur à éliminer. Tous les joueurs peuvent y accéder. |
| villageois       | Salon réservé au rôle `Villageois`.                                                  |
| voyante          | Salon réservé au rôle `Voyante`.                                                     |

## Commandes

Voici la liste des commandes disponibles. Plus de détails sur leur utilisation se trouvent sur la page [Commandes](commandes.md) :

| Nom           | Effet                                                                                                                                                                                |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `roles`       | Si l'utilisateur a le rôle `Maître du jeu`, affiche dans le salon `maître-du-jeu` la liste des rôles et les joueurs ayant ces rôles. Sinon affiche la liste des rôles encore en jeu. |
| `assigner`    | Assigne le rôle précisé aux joueurs spécifiés.                                                                                                                                       |
| `commencer`   | Assigne aléatoirement les rôles donnés selon le quota attribué.                                                                                                                      |
| `minuteur`    | Démarre un minuteur pour le temps donné (défaut : 3 minutes).                                                                                                                        |
| `soleil`      | Il y a deux sous-commandes : `se_couche`, attribue le rôle `Muet` aux joueurs, les empêchant ainsi de parler. `se_leve` leur redonne la parole.                                      |
| `terminer`    | Enlève tous les rôles des joueurs pour terminer la partie.                                                                                                                           |
| `vote`        | Affiche le vote spécifié.                                                                                                                                                            |
| `configurer`  | Affiche la configuration de Bot-lg pour le serveur Discord. Si la sous-commande `langue` est utilisée, permet de configurer la langue de Bot-lg (défaut : `fr`).                     |
| `initialiser` | Prépare le serveur Discord en ajoutant les rôles et salons nécessaire.                                                                                                               |
| `nettoyer`    | Efface tous les messages non épinglés du salon courant.                                                                                                                              |
