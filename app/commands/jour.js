const cmdConfig = require("./cmd_config.json");
module.exports = {
    name: "jour",
    description: "Redonne la parole à l'ensemble des joueurs",
    idRequiredRole: cmdConfig.idRoleGameMaster,
    execute(message, args) {
        let vocalChannel = message.guild.channels.resolve(cmdConfig.idVocalChannelMain);

        vocalChannel.members.forEach(member => {
            member.fetch()
                .then(member => {
                    if (!member.roles.cache.has(cmdConfig.idRoleGameMaster)) {
                        member.voice.setMute(false)
                            .catch(error => {
                                throw {
                                    error: error,
                                    message: "Commande jour - Rendre la parole à un joueur."
                                }
                            });
                        member.roles.remove(cmdConfig.idRoleMuted)
                            .catch(error => {
                                throw {
                                    error: error,
                                    message: "Commande jour - Supprimer un rôle à un joueur."
                                }
                            });
                    }
                })
                .catch(error => {
                    throw {
                        error: error,
                        message: "Commande jour - Actualiser le cache d'un joueur."
                    }
                });
        })
    }
};
