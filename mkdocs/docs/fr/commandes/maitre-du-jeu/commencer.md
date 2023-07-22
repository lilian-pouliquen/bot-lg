# Commande commencer

## Détails

<!-- --8<-- [start:details] -->
Description : Assigne aléatoirement les rôles donnés selon le quota attribué.

Rôle requis : `Maître du jeu`

Paramètres :

* `assignations` (facultatif) : la liste des assignations

!!! Info
    Le paramètre `assignations` requiert l'utilisation des codes des rôles. Vous les trouverez dans la page [Rôles][lien-codes-des-roles].
    Si ce paramètre n'est pas donné, une aide s'affiche dans le salon courant.
<!-- --8<-- [end:details] -->

## Utilisation

<!-- --8<-- [start:utilisation] -->
Utilisation générique (afficher l'aide de la commande) :

```text
/commencer
```

Utilisation générique :

```text
/commencer assignations:<quota1><code1> <quota2><code2> [...]
```

Pour commencer une partie avec 2 `loups-garous`, 1 `voyante`, 1 `sorcière` et 1 `chasseur` :

```text
/commencer assignations:1lg 1voy 1sor 1chas
```
<!-- --8<-- [end:utilisation] -->

[lien-codes-des-roles]: ../../roles/index.md#codes-des-roles
