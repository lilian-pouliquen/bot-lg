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
  - [5.1. Channels](#51-channels)
  - [5.2. Roles](#52-roles)
- [6. Bot commands](#6-bot-commands)
- [7. Authors](#7-authors)

## 1. What is bot-lg

bot-lg is a Discord bot giving access to helpfull commands, making Game Master's life easier during a Werewolf game on Discord.  
  
***DISCLAIMER:*** All commands, channels and roles used by the bot-lg are in French.

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
   2. `node index.js`

### 3.2. Docker application run

1. Clone or download bot-lg project from [github](https://github.com/lilian-pouliquen/bot-lg)
2. Create `config.json` using the `config.dist.json`
3. Open a ***bash*** command line at the project root
4. Issue the following commands:
   1. `sudo docker image build --no-cache --tag node:prod --file Dockerfile` (only for the first start)
   2. `sudo docker run --detach --rm --name node_prod --env NODE_ENV=production --volume $(PWD)/app/:/app/`

#### 3.2.1. Alternative for make users

Instead of using docker commands, you can issue the following ones at the project root:

1. `make prepare` (only on the first start)
2. `make start`

You can see all other make rules using `make` or `make help`.

## 4. Project structure

``` no-language
bot-lg
+-- app                         : contains the bot-lg app
|   +-- commands                : contains bot-lg commands
|   +-- config.dist.json        : configuration file template for the bot-lg app
|   +-- index.js                : main file to run bot-lg
|   +-- package-lock.json       : node dependencies to be installed
|   +-- package.json            : node dependencies to be installed
|
+-- .dockerignore               : elements to ignore by docker
+-- .gitignore                  : elements to ignore by git
+-- Dockerfile                  : "node_prod" container image
+-- Makefile                    : all rule to available by using make command
+-- README.md                   : project documentation
```

## 5. Discord server requirements

In this section you can find the elements that you need to have in your Discord server.

### 5.1. Channels

Here is the list of the required channels:

| Channels        | Description                                                              |
| --------------- | ------------------------------------------------------------------------ |
| "Salon vocal"   | Vocal channel use by the bot-lg to determine the Game Master and players |
| "maitre-du-jeu" | Text channel used by the Game Master (role "Maître du jeu")              |
| "sorcière"      | Text channel used by the !vote command                                   |
| "pyromane"      | Text channel used by the !vote command                                   |

### 5.2. Roles

Here is the list of the required roles:

| Roles               | Types               | Descriptions                                                                                                                               |
| ------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| "Admin"             | Moderator           | Administrator of the Discord server                                                                                                        |
| "Maître du jeu"     | Moderator           | Game Master.                                                                                                                               |
| "Villageois"        | Villager            | Has no ability.                                                                                                                            |
| "Cupidon"           | Villager            | During the first night, chooses 2 lovers: if one die, the other follow the first in the death.                                             |
| "Amoureux"          | Additional          | Chosen by "Cupidon". If the 2 lovers are villagers, they win with the village. Else, they win in solo.                                     |
| "Gardien"           | Villager            | Once per night, protects someone from the werewolves attack, but cannot protect the same person twice in a row.                            |
| "Loups-garous"      | Werewolf            | Once per night, votes to kill a villager .                                                                                                 |
| "Loup Blanc"        | Solo Werewolf       | Acts with the werewolf, but can kill one every other day.                                                                                  |
| "Père des loups"    | Werewolf            | Once per game, after the werewolves vote, choose to infect the villager choosen by his mates, making him become a werewolf.                |
| "Infecté"           | Werewolf            | Chosen by "Père des loups". Become a werewolf, but keeps his original role. If inspected by "Voyante", the role shown is the original one. |
| "Sorcière"          | Villager            | Once per night, chooses to use a potion or not. Has 2 potions per game: one to resurrect the werewolves' victim, another to kill someone.  |
| "Voyante"           | Villager            | Once per night, can see someone role.                                                                                                      |
| "Assassin"          | Solo                | Once per night, can kill someone.                                                                                                          |
| "Pyromane"          | Solo                | Once per night, chooses to oil someone or ignite those who were previously oiled                                                           |
| "Aspergé d'essence" | Additional          | Chosen by "Pyromane". Dies when "Pyromane" choose to burn his victims.                                                                     |
| "Joueur de flûte"   | Solo                | Once per night, can enchant 2 players who cannot attempt to kill their master and have to defend him.                                      |
| "Envouté"           | Additional          | Chosen by "Joueur de flûte". Cannot attempt to kill  "Joueur de flûte", and have to defend him.                                            |
| "Ankou"             | Villager            | Alive, acts as a villager. Dead, can talk to the other dead players and vote until the second day after the player's death.                |
| "Ancien"            | Villager            | Can survive to 1 werewolves attack. If the player dies during the daily vote, all villagers lose their abilities.                          |
| "Ange"              | Solo, then Villager | Have to die in the first daily vote. If it is a success, the game is over and the player wins. Else, he becomes a villager.                |
| "Chaman"            | Villager            | At night, can listen the dead players.                                                                                                     |
| "Chasseur"          | Villager            | When eliminated, the player can kill someone else.                                                                                         |
| "Mort"              | Dead Player         | When a player is eliminated, his role becomes "Mort". Can talk to "Chaman" at night,                                                       |
| "Muted"             | Additional          | Role given by the !nuit command to mute players.                                                                                           |

Types explaination:

- Moderator: Server and game manager. A player can be "Admin", but not "Maître du jeu"
- Villager: Wins when all threats (werewolves and solos) are eliminated.
- Werewolf: Wins when all villagers are eliminated.
- Dead Player: Players who have been eliminated.
- Additional: This role is added to the player roles. The player can use the abilities provided by his first role, and all his Additional roles.

## 6. Bot commands

Here is the list of the bot-lg commands:

| Commands    | Roles required to use commands | Descriptions                                               |
| ----------- | ------------------------------ | ---------------------------------------------------------- |
| commandes   | None                           | Prints available commands                                  |
| roles       | None                           | Prints still living game roles                             |
| joueurs     | "Maître du jeu"                | Prints roles by player in the "maitre-du-jeu" text channel |
| assigner    | "Maître du jeu"                | Assigns the given role to the given player                 |
| commencer   | "Maître du jeu"                | Assigns specified roles randomly to all the players        |
| reset       | "Maître du jeu"                | Remove all game roles from the players                     |
| nuit        | "Maître du jeu"                | Mutes all players                                          |
| jour        | "Maître du jeu"                | Unmutes all players                                        |
| vote        | "Maître du jeu"                | Prints the specified vote form with /poll                  |
| timer       | "Maître du jeu"                | Runs a timer for n s/m/h (default 3m)                      |
| clear       | "Admin"                        | Clears the current text channel                            |
| deconnexion | "Admin"                        | Disconnects bot-lg from the Discord server                 |

## 7. Authors

- Lilian POULIQUEN: Bot creation and development
