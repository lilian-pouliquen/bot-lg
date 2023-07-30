# Command commencer

## Details

<!-- --8<-- [start:details] -->
Description: Randomly assign specified roles to all players.

Required role: `Game master`

Arguments:

* `assignations` (required): list of assignations

!!! Info
    Argument `assignations` require you to use code roles. You will find it on the page [Roles][link-roles-codes].
    
    If this argument is empty, print the help of the command in the current text channel.
<!-- --8<-- [end:details] -->

## Usage

<!-- --8<-- [start:usage] -->
Global usage (print help):

```text
/commencer
```

Global usage:

```text
/commencer assignations:<quota1><code1> <quota2><code2> [...]
```

To start a game with 2 `werewolves`, 1 `seer`, 1 `witch` et 1 `hunter`:

```text
/commencer assignations:2lg 1voy 1sor 1chas
```
<!-- --8<-- [end:usage] -->

[link-codes-roles]: ../../roles/index.md#role-codes
