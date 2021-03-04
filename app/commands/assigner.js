const cmdConfig = require("./cmd_config.json");
const http = require("http");
module.exports = {
    name: "assigner",
    description: "Assigne le rôle spécifié à la personne spécifiée",
    idRequiredRole: cmdConfig.idRoleGameMaster,
    execute(message, args) {
        let guildRolesToAssign = getMapRoles(message.channel.guild.roles);
        let roleToAssign = guildRolesToAssign.get(args[0]);
        let lstPlayersToAssign = message.mentions.members;
        let excludedRoleIds = [
            cmdConfig.idRoleAdmin,
            cmdConfig.idRoleGameMaster,
            cmdConfig.idRoleEveryone
        ];

        lstPlayersToAssign.forEach(player => {
            getRolesByPlayer(player.id).then(lstRoles => {
                if ((roleToAssign.id === cmdConfig.idRoleDead) && (-1 === lstRoles.indexOf(cmdConfig.idRoleReaper))) {
                    lstRoles.forEach(role => {
                        if (-1 === excludedRoleIds.indexOf(role.idrole)) {
                            player.roles.remove(role.idrole)
                                .then(() => {
                                    deleteAssignement({ idPlayer: player.id, idRole: role.idrole });
                                })
                                .catch(error => { throw error });
                        }
                    });
                }
                player.roles.add(roleToAssign)
                    .then(() => {
                        assignRole({ idPlayer: player.id, idRole: roleToAssign.id });
                    })
                    .catch(error => { throw error });
            });
        });
    }
}

function getMapRoles(guildRoles) {
    let roles = new Map();
    roles.set("amo", guildRoles.resolve(cmdConfig.idRoleLovers));
    roles.set("inf", guildRoles.resolve(cmdConfig.idRoleInfected));
    roles.set("asp", guildRoles.resolve(cmdConfig.idRoleOiled));
    roles.set("env", guildRoles.resolve(cmdConfig.idRoleEnchanted));
    roles.set("mort", guildRoles.resolve(cmdConfig.idRoleDead));
    return roles;
}

function getRolesByPlayer(idPlayer) {
    return new Promise((resolve, reject) => {
        let url = `http://php-api/services.php?service=getRolesByPlayer&idPlayer=${idPlayer}`;
        http.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                resolve(JSON.parse(data));
            });

        }).on("error", (err) => {
            console.log("Error: ", err.message);
        });
    });
}

function deleteAssignement(assignement) {
    return new Promise((resolve, reject) => {
        const options = {
            protocol: 'http:',
            hostname: 'php-api',
            port: 80,
            path: `/services.php?service=deleteAssignement&idPlayer=${assignement.idPlayer}&idRole=${assignement.idRole}`,
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

        }).on("error", (err) => {
            console.log("Error: ", err.message);
        });

        req.end();
    })
}

function assignRole(assignement) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(assignement);
        const options = {
            protocol: 'http:',
            hostname: 'php-api',
            port: 80,
            path: `/services.php?service=assignRole`,
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

        }).on("error", (err) => {
            console.log("Error: ", err.message);
        });

        req.write(data);
        req.end();
    });
}