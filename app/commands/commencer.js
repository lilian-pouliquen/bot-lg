const cmdConfig = require("./cmd_config.json");
const http = require('http');
const querystring = require('querystring');
module.exports = {
    name: "commencer",
    description: "Assigne les rôles spécifiés aux joueurs",
    idRequiredRole: cmdConfig.idRoleGameMaster,
    execute(message, args) {
        let lstPlayers = message.guild.channels.resolve(cmdConfig.idVocalChannelMain).members;

        let buildLstRoleByPlayer = new Promise((resolve, reject) => {
            let lstRolesByPlayer = [];
            lstPlayers.forEach(player => {
                let lstIdRoles = [];
                player.roles.cache.forEach(role => {
                    lstIdRoles.push(role.id);
                    if (player.roles.cache.size === lstIdRoles.length) {
                        lstRolesByPlayer.push({ idPlayer: player.id, lstIdRoles: lstIdRoles });
                    }
                    if (lstPlayers.size === lstRolesByPlayer.length) {
                        resolve(lstRolesByPlayer);
                    }
                });
            });
        });

        let buildAssignements = new Promise((resolve, reject) => {
            let actualPlayers = message.guild.channels.resolve(cmdConfig.idVocalChannelMain).members.filter(member => !member.roles.cache.has(cmdConfig.idRoleGameMaster));
            let lstPlayersToAssign = actualPlayers;
            let roles = getMapRoles(message.guild.roles);
            let lstAssignements = [];

            args.forEach(argument => {
                let number = argument.substr(0, 1);
                let strRoleToAssign = argument.substr(1);
                let roleToAssign = roles.get(strRoleToAssign);

                for (index = 0; index < number; index++) {
                    let playerToAssign = lstPlayersToAssign.random(1)[0];
                    playerToAssign.roles.add(roleToAssign)
                        .then(playerAssigned => {
                            let assignement = { idPlayer: playerAssigned.id, idRole: roleToAssign.id };
                            lstAssignements.push(assignement);

                            lstPlayersToAssign.delete(playerToAssign.id);
                        })
                        .catch(error => reject(error));
                    if (0 === lstPlayersToAssign.size) {
                        resolve(lstAssignements);
                    }
                }
            });
        });

        buildLstRoleByPlayer.then(lstRolesByPlayer => {
            apiPost("initdb", lstRolesByPlayer).then(response => {
                if (response) {
                    buildAssignements
                        .then(lstAssignements => {
                            apiPost("assignRoles", lstAssignements)
                                .then(response => {
                                    if (!response) {
                                        message.reply("une erreur s'est produite lors de l'assignation des rôles en base de données :sweat_smile:");
                                    }
                                })
                                .catch(error => {
                                    throw {
                                        error: error,
                                        message: "Commande commencer - Insérer des assignations en base de donnée."
                                    }
                                });
                        })
                        .catch(error => {
                            throw {
                                error: error,
                                message: "Commande commencer - Construction de la liste des assignations."
                            }
                        });
                } else {
                    message.reply("une erreur s'est produite lors de l'initialisation de la base de données :sweat_smile:");
                }
            });
        })
    }
}

function getMapRoles(guildRoles) {
    let roles = new Map();
    roles.set("vil", guildRoles.resolve(cmdConfig.idRoleVillager));
    roles.set("cup", guildRoles.resolve(cmdConfig.idRoleCupid));
    roles.set("gar", guildRoles.resolve(cmdConfig.idRoleGuard));
    roles.set("lg", guildRoles.resolve(cmdConfig.idRoleWerewolf));
    roles.set("lgb", guildRoles.resolve(cmdConfig.idRoleWhiteWerewolf));
    roles.set("plg", guildRoles.resolve(cmdConfig.idRoleInfectWerewolf));
    roles.set("sor", guildRoles.resolve(cmdConfig.idRoleWitch));
    roles.set("voy", guildRoles.resolve(cmdConfig.idRoleSeer));
    roles.set("ass", guildRoles.resolve(cmdConfig.idRoleAssassin));
    roles.set("pyr", guildRoles.resolve(cmdConfig.idRolePyromaniac));
    roles.set("jdf", guildRoles.resolve(cmdConfig.idRoleFlutist));
    roles.set("ank", guildRoles.resolve(cmdConfig.idRoleReaper));
    roles.set("anc", guildRoles.resolve(cmdConfig.idRoleAncient));
    roles.set("ang", guildRoles.resolve(cmdConfig.idRoleAngel));
    roles.set("cham", guildRoles.resolve(cmdConfig.idRoleShaman));
    roles.set("chass", guildRoles.resolve(cmdConfig.idRoleHunter));
    return roles;
}

function apiPost(service, object) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(object);
        const options = {
            protocol: 'http:',
            hostname: 'php-api',
            port: 80,
            path: `/services.php?service=${service}`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(data));
            });

        }).on("error", (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
}
