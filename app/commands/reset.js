const cmdConfig = require("./cmd_config.json");
const http = require("http");
const querystring = require("querystring");
module.exports = {
    name: "reset",
    description: "Enlève les rôles de tous les joueurs",
    idRequiredRole: cmdConfig.idRoleGameMaster,
    execute(message, args) {
        let members = message.guild.channels.resolve(cmdConfig.idVocalChannelMain).members;
        let excludedRoles = [
            cmdConfig.idRoleAdmin,
            cmdConfig.idRoleGameMaster,
            cmdConfig.idRolesEveryone
        ];

        getAssignments(excludedRoles)
            .then(lstAssignements => {
                removeRoles(members, lstAssignements)
                    .then(() => {
                        cleardb()
                            .then(response => {
                                if (!response) {
                                    message.reply("une erreur s'est produite lors de la suppression en base de données.")
                                }
                            })
                            .catch(error => {
                                throw {
                                    error: error,
                                    message: "Commande reset - Suppression des données de la base de données."
                                }
                            });
                    })
                    .catch(error => {
                        throw {
                            error: error,
                            message: "Commande reset - Supprimer un rôle d'un joueur."
                        }
                    });
            })
            .catch(error => {
                throw {
                    error: error,
                    message: "Commande rest - Récupérer les assignations en base de données."
                }
            })
    }
};

function removeRoles(members, lstAssignements) {
    return new Promise((resolve, reject) => {
        lstAssignements.forEach(assignement => {
            members.get(assignement.idplayer).roles.remove(assignement.idrole).catch(error => reject(error));
            if (lstAssignements.length - 1 === lstAssignements.indexOf(assignement)) {
                resolve();
            }
        });
    });
}

function getAssignments(excludedRoles) {
    return new Promise((resolve, reject) => {
        let url = `http://php-api/services.php?service=getAssignements&${querystring.stringify(excludedRoles)}`;
        http.get(url, (res) => {
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
    });
}

function cleardb() {
    return new Promise((resolve, reject) => {
        const options = {
            protocol: 'http:',
            hostname: 'php-api',
            port: 80,
            path: `/services.php?service=clearGame`,
            method: 'DELETE'
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

        req.end();
    })
}