const cmdConfig = require("./cmd_config.json");
const Discord = require('discord.js');
module.exports = {
    name: "poll",
    description: "Affiche un formulaire avec la question et les réponses données enn paramètres.",
    idRequiredRole: cmdConfig.idRoleGameMaster,
    execute(message, args) {
        let tblLetters = getTblLetters();

        if (tblLetters.length < args.length - 1) {
            message.reply("stop !!! Il n'y a pas assez de lettres dans l'alphabet pour couvrir tout ce monde. :confounded:");
        } else if (0 === args.length) {
            message.reply("désolé je ne peux rien faire : tu n'as pas donné assez d'arguments ! :sweat_smile:");
        } else if (1 === args.length) {
            message.channel.send(args[0].replace(/_+/g, " "))
                .then(message => {
                    message.react("👍")
                        .catch(error => {
                            throw {
                                error: error,
                                message: "Commande poll - Réagir à un message."
                            }
                        });
                    message.react("👎")
                        .catch(error => {
                            throw {
                                error: error,
                                message: "Commande poll - Réagir à un message."
                            }
                        });
                })
                .catch(error => {
                    throw {
                        error: error,
                        message: "Commande poll - Envoyer un message pour le choix Oui/Non."
                    }
                });
        } else {
            getTblMsgToReact(message, args, tblLetters)
                .then(tblMsgToReact => {
                    let index = 0;
                    tblMsgToReact.forEach(msgToReact => {
                        for (let i = 0; i < msgToReact.nbChoices; i++) {
                            msgToReact.msg.react(tblLetters[index])
                                .catch(error => {
                                    throw {
                                        error: error,
                                        message: "Commande poll - Réagir à un message."
                                    }
                                });
                            index++;
                        }
                    })
                })
                .catch(error => {
                    throw {
                        error: error,
                        message: "Commande poll - Construire le tableau de messages à choix multiples."
                    }
                });
        }
    }
};

function getTblMsgToReact(message, args, tblLetters) {
    return new Promise((resolve, reject) => {
        let question = args[0].replace(/_+/g, " ");
        args.shift();

        let index = 0;
        let tblMsgToReact = new Array();
        let nbLoop = (args.length / 10) === 1 ? Math.trunc(args.length / 10) : Math.trunc(args.length / 10) + 1;

        for (let i = 0; i < nbLoop; i++) {

            let strMessage = "";
            let msg = new Discord.MessageEmbed();
            msg.setColor('#4A03C3');

            let count = 0;
            while (count < 10 && index < args.length) {
                strMessage += tblLetters[index] + " " + args[index].replace(/_+/g, " ") + "\n";
                count++;
                index++;
            };
            msg.addField(question, strMessage);
            let nbChoices = strMessage.trim().split("\n").length
            message.channel.send(msg)
                .then(embedMsg => {
                    tblMsgToReact.push({ msg: embedMsg, nbChoices: nbChoices });
                    if (nbLoop - 1 === i) {
                        resolve(tblMsgToReact);
                    }
                })
                .catch(error => {
                    reject(error);
                });
        }
    });
}

function getTblLetters() {
    return [
        "🇦", "🇧", "🇨", "🇩",
        "🇪", "🇫", "🇬", "🇭",
        "🇮", "🇯", "🇰", "🇱",
        "🇲", "🇳", "🇴", "🇵",
        "🇶", "🇷", "🇸", "🇹",
        "🇺", "🇻", "🇼", "🇽",
        "🇾", "🇿",
    ];
}