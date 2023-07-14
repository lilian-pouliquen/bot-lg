# Commande assigner

## Détails

<!-- --8<-- [start:details] -->
Description : Assigne le rôle donné aux joueurs spécifiés.

Rôle requis : `Maître du jeu`

Paramètres :

- `role` (requis) : Le rôle à assigner ;
- `utilisateur1` (requis) : le joueur à qui assigner le rôle
- `utilisateur2` (facultatif) : au autre joueur à qui assigner le rôle
- `utilisateur3` (facultatif) : un autre joueur à qui assigner le rôle

!!! Info
    Discord vous aide à compléter la commande, il vous suffit simplement de sélectionner les éléments dans la liste qui s'affiche au fur et à mesure que vous évrivez.

!!! Warning "Attention !"
    Les rôles assignables sont uniquement les rôles de type `Additionnel`. Vous trouverez les détails sur les rôles sur la page [Rôles][lien-types-de-roles].
<!-- --8<-- [end:details] -->

## Utilisation

<!-- --8<-- [start:utilisation] -->
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
<!-- --8<-- [end:utilisation] -->

[lien-types-de-roles]: ../../roles/index.md#types-de-roles
