# Commande configurer

## Détails

<!-- --8<-- [start:details] -->
Description : Affiche la configuration de Bot-lg ou permet de changer sa langue.

Permissions requises : `Administrateur`

Sous-commandes :

- `afficher` : affiche la configuration de Bot-lg
- `langue` : configure la langue de Bot-lg (défaut : Français)

Paramètres de la sous-commande `langue` :

- `langue` (requis): la langue que Bot-lg doit adopter.

!!! Info
    Les langues maîtrisées par Bot-lg sont les suivantes :

    ```text
    - Français (fr)
    - Anglais (en)
    ```
<!-- --8<-- [end:details] -->

## Utilisation

<!-- --8<-- [start:utilisation] -->
Affichage de la configuration :

```text
/configurer afficher
```

Utilisation générique de la sous-commande `langue` :

```text
/configurer langue langue:<langue>
```

Configurer la langue en Anglais :

```text
/configurer langue langue:English
```
<!-- --8<-- [end:utilisation] -->
