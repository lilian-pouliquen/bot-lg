# Bot-lg documentation <!-- omit in toc -->

## Table of content <!-- omit in toc -->

* [1. What is Bot-lg](#1-what-is-bot-lg)
* [2. Prerequisite](#2-prerequisite)
  * [2.1. For your Discord server](#21-for-your-discord-server)
  * [2.2. For Docker application run](#22-for-docker-application-run)
  * [2.3. Optionnal](#23-optionnal)
* [3. Install Bot-lg](#3-install-bot-lg)
* [4. Finalise the install](#4-finalise-the-install)
  * [4.1. Classic initialisation](#41-classic-initialisation)
  * [4.2. Initialisation with the make command](#42-initialisation-with-the-make-command)
* [5. Start and stop Bot-lg](#5-start-and-stop-bot-lg)
  * [5.1. Classic commands](#51-classic-commands)
  * [5.2. Make commands](#52-make-commands)
* [6. Project structure](#6-project-structure)
* [7. Discord server requirements](#7-discord-server-requirements)
  * [7.1. Roles](#71-roles)
  * [7.2. Channels](#72-channels)
* [8. Bot commands](#8-bot-commands)
* [9. Permissions](#9-permissions)
* [10. Authors](#10-authors)
* [11. Contributors](#11-contributors)

## 1. What is Bot-lg

Bot-lg is a Discord bot giving access to helpful commands, making Game master's life easier during a Werewolf game on Discord.

***DISCLAIMER:*** Commands, choice options and descriptions are in French. I will search for a way to translate them according to the locale set.

## 2. Prerequisite

### 2.1. For your Discord server

1. [Create a Discord application](https://discord.com/developers/applications)
2. In the OAuth2 tab:
   1. Select the "bot" scope
   2. Select the permissions listed in [permissions.md](./permissions.md)
3. Add your new bot to your Discord server using the generated link

Note: Please, make sure to keep your bot token to fill the app/config.json file later.

### 2.2. For Docker application run

* [Install Docker](https://docs.docker.com/engine/install/)
* [Install docker-compose](https://docs.docker.com/compose/install/)

### 2.3. Optionnal

If you are a make user, a Makefile is available!
Intall the `make` command.

## 3. Install Bot-lg

1. Clone or download Bot-lg project from [github](https://github.com/lilian-pouliquen/bot-lg)
2. Create the required configuration files in the project using the following `*.dist.*` files:

| Template file             | Final file           |
| ------------------------- | -------------------- |
| `.dist.env`               | `.env`               |
| `app/config.dist.json`    | `app/config.json`    |
| `docker/mongodb.dist.env` | `docker/mongodb.env` |

At this point, Bot-lg is ready to start.

## 4. Finalise the install

In order to initialise and start Bot-lg, you need to follow these steps:

### 4.1. Classic initialisation

1. Open a ***bash*** command line at the project root
2. Issue the following commands:
   1. `sudo docker image build --no-cache --tag node:botlg --file Dockerfile`
   2. `sudo docker-compose run botlg pnpm install`
   3. `sudo docker-compose up --detach`

### 4.2. Initialisation with the make command

1. Open a ***bash*** command line at the project root
2. `make prepare start`

You can see all other make rules using `make` or `make help`.

## 5. Start and stop Bot-lg

### 5.1. Classic commands

To start and stop Bot-lg you can issue the following commands:

* Start Bot-lg: `sudo docker-compose up --detach`
* Stop Bot-lg: `sudo docker-compose down`

### 5.2. Make commands

To start and stop Bot-lg you can use the available make rules:

* Start Bot-lg: `make start`
* Stop Bot-lg: `make stop`

## 6. Project structure

``` text
bot-lg
+-- app/                            : contains the Bot-lg app
|   +-- commands/                   : contains Bot-lg commands
|   |   +-- admin/                  : contains commands reserved to 'Admin' role
|   |   +-- everyone/               : contains commands reserved to 'Everyone' role
|   |   +-- game-master/            : contains commands reserved to 'Maître du jeu' role
|   |
|   +-- functions/                  : custom modules
|   |   +-- index.js                : main file which exports the custom modules
|   |
|   +-- localisation/               : contains Bot-lg localisation files
|   |   +-- index.js                : main file for the module to be exported
|   |   +-- *.json                  : translation files
|   |
|   +-- logs/                       : log files for all Discord servers the application is member of
|   |   +-- .gitignore              : elements ignored by git in logs directory
|   |
|   +-- .gitignore                  : elements ignored by git in the app directory
|   +-- config.dist.json            : configuration file template for the Bot-lg app
|   +-- delete-commands.js          : script to delete commands on the server configured in config.json
|   +-- deploy-commands.js          : script to deploy commands only on the server configured in config.json or on all the servers
|   +-- index.js                    : main file to run Bot-lg
|   +-- package.json                : node dependencies to be installed
|   +-- pnpm-lock.yaml              : node dependencies to be installed
|
+-- docker/
|   +-- .dockerignore               : elements to ignore by docker
|   +-- .gitignore                  : elements to ignore by git
|   +-- Dockerfile                  : Botlg development image build file
|   +-- mongodb.dist.env            : environment variables template file for MongoDB container
|
+-- mkdocs/                         : Bot-lg MkDocs directory
|   +-- build/                      : MkDocs build directory
|   |   +-- en/                     : MkDocs build files for the English part of the website
|   |   +-- fr/                     : MkDocs build files for the French part of the website
|   |   +-- robots.txt              : File to avoid being shown on search engines
|   |
|   +-- common/                     : Files shared between all parts of the website
|   +-- config/                     : MkDocs configurations
|   +-- docs/                       : Bot-lg documentation to be built for the website
|
+-- .dist.env                       : docker-compose environment variables file template
+-- .dockerignore                   : elements to ignore by docker
+-- .gitignore                      : elements to ignore by git
+-- botlg-app.Dockerfile            : Botlg App production image build file
+-- botlg-web.Dockerfile            : Botlg Web production image build file
+-- docker-compose.yml              : docker-compose file
+-- logo.zip                        : Bot-lg logo by Kévin BOURBASQUET
+-- Makefile                        : all make rules available to manage 'botlg' container
+-- permissions.md                  : list of permissions needed by the application
+-- README.md                       : project documentation
```

## 7. Discord server requirements

In this section you can find the required elements for you Discord server.

Before initialising you server, choose a language with the `configuerer langue` command. Then, with the command `initialiser`, Bot-lg will create all the required channels and roles with the correct permissions for you and save them in its database.

### 7.1. Roles

Here is the list of the roles Bot-lg will create and manage:

| Role ids               | Name              | Types                | Descriptions                                                                                                                                   |
| ---------------------- | ----------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| roleAngelId            | Angel             | Solo, then Villager  | Has to die in the first daily vote. If it is a success, the game is over and the player wins. Else, they become a villager.                    |
| roleAssassinId         | Assassin          | Solo                 | Once per night, can kill someone.                                                                                                              |
| roleCupidId            | Cupid             | Villager             | During the first night, chooses 2 lovers.                                                                                                      |
| roleDeadId             | Dead              | Dead Player          | When a player is eliminated, this role replaces the other one(s). Can talk to Shaman at night.                                                 |
| roleElderId            | Elder             | Villager             | Can survive to 1 werewolf attack. If the player dies during the daily vote, all villager-type players lose their abilities.                    |
| roleEnchantedId        | Enchanted         | Additional           | Chosen by Flutist. Cannot attempt to kill Flutist and have to defend them.                                                                     |
| roleFlutistId          | Flutist           | Solo                 | Once per night, can enchant 2 players who cannot attempt to kill their master and have to defend them.                                         |
| roleGameMasterId       | Game master       | Moderator            | Game Master.                                                                                                                                   |
| roleGuardId            | Guard             | Villager             | Once per night, protects someone from the werewolves attack, but cannot protect the same person twice in a row.                                |
| roleHunterId           | Hunter            | Villager             | When eliminated, the player can kill someone else.                                                                                             |
| roleInfectedId         | Infected          | Additional, Werewolf | Chosen by Infected werewolf. Becomes a werewolf, but keeps his original role. If inspected by Seer, the role shown is the original one.        |
| roleInfectedWerewolfId | Infected werewolf | Werewolf             | Once per game, after the werewolves vote, chooses to infect the villager chosen by his mates, making them become a werewolf.                   |
| roleLoversId           | Lovers            | Additional           | Chosen by Cupid. If the 2 lovers are villagers, they win with the village. Else, they win in solo. If one of the lovers fall, so is the other. |
| roleMutedId            | Muted             | Additional           | Role given by Game Master to mute players.                                                                                                     |
| roleOiledId            | Oiled             | Additional           | Chosen by Pyromaniac. Dies when Pyromaniac chooses to burn his victims.                                                                        |
| rolePyromaniacId       | Pyromaniac        | Solo                 | Once per night, chooses to oil someone or to ignite those who were previously oiled.                                                           |
| roleReaperId           | Reaper            | Villager             | Alive, acts as a villager. Dead, can talk to the other dead players and vote during the two daily vote following the player's death.           |
| roleSeerId             | Seer              | Villager             | Once per night, can see someone's role.                                                                                                        |
| roleShamanId           | Shaman            | Villager             | At night, can listen the dead players.                                                                                                         |
| roleVillagerId         | Villager          | Villager             | Has no ability.                                                                                                                                |
| roleWerewolfId         | Werewolf          | Werewolf             | Once per night, votes to kill a villager.                                                                                                      |
| roleWhiteWerewolfId    | White werewolf    | Solo Werewolf        | Acts with the werewolves, but can kill one of their mates every other night.                                                                   |
| roleWitchId            | Witch             | Villager             | Once per night, chooses to use a potion or not. Has 2 potions per game: one to resurrect the werewolves' victim, another to kill someone.      |

Types explaination:

* Additional: This role is added to the player roles. The player can use the abilities provided by their first role and all their additional roles.
* Dead Player: Players who have been eliminated.
* Moderator: Game manager. A player cannot be Game Master
* Solo: Wins when all other players are eliminated.
* Villager: Wins when all threats (werewolves and solos) are eliminated.
* Werewolf: Wins when all villagers and solos are eliminated.

### 7.2. Channels

Here is the list of the channels Bot-lg will create and manage:

| Channels ids                  | Name              | Description                                                                          |
| ----------------------------- | ----------------- | ------------------------------------------------------------------------------------ |
| textChannelAngelId            | angel             | Text channel used by role Angel.                                                     |
| textChannelAssassinId         | assassin          | Text channel used by role Assassin.                                                  |
| textChannelCupidId            | cupid             | Text channel used by role Cupid.                                                     |
| textChannelDeadId             | dead              | Text channel used by role Dead. Shaman can read it but not send messages.            |
| textChannelElderId            | elder             | Text channel used by role Elder.                                                     |
| textChannelEnchantedId        | enchanted         | Text channel used by role Enchanted.                                                 |
| textChannelFlutistId          | flutist           | Text channel used by role Flutist.                                                   |
| textChannelGameMasterId       | game-master       | Text channel used by the role Game master.                                           |
| textChannelGuardId            | guard             | Text channel used by role Guard.                                                     |
| textChannelHunterId           | hunter            | Text channel used by role Hunter.                                                    |
| textChannelInfectedId         | infected          | Text channel used by role Infected.                                                  |
| textChannelInfectedWerewolfId | infected-werewolf | Text channel used by role Infected werewolf.                                         |
| textChannelLoversId           | lovers            | Text channel used by role Lovers.                                                    |
| textChannelOiledId            | oiled             | Text channel used by role Oiled.                                                     |
| textChannelPyromaniacId       | pyromaniac        | Text channel used by role Pyromaniac.                                                |
| textChannelReaperId           | reaper            | Text channel used by role Reaper.                                                    |
| textChannelSeerId             | seer              | Text channel used by role Seer.                                                      |
| textChannelShamanId           | shaman            | Text channel used by role Shaman.                                                    |
| textChannelVillageId          | village           | Text channel used to discuss to eliminate a player on the day phase of the game.     |
| textChannelVillagerId         | villager          | Text channel used by role Villager.                                                  |
| textChannelWerewolfId         | werevolf          | Text channel used by roles Werewolf, White werewolf, Infected werewolf and Infected. |
| textChannelWhiteWerewolfId    | white-werewolf    | Text channel used by role Whitewerewolf.                                             |
| textChannelWitchId            | witch             | Text channel used by role Witch.                                                     |
| voiceChannelGameId            | Village square    | Vocal channel use by the Bot-lg to fetch the players.                                |

## 8. Bot commands

Here is the list of Bot-lg's commands:

| Commands      | Roles required to use commands | Descriptions                                                                                                         |
| ------------- | ------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `roles`       | None                           | Display still alive game roles. If the user is the Game Master, the list contains the members of each role           |
| `assigner`    | Game Master                    | Assigns the given role to the given players                                                                          |
| `commencer`   | Game Master                    | Assigns specified roles randomly to all the players                                                                  |
| `minuteur`    | Game Master                    | Runs a timer for the specified time (default 3m)                                                                     |
| `soleil`      | Game Master                    | There are 2 subcommands: `se_couche` mutes all players and `se_leve` unmutes them                                    |
| `terminer`    | Game Master                    | Remove all game roles from the players                                                                               |
| `vote`        | Game Master                    | Prints the specified vote form                                                                                       |
| `configurer`  | Administrator                  | Prints the current configuration or edits it depending on the chosen subcommand                                      |
| `initialiser` | Administrator                  | Prepare the server to play Werewolf by creating roles and channel and adding them to the configuration of the server |
| `nettoyer`    | Administrator                  | Clears the current text channel                                                                                      |

## 9. Permissions

See [permissions.md](./permissions.md) for more information about required permissions

## 10. Authors

* Lilian POULIQUEN: Bot creation and development, documentation

## 11. Contributors

* Léandre KERUZEC: Command ideas, Documentation review
* Kévin BOURBASQUET: Bot-lg logo designer and creator
