# Rôles de Bot-lg

## Introduction

Vous trouverez ici toutes les informations concernant les rôles utilisés par Bot-lg.

## Codes des rôles

Certaines commandes nécessitent de connaître les codes des rôles, voici le tableau les regroupant :

| Code   | Nom             |
| ------ | --------------- |
| `anc`  | Ancien          |
| `ang`  | Ange            |
| `ank`  | Ankou           |
| `ass`  | Assassin        |
| `cham` | Chaman          |
| `chas` | Chasseur        |
| `cup`  | Cupidon         |
| `gar`  | Gardien         |
| `jdf`  | Joueur de flûte |
| `lgb`  | Loup blanc      |
| `lg`   | Loup-garou      |
| `pdl`  | Père des loups  |
| `pyr`  | Pyromane        |
| `sor`  | Sorcière        |
| `vil`  | Villageois      |
| `voy`  | Voyante         |

## Types de rôles

| Type        | Description                                                                                                                                                   |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Additionnel | Ce rôle est ajouté aux rôles déjà possédés par le joueur. Ce dernier peut utiliser les compétences de tous ses rôles.                                         |
| Loup-garou  | Ils gangent une fois que tous les rôles de type `Villageois` et `Solo`.                                                                                       |
| Modérateur  | Il gère les parties. Un joueur ne peut pas être modérateur (`Maître du jeu`).                                                                                 |
| Mort        | Le joueur est éliminé. Les morts peuvent toujours discuter dans le salon dédié, où le chaman peut notamment les écouter.                                      |
| Solo        | Les joueurs ayant un rôle de ce type doivent éliminer tous les autres joueurs pour gagner.                                                                    |
| Villageois  | Les joueurs ayant un rôle de ce type gagnent lorsque toutes les menaces sont écartées. C'est-à-dire qu'il n'y a plus de rôles de type `Loup-garou` et `Solo`. |

## Informations détaillées des rôles

### Amoureux

|                              |                                                                                                                                                                                                                                                    |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Identifiant de configuration | `roleLoversId`                                                                                                                                                                                                                                     |
| Type                         | Additionnel                                                                                                                                                                                                                                        |
| Description                  | En début de partie, deux joueurs sont choisis par Cupidon, si l'un des deux amoureux est éliminé, l'autre le rejoint, mort de chagrin. Dans le cas où l'un des amoureux n'a pas un rôle de type `Villageois`, les amoureux doivent gagner en solo. |

### Ancien

|                              |                                                                                                                                      |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Identifiant de configuration | `roleElderId`                                                                                                                        |
| Code                         | `anc`                                                                                                                                |
| Type                         | Villageois                                                                                                                           |
| Description                  | Il peut survivre à une attaque des loups-garous. S'il est éliminé par les villageois, ces derniers perdent toutes leurs compétences. |

### Ange

|                              |                                                                                                                                               |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Identifiant de configuration | `roleAngelId`                                                                                                                                 |
| Code                         | `ang`                                                                                                                                         |
| Type                         | Villageois                                                                                                                                    |
| Description                  | L'ange doit mourir des mains des villageois lors du premier vote de la partie. S'il réussi, il gagne. Sinon, il devient un simple villageois. |

### Ankou

|                              |                                                                                                                                                |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Identifiant de configuration | `roleReaperId`                                                                                                                                 |
| Code                         | `ank`                                                                                                                                          |
| Type                         | Villageois                                                                                                                                     |
| Description                  | L'Ankou est un villageois normal jusqu'à sa mort. Lorsqu'il est éliminé, il a la capacité de voter encore deux fois lors des votes du village. |

### Assassin

|                              |                                                               |
| ---------------------------- | ------------------------------------------------------------- |
| Identifiant de configuration | `roleAssassinId`                                              |
| Code                         | `ass`                                                         |
| Type                         | Solo                                                          |
| Description                  | Une fois par nuit, l'assassion peut éliminer un autre joueur. |

### Chaman

|                              |                                                                                                             |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Identifiant de configuration | `roleShamanId`                                                                                              |
| Code                         | `cham`                                                                                                      |
| Type                         | Villageois                                                                                                  |
| Description                  | Le chaman à la capacité d'entendre les morts. Il peut donc lire dans le salon réservé aux joueurs éliminés. |

### Chasseur

|                              |                                                                                         |
| ---------------------------- | --------------------------------------------------------------------------------------- |
| Identifiant de configuration | `roleHunterId`                                                                          |
| Code                         | `chas`                                                                                  |
| Type                         | Villageois                                                                              |
| Description                  | Lorsque le chasseur est éliminé, il peut emmener un autre joueur avec lui dans la mort. |

### Cupidon

|                              |                                                                         |
| ---------------------------- | ----------------------------------------------------------------------- |
| Identifiant de configuration | `roleCupidId`                                                           |
| Code                         | ``                                                                      |
| Type                         | Villageois                                                              |
| Description                  | Durant la première nuit, il choisit deux joueur qui tomberont amoureux. |

### Envoûté

|                              |                                                                                                                            |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Identifiant de configuration | `roleEnchantedId`                                                                                                          |
| Type                         | Additionnel                                                                                                                |
| Description                  | Les envoûtés sont choisis par le joueur de flûte. Ils ne peuvent essayer de l'éliminer et doivent le défendre à tout prix. |

