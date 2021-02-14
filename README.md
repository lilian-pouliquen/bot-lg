# bot-lg <!-- omit in toc -->

## Table of content <!-- omit in toc -->

- [1. What is bot-lg](#1-what-is-bot-lg)
- [2. Prerequisite](#2-prerequisite)
  - [2.1. For local application run](#21-for-local-application-run)
  - [2.2. For Docker application run](#22-for-docker-application-run)
    - [2.2.1. Optionnal](#221-optionnal)
- [3. Install and start bot-lg](#3-install-and-start-bot-lg)
  - [3.1. Local application run](#31-local-application-run)
  - [3.2. Docker application run](#32-docker-application-run)
    - [3.2.1. Alternative for make users](#321-alternative-for-make-users)
- [4. Project structure](#4-project-structure)
- [5. Discord server requirements](#5-discord-server-requirements)
  - [5.1. Roles](#51-roles)
  - [5.2. Channels](#52-channels)
- [6. Bot commands](#6-bot-commands)
- [7. Authors](#7-authors)

## 1. What is bot-lg

bot-lg is a Discord bot giving access to helpful commands, making Game Master's life easier during a Werewolf game on Discord.  

***DISCLAIMER:*** Some commands and the messages sent by bot-lg are in French. I will work later on a translation support.

## 2. Prerequisite

1. [Create a Discord application](https://discord.com/developers/applications)
2. In the OAuth2 tab:
   1. Select the "bot" scope
   2. Select the following bot permissions:
      - Manage Roles
      - View Channels
      - Send Messages
      - Embed Links
      - Read Message History
      - Mention Everyone
      - Mute Members
      - Deafen Members
      - Move Members
3. Add your new bot to your Discord server using the generated link
4. Add the [Simple Poll bot](https://discord.com/developers/applications) to your Discord server

### 2.1. For local application run

- [Install Node.js v12.19.0](https://nodejs.org/en/download/releases/)

### 2.2. For Docker application run

- [Install Docker](https://docs.docker.com/engine/install/)

#### 2.2.1. Optionnal

If you are a make user, a Makefile is available!  
Intall the `make` command

## 3. Install and start bot-lg

### 3.1. Local application run

1. Clone or download bot-lg project from [github](https://github.com/lilian-pouliquen/bot-lg)
2. Create `config.json` using the `config.dist.json`
3. Open a command line inside of the "app" directory
4. Issue the following commands:
   1. `npm install --production`
   2. `npm install -g nodemon`
   3. `nodemon index.js`

### 3.2. Docker application run

1. Clone or download bot-lg project from [github](https://github.com/lilian-pouliquen/bot-lg)
2. Create `config.json` using the `config.dist.json`
3. Open a ***bash*** command line at the project root
4. Issue the following commands:
   1. `sudo docker image build --no-cache --tag bot-lg:node-prod --file Dockerfile` (only for the first start)
   2. `sudo docker run --detach --rm --name bot-lg --env NODE_ENV=production --volume $(PWD)/app/:/app/ npm install --production`
   3. `sudo docker run --detach --rm --name bot-lg --env NODE_ENV=production --volume "$(PWD)/app/:/app/" bot-lg:node-prod nodemon index.js`

#### 3.2.1. Alternative for make users

Instead of using docker commands, you can issue the following ones at the project root:

1. `make prepare` (only on the first time)
2. `make start`

You can see all other make rules using `make` or `make help`.

## 4. Project structure

``` text
bot-lg
+-- app                             : contains the bot-lg app
|   +-- commands                    : contains bot-lg commands
|   |   +-- *.js                    : all bot-lg commands
|   |   +-- cmd_config.dist.json    : configuration file template for the bot-lg commands. Contains the required role and channel ids
|   |
|   +-- config.dist.json            : configuration file template for the bot-lg app
|   +-- index.js                    : main file to run bot-lg
|   +-- package-lock.json           : node dependencies to be installed
|   +-- package.json                : node dependencies to be installed
|
+-- .dockerignore                   : elements to ignore by docker
+-- .gitignore                      : elements to ignore by git
+-- Dockerfile                      : "bot-lg" container image
+-- Makefile                        : all make rules available to manage "bot-lg" container
+-- README.md                       : project documentation
+-- logo.zip                        : bot-lg logo by Kévin BOURBASQUET
```

## 5. Discord server requirements

In this section you can find the required elements for you Discord server. In order to use bot-lg, you need to copy-paste `/app/commands/cmd_config.dist.json` as `/app/commands/cmd_config.json` and fill this file with the following required element ids.

### 5.1. Roles

Here is the list of the required role:

| Role ids             | Name            | Types                | Descriptions                                                                                                                                   |
| -------------------- | --------------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| idRoleAdmin          | Admin           | Moderator            | Administrator of the Discord server                                                                                                            |
| idRoleGameMaster     | Game Master     | Moderator            | Game Master.                                                                                                                                   |
| idRoleVillager       | Villager        | Villager             | Has no ability.                                                                                                                                |
| idRoleCupid          | Cupid           | Villager             | During the first night, chooses 2 lovers.                                                                                                      |
| idRoleLovers         | Lovers          | Additional           | Chosen by Cupid. If the 2 lovers are villagers, they win with the village. Else, they win in solo. If one of the lovers fall, so is the other. |
| idRoleGuard          | Guard           | Villager             | Once per night, protects someone from the werewolf attack, but cannot protect the same person twice in a row.                                  |
| idRoleWerewolf       | Werewolf        | Werewolf             | Once per night, votes to kill a villager .                                                                                                     |
| idRoleWhiteWerewolf  | White Werewolf  | Solo Werewolf        | Acts with the werewolf, but can kill one of his mates every other night.                                                                       |
| idRoleInfectWerewolf | Infect Werewolf | Werewolf             | Once per game, after the werewolves vote, chooses to infect the villager chosen by his mates, making him become a werewolf.                    |
| idRoleInfected       | Infected        | Additional, Werewolf | Chosen by Infect Werewolf. Becomes a werewolf, but keeps his original role. If inspected by Seer, the role shown is the original one.          |
| idRoleWitch          | Witch           | Villager             | Once per night, chooses to use a potion or not. Has 2 potions per game: one to resurrect the werewolves' victim, another to kill someone.      |
| idRoleSeer           | Seer            | Villager             | Once per night, can see someone's role.                                                                                                        |
| idRoleAssassin       | Assassin        | Solo                 | Once per night, can kill someone.                                                                                                              |
| idRolePyromaniac     | Pyromaniac      | Solo                 | Once per night, chooses to oil someone or to ignite those who were previously oiled                                                            |
| idRoleOiled          | Oiled           | Additional           | Chosen by Pyromaniac. Dies when Pyromaniac chooses to burn his victims.                                                                        |
| idRoleFlutist        | Flutist         | Solo                 | Once per night, can enchant 2 players who cannot attempt to kill their master and have to defend him.                                          |
| idRoleEnchanted      | Enchanted       | Additional           | Chosen by Flutist. Cannot attempt to kill Flutist, and have to defend him.                                                                     |
| idRoleReaper         | Reaper          | Villager             | Alive, acts as a villager. Dead, can talk to the other dead players and vote during the two daily vote following the player's death.           |
| idRoleAncient        | Ancient         | Villager             | Can survive to 1 werewolf attack. If the player dies during the daily vote, all villager-type players lose their abilities.                    |
| idRoleAngel          | Angel           | Solo, then Villager  | Has to die in the first daily vote. If it is a success, the game is over and the player wins. Else, he becomes a villager.                     |
| idRoleShaman         | Shaman          | Villager             | At night, can listen the dead players.                                                                                                         |
| idRoleHunter         | Hunter          | Villager             | When eliminated, the player can kill someone else.                                                                                             |
| idRoleDead           | Dead            | Dead Player          | When a player is eliminated, this role replaces the other one(s). Can talk to Shaman at night.                                                 |
| idRoleMuted          | Muted           | Additional           | Role given by the !nuit command to mute players.                                                                                               |

Types explaination:

- Moderator: Server and game manager. A player can be Admin, but not Game Master
- Villager: Wins when all threats (werewolves and solos) are eliminated.
- Werewolf: Wins when all villagers are eliminated and solos.
- Solo: Wins when all other players are eliminated.
- Dead Player: Players who have been eliminated.
- Additional: This role is added to the player roles. The player can use the abilities provided by his first role, and all his Additional roles.

### 5.2. Channels

Here is the list of the required channels:

| Channels ids            | Name        | Description                                                              |
| ----------------------- | ----------- | ------------------------------------------------------------------------ |
| idVocalChannelMain      | vocal       | Vocal channel use by the bot-lg to determine the Game Master and players |
| idTextChannelGameMaster | game-master | Text channel used by the Game Master (idRoleGameMaster)                  |
| idTextChannelWitch      | witch       | Text channel used by the !vote command in the "sor" case                 |
| idTextChannelPyromaniac | pyromaniac  | Text channel used by the !vote command in the "pyr" case                 |

## 6. Bot commands

Here is the list of the bot-lg commands:

| Commands    | Roles required to use commands | Descriptions                                             |
| ----------- | ------------------------------ | -------------------------------------------------------- |
| commandes   | None                           | Prints available commands                                |
| roles       | None                           | Prints still alive game roles                            |
| joueurs     | Game Master                    | Prints roles by player in the "game-master" text channel |
| assigner    | Game Master                    | Assigns the given role to the given players              |
| commencer   | Game Master                    | Assigns specified roles randomly to all the players      |
| reset       | Game Master                    | Remove all game roles from the players                   |
| nuit        | Game Master                    | Mutes all players                                        |
| jour        | Game Master                    | Unmutes all players                                      |
| poll        | Game Master                    | Prints a vote form with given question and choices       |
| vote        | Game Master                    | Prints the specified vote form with !poll                |
| timer       | Game Master                    | Runs a timer for n s/m/h (default 3m)                    |
| clear       | Admin                          | Clears the current text channel                          |
| deconnexion | Admin                          | Disconnects bot-lg from the Discord server               |

## 7. Authors

- Lilian POULIQUEN: Bot creation and development, documentation
- Léandre KERUZEC: Command ideas, Documentation review
- Kévin BOURBASQUET: bot-lg logo designer and creator
