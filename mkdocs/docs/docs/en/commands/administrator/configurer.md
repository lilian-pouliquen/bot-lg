# Command configurer

## Details

<!-- --8<-- [start:details] -->
Description: Prints Bot-lg's configuration or change its language.

Required permissions: `Administrator`

Sub-commands:

* `afficher`: print Bot-lg's configuration
* `langue`: configure Bot-lg's (default: French)

Argument of the sub-command `langue`:

* `langue` (required): language to use.

!!! Info
    Bot-lg's known languages are:

    ```text
    - French (fr)
    - English (en)
    ```
<!-- --8<-- [end:details] -->

## Usage

<!-- --8<-- [start:usage] -->
Print configuration:

```text
/configurer afficher
```

Global usage of sub-command `langue`:

```text
/configurer langue langue:<language>
```

Configure Bot-lg to speak English:

```text
/configurer langue langue:English
```
<!-- --8<-- [end:usage] -->
