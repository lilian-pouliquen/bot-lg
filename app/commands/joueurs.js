const cmdConfig = require("./cmd_config.json");
const http = require("http");
const querystring = require("querystring");
module.exports = {
    name: "joueurs",
    description: "Affiche les rôles de tous les joueurs dans le canal 'maitre-du-jeu'",
    idRequiredRole: cmdConfig.idRoleGameMaster,
    execute(message, args) {
        let channelGM = message.channel.guild.channels.resolve(cmdConfig.idTextChannelGameMaster);
        let members = message.channel.guild.channels.resolve(cmdConfig.idVocalChannelMain).members;

        if (members.size === 0) {
            channelGM.send("Il n'y a personne dans le salon vocal");
        } else {
            getPlayers().then(lstPlayers => {
                let msg = "Voici les rôles des joueurs présents :\n";
                lstPlayers.forEach(player => {
                    getRolesByPlayer(player.idplayer).then(lstRoles => {
                        msg += `Rôles de ${message.guild.members.resolve(player.idplayer).displayName} :\n`;
                        lstRoles.forEach(role => {
                            if (cmdConfig.idRoleEveryone !== role.idrole) msg += `> - ${message.guild.roles.resolve(role.idrole).name}\n`;
                            if ((lstPlayers.length - 1 === lstPlayers.indexOf(player)) && (lstRoles.length - 1 === lstRoles.indexOf(role))) {
                                channelGM.send(msg);
                            }
                        });
                    });
                });
            });
        }
    }
}

function getPlayers() {
    return new Promise((resolve, reject) => {
        let url = `http://php-api/services.php?service=getPlayers`;
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