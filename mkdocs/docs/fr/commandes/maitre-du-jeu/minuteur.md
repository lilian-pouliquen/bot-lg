# Commande minuteur

## Détails

<!-- --8<-- [start:details] -->
Description : Démarre un minuteur pour le temps donné (défaut : 3 minutes).

Rôle requis : `Maître du jeu`

Paramètres :

- `temps` (facultatif) : valeur numérique du temps qui va être décompté
- `unite` (facultatif) : unité du temps qui va être décompté
<!-- --8<-- [end:details] -->

## Utilisation

<!-- --8<-- [start:utilisation] -->
Lancer un minuteur par défaut (3 minutes) :

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
<!-- --8<-- [end:utilisation] -->
