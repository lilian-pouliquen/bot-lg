# Commandes de Bot-lg

## Introduction

Vous trouverez ici toutes les informations concernant les commandes de Bot-lg.

## Tableau des commandes disponibles

| Nom                           | Effet                                                                                                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`assigner`](#assigner)       | Assigne le rôle précisé aux joueurs spécifiés.                                                                                                                                       |
| [`commencer`](#commencer)     | Assigne aléatoirement les rôles donnés selon le quota attribué.                                                                                                                      |
| [`configurer`](#configurer)   | Affiche la configuration de Bot-lg ou permet de changer sa langue.                                                                                                                   |
| [`initialiser`](#initialiser) | Prépare le serveur Discord en ajoutant les rôles et salons nécessaire.                                                                                                               |
| [`minuteur`](#minuteur)       | Démarre un minuteur pour le temps donné (défaut : 3 minutes).                                                                                                                        |
| [`nettoyer`](#nettoyer)       | Efface tous les messages non épinglés du salon courant.                                                                                                                              |
| [`roles`](#roles)             | Si l'utilisateur a le rôle `Maître du jeu`, affiche dans le salon `maître-du-jeu` la liste des rôles et les joueurs ayant ces rôles. Sinon affiche la liste des rôles encore en jeu. |
| [`soleil`](#soleil)           | Permet de rendre muet les joueurs ou de leur rendre la parole.                                                                                                                       |
| [`terminer`](#terminer)       | Enlève tous les rôles des joueurs pour terminer la partie.                                                                                                                           |
| [`vote`](#vote)               | Affiche le vote spécifié.                                                                                                                                                            |

## Informations détaillées sur les commandes

### assigner

#### Détails

Description : Assigne le rôle précisé aux joueurs spécifiés.
Rôle requis : `Maître du jeu`
Paramètres :

- `role` (requis) : Le rôle à attribuer ;
- `utilisateur1` (requis) : le joueur à qui attribuer le rôle ;
- `utilisateur2` (facultatif) : au autre joueur à qui attribuer le rôle ;
- `utilisateur3` (facultatif) : un autre joueur à qui attribuer le rôle.

!!! Info
    Discord vous aide à compléter la commande, il vous suffit simplement de sélectionner les éléments dans la liste qui s'affiche au fur et à mesure que vous évrivez.

!!! Warning "Attention !"
    Les rôles assignables sont uniquement les rôles de type `Additionnel`. Vous trouverez les détails sur les rôles sur la page [Rôles](../roles/index.md).

#### Utilisation

Utilisation générique :

```text
/assigner role:<role> utilisateur1:<@utilisateur>
```

Pour assigner le rôle `Amoureux` à l'utilisateur `utilisateurTest` :

```text
/assigner role:Amoureux utilisateur1:@utilisateurTest
```

Pour assigner le rôle `Mort` aux utilisateurs `utilisateurTest` et `utilisatriceTest` :

```text
/assigner role:Mort utilisateur1:@utilisateurTest utilisateur2:@utilisatriceTest
```

### commencer

#### Détails

Description : Assigne aléatoirement les rôles donnés selon le quota attribué.
Rôle requis : `Maître du jeu`
Paramètres :

- `assignations` (facultatif) : la liste des assignations (ex : 2lg 3vil 1sor 1voy).

!!! Info
    Le paramètre `assignations` requiert l'utilisation des codes des rôles. Vous les trouverez dans la page [Rôles](../roles/index.md/#codes-des-rôles).
    Si ce paramètre n'est pas donné, une aide s'affiche dans le salon courant.

#### Utilisation

Utilisation générique (afficher l'aide de la commande) :

```text
/commencer
```

Utilisation générique :

```text
/commencer assignations:<quota1><code1> <quota2><code2> [...]
```

Pour commencer une partie avec 2 `loup-garou`, 1 `voyante`, 1 `sorcière` et 1 `chasseur` :

```text
/commencer assignations:1lg 1voy 1sor 1chas
```

### configurer

#### Détails

Description : Affiche la configuration de Bot-lg ou permet de changer sa langue.
Permissions requises : `Administrateur`
Sous-commandes :

- `afficher` : affiche la configuration de Bot-lg ;
- `langue` : configurer la langue de Bot-lg.

Paramètres de la sous-commande `langue` :

- `langue` (requis): la langue que Bot-lg doit adopter.

!!! Info
    Les langues maîtrisées par Bot-lg sont les suivantes :

    ```text
    - Français (fr)
    - Anglais (en)
    ```

#### Utilisation

Affichage de la configuration :

```text
/configurer afficher
```

Utilisation générique de la sous-commande `langue` :

```text
/configurer langue langue:<langue>
```

Configurer la langue en Anglais :

```Text
/configurer langue langue:English
```

### initialiser

#### Détails

Description : Prépare le serveur Discord en ajoutant les rôles et salons nécessaire.
Permissions requises : `Administrateur`

!!! Warning "Attention !"
    Bot-lg initialise le serveur en fonction de la langue configurée. Pensez à la configuer avec [`configurer langue`](#configurer) avant d'utiliser `initialiser`.

#### Utilisation

Initialiser le serveur :

```text
/initialiser
```

### minuteur

#### Détails

Description : Démarre un minuteur pour le temps donné (défaut : 3 minutes).
Rôle requis : `Maître du jeu`
Paramètres :

- `temps` (facultatif) : valeur numérique du temps qui va être décompté ;
- `unite` (facultatif) : unité du temps qui va être décompté.

#### Utilisation

Lancer un minuteur par défaut (pour 3 minutes) :

```text
/minuteur
```

Utilisation générique :

```text
/minuteur temps:<nombre> unite:<unite>
```

Lancer un minuteur pour 30 secondes :

```text
/minuteur temps:30 unite:secondes
```

### nettoyer

#### Détails

Description : Efface tous les messages non épinglés du salon courant.
Permissions requises : `Administrateur`

#### Utilisation

Effacer les messages non épinglés du salon courant :

```text
/nettoyer
```

### roles

#### Détails

Description : Si l'utilisateur a le rôle `Maître du jeu`, affiche dans le salon `maître-du-jeu` la liste des rôles et les joueurs ayant ces rôles. Sinon affiche la liste des rôles encore en jeu.
Rôle requis : `@everyone`

#### Utilisation

Afficher les rôles encore en jeu :

```text
/roles
```

### soleil

#### Détails

Description : Permet de rendre muet les joueurs ou de leur rendre la parole.
Rôle requis : `Maître du jeu`
Sous-commandes :

- `se_couche` : le soleil se couche : les joueurs sont rendus muets ;
- `se_leve` : le soleil se lève : les joueurs peuvent débattre.

#### Utilisation

Rendre les joueurs muets :

```text
/soleil se_couche
```

Rendre la parole aux joueurs :

```text
/soleil se_leve
```

### terminer

#### Détails

Description : Enlève tous les rôles des joueurs pour terminer la partie.
Rôle requis : `Maître du jeu`

!!! Info
    La commande `terminer` touche uniquement aux rôles de Bot-lg. Elle ne touche pas aux rôles du `Maître du jeu`.

#### Utilisation

Enlever les rôles des joueurs pour terminer la partie :

```text
/terminer
```

### vote

#### Détails

Description : Affiche le vote spécifié.
Rôle requis : `Maître du jeu`
Sous-commandes :

- `pyromane` : affiche le formulaire de vote du pyromane dans le salon `pyromane` ;
- `sorciere` : affiche le formulaire de vote de la sorcière dans le salon `sorcière` ;
- `village` : affiche le formulaire de vote du village dans le salon courant;

#### Utilisation

Afficher le vote du pyromane :

```text
/vote pyromane
```

Afficher le vote de la sorcière :

```text
/vote sorciere
```

Afficher le vote du village :

```text
/vote village
```
