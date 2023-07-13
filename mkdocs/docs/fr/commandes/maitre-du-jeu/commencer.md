# Commande commencer

## Détails

Description : Assigne aléatoirement les rôles donnés selon le quota attribué.
Rôle requis : `Maître du jeu`
Paramètres :

- `assignations` (facultatif) : la liste des assignations (ex : 2lg 3vil 1sor 1voy).

!!! Info
    Le paramètre `assignations` requiert l'utilisation des codes des rôles. Vous les trouverez dans la page [Rôles](../../roles/index.md/#codes-des-rôles).
    Si ce paramètre n'est pas donné, une aide s'affiche dans le salon courant.

## Utilisation

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
