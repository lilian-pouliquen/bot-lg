---
Document: "bot-lg documentation"
Author: "Lilian POULIQUEN"
---

# bot-lg documentation <!-- omit in toc -->

## Table of content <!-- omit in toc -->

- [1. What is bot-lg](#1-what-is-bot-lg)
- [2. Prerequisite](#2-prerequisite)
  - [2.1. For your Discord server](#21-for-your-discord-server)
  - [2.2. For Docker application run](#22-for-docker-application-run)
  - [2.3. Optionnal](#23-optionnal)
- [3. Install bot-lg](#3-install-bot-lg)
- [4. Finalise the install](#4-finalise-the-install)
  - [4.1. Classic initialisation](#41-classic-initialisation)
  - [4.2. Initialisation with the make command](#42-initialisation-with-the-make-command)
- [5. Start and stop bot-lg](#5-start-and-stop-bot-lg)
  - [5.1. Classic commands](#51-classic-commands)
  - [5.2. Make commands](#52-make-commands)
- [6. Project structure](#6-project-structure)
- [7. Discord server requirements](#7-discord-server-requirements)
  - [7.1. Roles](#71-roles)
  - [7.2. Channels](#72-channels)
- [8. Bot commands](#8-bot-commands)
- [9. Permissions](#9-permissions)
- [10. Authors](#10-authors)
- [11. Contributors](#11-contributors)

## 1. What is bot-lg

bot-lg is a Discord bot giving access to helpful commands, making Game Master's life easier during a Werewolf game on Discord.

***DISCLAIMER:*** Some commands and the messages sent by bot-lg are in French. I will work later on a translation support.

## 2. Prerequisite

### 2.1. For your Discord server

1. [Create a Discord application](https://discord.com/developers/applications)
1. In the OAuth2 tab:
    1. Select the "bot" scope
    1. Select the following bot permissions:
       - Manage Roles
       - Manage Channels
       - Read messages/View Channels
       - Send Messages
       - Manage Messages
       - Embed Links
       - Read Message History
       - Add Reactions
       - Use Slash Commands
       - Mute Members
1. Add your new bot to your Discord server using the generated link

Note: Please, be sure to keep your bot token to fill the app/config.json file later.

### 2.2. For Docker application run

- [Install Docker](https://docs.docker.com/engine/install/)
- [Install docker-compose](https://docs.docker.com/compose/install/)

### 2.3. Optionnal

If you are a make user, a Makefile is available!
Intall the `make` command.

## 3. Install bot-lg

1. Clone or download bot-lg project from [github](https://github.com/lilian-pouliquen/bot-lg)
1. Create the required configuration files in the project using the following \*.dist.\* files:
   - `.dist.env                             =>    .env`
   - `app/config.dist.json                  =>    app/config.json`
   - `app/commands/cmd_config.dist.json     =>    app/commands/cmd_config.json`

At this point, bot-lg is ready to start.

## 4. Finalise the install

In order to initialise and start bot-lg, you need to follow these steps:

### 4.1. Classic initialisation

1. Open a ***bash*** command line at the project root
1. Issue the following commands:
    1. `sudo docker image build --no-cache --tag node:botlg --file Dockerfile`
    1. `sudo docker-compose run botlg node:botlg pnpm install`
    1. `sudo docker-compose up --detach`

### 4.2. Initialisation with the make command

1. Open a ***bash*** command line at the project root
1. `make prepare start`

You can see all other make rules using `make` or `make help`.

## 5. Start and stop bot-lg

### 5.1. Classic commands

To start and stop bot-lg you can issue the following commands:

- Start bot-lg: `sudo docker-compose up --detach`
- Stop bot-lg: `sudo docker-compose down`

### 5.2. Make commands

To start and stop bot-lg you can use the available make rules:

- Start bot-lg: `make start`
- Stop bot-lg: `make stop`

## 6. Project structure

``` text
bot-lg
+-- app/                            : contains the bot-lg app
|   +-- commands/                   : contains bot-lg commands
|   |   +-- admin/                  : contains commands reserved to 'Admin' role
|   |   +-- everyone/               : contains commands reserved to 'Everyone' role
|   |   +-- game-master/            : contains commands reserved to 'Maître du jeu' role
|   |   +-- cmd_config.dist.json    : configuration file template for the bot-lg commands. Contains the required role and channel ids and the excluded role ids
|   |
|   +-- config.dist.json            : configuration file template for the bot-lg app
|   +-- index.js                    : main file to run bot-lg
|   +-- pnpm-lock.yaml              : node dependencies to be installed
|   +-- package.json                : node dependencies to be installed
|
+-- .dist.env                       : docker-compose environment variables file template
+-- .dockerignore                   : elements to ignore by docker
+-- .gitignore                      : elements to ignore by git
+-- docker-compose.yml              : docker-compose file
+-- Dockerfile                      : botlg container image
+-- Makefile                        : all make rules available to manage 'botlg' container
+-- README.md                       : project documentation
+-- logo.zip                        : bot-lg logo by Kévin BOURBASQUET
```

## 7. Discord server requirements

In this section you can find the required elements for you Discord server. In order to use bot-lg, you need to copy-paste `/app/commands/cmd_config.dist.json` as `/app/commands/cmd_config.json` and fill this file with the following required element ids.

### 7.1. Roles

Here is the list of the required role:

| Role ids             | Name            | Types                | Descriptions                                                                                                                                   |
| -------------------- | --------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| roleGameMasterId     | Game Master     | Moderator            | Game Master.                                                                                                                                   |
| roleVillagerId       | Villager        | Villager             | Has no ability.                                                                                                                                |
| roleCupidId          | Cupid           | Villager             | During the first night, chooses 2 lovers.                                                                                                      |
| roleLoversId         | Lovers          | Additional           | Chosen by Cupid. If the 2 lovers are villagers, they win with the village. Else, they win in solo. If one of the lovers fall, so is the other. |
| roleGuardId          | Guard           | Villager             | Once per night, protects someone from the werewolf attack, but cannot protect the same person twice in a row.                                  |
| roleWerewolfId       | Werewolf        | Werewolf             | Once per night, votes to kill a villager.                                                                                                      |
| roleWhiteWerewolfId  | White Werewolf  | Solo Werewolf        | Acts with the werewolf, but can kill one of his mates every other night.                                                                       |
| roleInfectedWerewolfId | Infected Werewolf | Werewolf             | Once per game, after the werewolves vote, chooses to infect the villager chosen by his mates, making him become a werewolf.                    |
| roleInfectedId       | Infected        | Additional, Werewolf | Chosen by Infected Werewolf. Becomes a werewolf, but keeps his original role. If inspected by Seer, the role shown is the original one.          |
| roleWitchId          | Witch           | Villager             | Once per night, chooses to use a potion or not. Has 2 potions per game: one to resurrect the werewolves' victim, another to kill someone.      |
| roleSeerId           | Seer            | Villager             | Once per night, can see someone's role.                                                                                                        |
| roleAssassinId       | Assassin        | Solo                 | Once per night, can kill someone.                                                                                                              |
| rolePyromaniacId     | Pyromaniac      | Solo                 | Once per night, chooses to oil someone or to ignite those who were previously oiled                                                            |
| roleOiledId          | Oiled           | Additional           | Chosen by Pyromaniac. Dies when Pyromaniac chooses to burn his victims.                                                                        |
| roleFlutistId        | Flutist         | Solo                 | Once per night, can enchant 2 players who cannot attempt to kill their master and have to defend him.                                          |
| roleEnchantedId      | Enchanted       | Additional           | Chosen by Flutist. Cannot attempt to kill Flutist, and have to defend him.                                                                     |
| roleReaperId         | Reaper          | Villager             | Alive, acts as a villager. Dead, can talk to the other dead players and vote during the two daily vote following the player's death.           |
| roleElderId        | Elder         | Villager             | Can survive to 1 werewolf attack. If the player dies during the daily vote, all villager-type players lose their abilities.                    |
| roleAngelId          | Angel           | Solo, then Villager  | Has to die in the first daily vote. If it is a success, the game is over and the player wins. Else, he becomes a villager.                     |
| roleShamanId         | Shaman          | Villager             | At night, can listen the dead players.                                                                                                         |
| roleHunterId         | Hunter          | Villager             | When eliminated, the player can kill someone else.                                                                                             |
| roleDeadId           | Dead            | Dead Player          | When a player is eliminated, this role replaces the other one(s). Can talk to Shaman at night.                                                 |
| roleMutedId          | Muted           | Additional           | Role given by the !nuit command to mute players.                                                                                               |

Types explaination:

- Moderator: Server and game manager. A player can be Admin, but not Game Master
- Villager: Wins when all threats (werewolves and solos) are eliminated.
- Werewolf: Wins when all villagers are eliminated and solos.
- Solo: Wins when all other players are eliminated.
- Dead Player: Players who have been eliminated.
- Additional: This role is added to the player roles. The player can use the abilities provided by his first role, and all his Additional roles.
- Default: Default Discord roles.

### 7.2. Channels

Here is the list of the required channels:

| Channels ids            | Name        | Description                                                              |
| ----------------------- | ----------- | ------------------------------------------------------------------------ |
| vocalChannelGameId      | vocal       | Vocal channel use by the bot-lg to determine the Game Master and players |
| textChannelGameMasterId | game-master | Text channel used by the Game Master (roleGameMasterId)                  |
| textChannelWitchId      | witch       | Text channel used by the !vote command in the "sor" case                 |
| textChannelPyromaniacId | pyromaniac  | Text channel used by the !vote command in the "pyr" case                 |

## 8. Bot commands

Here is the list of the bot-lg commands:

| Commands    | Roles required to use commands | Descriptions                                                                                               |
| ----------- | ------------------------------ | ---------------------------------------------------------------------------------------------------------- |
| `roles`     | None                           | Display still alive game roles. If the user is the Game Master, the list contains the members of each role |
| `assigner`  | Game Master                    | Assigns the given role to the given players                                                                |
| `commencer` | Game Master                    | Assigns specified roles randomly to all the players                                                        |
| `minuteur`  | Game Master                    | Runs a timer for the specified time (default 3m)                                                           |
| `soleil`    | Game Master                    | There are 2 subcommands: `se_couche` mutes all players and `se_leve` unmutes them                          |
| `terminer`  | Game Master                    | Remove all game roles from the players                                                                     |
| `vote`      | Game Master                    | Prints the specified vote form                                                                             |
| `nettoyer`  | Admin                          | Clears the current text channel                                                                            |

## 9. Permissions

See [permissions.md](./permissions.md) for more information about required permissions

## 10. Authors

- Lilian POULIQUEN: Bot creation and development, documentation

## 11. Contributors

- Léandre KERUZEC: Command ideas, Documentation review
- Kévin BOURBASQUET: bot-lg logo designer and creator
