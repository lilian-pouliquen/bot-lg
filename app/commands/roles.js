const cmdConfig = require("./cmd_config.json");
const http = require("http");
const querystring = require("querystring");
module.exports = {
    name: "roles",
    description: "Affiche les rôles encore en jeu",
    idRequiredRole: "None",
    execute(message, args) {
        let guildRoles = message.channel.guild.roles
        let lstExcludedRoles = [
            cmdConfig.idRoleAdmin,
            cmdConfig.idRoleGameMaster,
            cmdConfig.idRoleLovers,
            cmdConfig.idRoleInfected,
            cmdConfig.idRoleOiled,
            cmdConfig.idRoleEnchanted,
            cmdConfig.idRoleDead,
            cmdConfig.idRoleMuted,
            cmdConfig.idRoleEveryone
        ];

        getCountByAssignedRoles(lstExcludedRoles)
            .then(lstCountAssignements => {
                if (0 === lstCountAssignements.length) {
                    message.reply("il n'y a plus de rôle en jeu :sweat_smile:");
                } else {
                    let msg = "voici les roles encore en jeu :\n";
                    lstCountAssignements.forEach(countAssignement => {
                        msg += `> - ${guildRoles.resolve(countAssignement.idrole).name} : ${countAssignement.nbassigned}`;
                        if (lstCountAssignements.length - 1 === lstCountAssignements.indexOf(countAssignement)) {
                            message.reply(msg);
                        }
                    });
                }
            })
            .catch(error => {
                throw {
                    error: error,
                    message: "Commande roles - Récupérer le compte des rôles assignés en base de données."
                }
            });
    }
}

function getCountByAssignedRoles(lstExcludedRoles) {
    return new Promise((resolve, reject) => {
        let url = `http://php-api/services.php?service=getCountByAssignedRoles&${querystring.stringify(lstExcludedRoles)}`;
        http.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(data));
            });

        }).on("error", (error) => {
            reject(error)
        });
    });
}