# Command assigner

## Important

Language of commands name and description, arguments name and description and options name and description are in ***French*** for now.

This command uses arguments with declared choices which are not translated. Here is the meaning of each choice:

| Choice   | Translation |
| -------- | ----------- |
| Amoureux | Lovers      |
| Envouté  | Enchanted   |
| Imbibé   | Oiled       |
| Infecté  | Infected    |
| Mort     | Dead        |

## Details

<!-- --8<-- [start:details] -->
Description: Assign the given role to the given player(s).

Required role: `Game master`

Arguments:

* `role` (required): the role to assign ;
* `utilisateur1` (required): the target player
* `utilisateur2` (optional): another target player
* `utilisateur3` (optional): another target player

!!! Info
    Discord helps you to complete commands when you are typing it, you just need to select the wanted elements in the showed list while you are writing it.

!!! Warning "Warning !"
    Assignable roles are only `Additional` or `Dead` type roles. You will find more details about roles in the [Roles][link-roles-types] page.
<!-- --8<-- [end:details] -->

## Usage

<!-- --8<-- [start:usage] -->
Global usage:

```text
/assigner role:<role> utilisateur1:<@user>
```

To assign the role `Dead` to  the user `testUser`:

```text
/assigner role:Mort utilisateur1:@testUser
```

To assign the role `Lovers` to users `testUser` et `testPlayer`:

```text
/assigner role:Amoureux utilisateur1:@testUser utilisateur2:@testPlayer
```
<!-- --8<-- [end:usage] -->

[link-roles-types]: ../../roles/index.md#role-types
