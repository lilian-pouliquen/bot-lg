const cmdConfig = require("./cmd_config.json");
module.exports = {
    name: "nuit",
    description: "Rend muet l'ensemble des joueurs",
    idRequiredRole: cmdConfig.idRoleGameMaster,
    execute(message, args) {
        let vocalChannel = message.guild.channels.resolve(cmdConfig.idVocalChannelMain);

        vocalChannel.members.forEach(member => {
            member.fetch()
                .then(member => {
                    if (!member.roles.cache.has(cmdConfig.idRoleGameMaster)) {
                        member.voice.setMute(true)
                            .catch(error => {
                                throw {
                                    error: error,
                                    message: "Commande nuit - Rendre muet un joueur."
                                }
                            });
                        member.roles.add(cmdConfig.idRoleMuted)
                            .catch(error => {
                                throw {
                                    error: error,
                                    message: "Commande nuit - Ajouter un rôle à un joueur."
                                }
                            });
                    }
                })
                .catch(error => {
                    throw {
                        error: error,
                        message: "Commande nuit - Actualiser le cache d'un joueur."
                    }
                });
        });
    }
};
