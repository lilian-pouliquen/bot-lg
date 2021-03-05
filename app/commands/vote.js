const cmdConfig = require("./cmd_config.json");
const http = require("http");
const querystring = require("querystring");
module.exports = {
    name: "vote",
    description: "Affiche le formulaire de vote spécifié",
    idRequiredRole: cmdConfig.idRoleGameMaster,
    execute(message, args) {
        let voteCase = args[0];
        switch (voteCase) {
            case "sor":
                votesSorciere(message, args[1], args[2]);
                break;
            case "pyr":
                votePyromane(message);
                break;
            default:
                vote(message);
                break;
        }
    }
}

function vote(message) {
    let lstExcludedRoles = [
        cmdConfig.idRoleAdmin,
        cmdConfig.idRoleGameMaster,
        cmdConfig.idRoleDead,
        cmdConfig.idRoleEveryone
    ];

    getAlivePlayers(lstExcludedRoles)
        .then(lstAssignements => {
            let msg = "!poll Qui\_voter\_? ";
            lstAssignements.forEach(assignement => {
                msg += `${message.guild.members.resolve(assignement.idplayer).displayName.replace(/ +/g, "\_")} `

                if (lstAssignements.length - 1 === lstAssignements.indexOf(assignement)) {
                    message.channel.send(msg)
                        .catch(error => {
                            throw {
                                error: error,
                                message: "Commande vote - Envoyer un message de vote des joueurs encore en vie."
                            }
                        });
                }
            })
        })
        .catch(error => {
            throw {
                error: error,
                message: "Commande vote - Récupérer les joueurs en vie en base de données."
            }
        });
}

function votesSorciere(message, voteCase, deadPerson,) {
    let channelSor = message.guild.channels.resolve(cmdConfig.idTextChannelWitch);
    switch (voteCase) {
        case "vie":
            if (typeof deadPerson === "undefined") {
                message.reply("je dois connaître la personnes en danger pour proposer de la sauver... :sweat_smile:");
            } else {
                channelSor.send(`!poll Veux-tu\_sauver\_${deadPerson}\_? `);
            }
            break;
        case "mort":
            channelSor.send("!poll Veux-tu\_tuer\_quelqu\'un\_?");
            break;

        case "all":
            if (typeof deadPerson === "undefined") {
                message.reply("tu as oublié de préciser la victime des loups-garous !");
            } else {
                channelSor.send(`!poll Veux-tu\_sauver\_${deadPerson}\_? `);
                channelSor.send('!poll Veux-tu\_tuer\_quelqu\'un\_?');
            }
            break;
        case "vide":
            if (typeof deadPerson === "undefined") {
                message.reply("tu as oublié de spécifier la personne visée par les loups !");
            } else {
                channelSor.send(`Cette personne est visée par les loups : ${deadPerson}.`);
                channelSor.send("Malheureusement tu n'as plus de potion de vie pour la sauver...");
            }
            break;

        default:
            message.reply("désolé, il manque des arguments ! Pour quel cas voulais-tu que j'affiche le vote : \"vie\", \"mort\", \"all\" ou \"vide\" ?");
            break;
    }
}

function votePyromane(message) {
    let channelPyr = message.guild.channels.resolve(cmdConfig.idTextChannelPyromaniac);
    channelPyr.send("!poll Veux-tu\_imbiber\_une\_personne\_ou\_brûler\_celles\_qui\_le\_sont\_déjà\_? Imbiber Brûler");
}

function getAlivePlayers(lstExcludedRoles) {
    return new Promise((resolve, reject) => {
        let url = `http://php-api/services.php?service=getAlivePlayers&${querystring.stringify(lstExcludedRoles)}`;
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