const cmdConfig = require("./cmd_config.json");
module.exports = {
    name: "clear",
    description: "Efface tous les messages non épinglés dans le cannal courant",
    idRequiredRole: cmdConfig.idRoleAdmin,
    execute(message, args) {
        message.channel.messages.fetch({ limit: 100 })
            .then(fetched => {
                const notPinned = fetched.filter(msg => !msg.pinned);
                if (typeof args[0] !== "undefined" && args[0] === "old") {
                    notPinned.forEach(msg => {
                        msg.delete()
                            .catch(error => {
                                throw {
                                    error: error,
                                    message: "Commande clear - Supprimer les messages les plus anciens."
                                }
                            });
                    });
                } else {
                    message.channel.bulkDelete(notPinned, true)
                        .catch(error => {
                            throw {
                                error: error,
                                message: "Commande clear - Supprimer les messages les plus récents."
                            }
                        });
                }
            })
            .catch(error => {
                throw {
                    error: error,
                    message: "Commande clear - Récupérer les messages du canal."
                }
            });
    }
};