### Gardien

|                              |                                                                                                                                   |
| ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Identifiant de configuration | `roleGuardId`                                                                                                                     |
| Code                         | `gar`                                                                                                                             |
| Type                         | Villageois                                                                                                                        |
| Description                  | Chaque nuit, le gardien choisi une personne à protéger des loups-garous. Il ne peut protéger deux fois la même personne d'affilé. |

### Imbibé d'essence

|                              |                                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------ |
| Identifiant de configuration | `roleOiledId`                                                                                    |
| Type                         | Additionnel                                                                                      |
| Description                  | Désigné par le pyromane. Si ce dernier décide de brûler ses victimes, les imbibés sont éliminés. |

### Infecté

|                              |                                                                                                  |
| ---------------------------- | ------------------------------------------------------------------------------------------------ |
| Identifiant de configuration | `roleInfectedId`                                                                                 |
| Type                         | Additionnel, Loup-garou                                                                          |
| Description                  | Choisi par le père des loups, il devient l'un des leurs, tout en gardant ses autres compétences. |

### Joueur de flûte

|                              |                                                                                   |
| ---------------------------- | --------------------------------------------------------------------------------- |
| Identifiant de configuration | `roleFlutistId`                                                                   |
| Code                         | `jdf`                                                                             |
| Type                         | Solo                                                                              |
| Description                  | Son but est d'envoûter tout le village. Il peut envouter deux personnes par nuit. |

### Loup blanc

|                              |                                                                                                                                        |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Identifiant de configuration | `roleWhiteWerewolfId`                                                                                                                  |
| Code                         | `lgb`                                                                                                                                  |
| Type                         | Solo, Loup-garou                                                                                                                       |
| Description                  | Le loup blanc est un loup-garou solitaire. Il agit comme un loup-garou normal, mais peut éliminer l'un des sien toutes les deux nuits. |

### Loup-garou

|                              |                                                                 |
| ---------------------------- | --------------------------------------------------------------- |
| Identifiant de configuration | `roleWerewolfId`                                                |
| Code                         | `lg`                                                            |
| Type                         | Loup-garou                                                      |
| Description                  | Les loups-garous choisissent chaque soir une victime à dévorer. |

### Maître du jeu

|                              |                                                                                                                         |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Identifiant de configuration | `roleGameMasterId`                                                                                                      |
| Type                         | Modérateur                                                                                                              |
| Description                  | Le maître du jeu est aux commandes de la partie, c'est lui qui peut utiliser la majeure partie des commandes de Bot-lg. |

### Mort

|                              |                                                                             |
| ---------------------------- | --------------------------------------------------------------------------- |
| Identifiant de configuration | `roleDeadId`                                                                |
| Type                         | Mort                                                                        |
| Description                  | Les joueurs éliminés se voient attribuer ce rôle et perdre tous les autres. |

### Muet

|                              |                                                            |
| ---------------------------- | ---------------------------------------------------------- |
| Identifiant de configuration | `roleMutedId`                                              |
| Type                         | Additionnel                                                |
| Description                  | Ce rôle empêche les joueurs de parler dans le salon vocal. |

### Père des loups

|                              |                                                                                           |
| ---------------------------- | ----------------------------------------------------------------------------------------- |
| Identifiant de configuration | `roleInfectedWerewolfId`                                                                  |
| Code                         | `pdl`                                                                                     |
| Type                         | Loup-garou                                                                                |
| Description                  | Une fois par partie, le père des loups peut choisir d'infecter la cible des loups-garous. |

### Pyromane

|                              |                                                                                                               |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Identifiant de configuration | `rolePyromaniacId`                                                                                            |
| Code                         | `pyr`                                                                                                         |
| Type                         | Solo                                                                                                          |
| Description                  | Une fois par nuit, le pyromane peut choisir d'imbiber un joueur d'essence ou de brûler ceux qui le sont déjà. |

### Sorcière

|                              |                                                                                                                                                                                                            |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Identifiant de configuration | `roleWitchId`                                                                                                                                                                                              |
| Code                         | `sor`                                                                                                                                                                                                      |
| Type                         | Villageois                                                                                                                                                                                                 |
| Description                  | La sorcière possède deux potions par partie : une potion de vie et une potion de mort. La première permet de sauver la cible des loups-garous. La deuxième permet d'éliminer un autre joueur de son choix. |

### Villageois

|                              |                                                   |
| ---------------------------- | ------------------------------------------------- |
| Identifiant de configuration | `roleVillagerId`                                  |
| Code                         | `vil`                                             |
| Type                         | Villageois                                        |
| Description                  | Le villageois n'a aucune compétence particulière. |

### Voyante

|                              |                                                                                                                                                                |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Identifiant de configuration | `roleSeerId`                                                                                                                                                   |
| Code                         | `voy`                                                                                                                                                          |
| Type                         | Villageois                                                                                                                                                     |
| Description                  | Chaque nuit, la voyante peut observer le rôle d'un autre joueur. Les rôles `Amoureux`, `Envoûté`, `Imbibé d'essence` et `Infecté` ne lui sont pas communiqués. |
