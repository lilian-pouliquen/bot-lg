const ms = require("ms");

module.exports = {
    name: "timer",
    description: "Lance un timer pour n s/m/h",
    requiredRole: "Maître du jeu",
    execute(message, args) {
        if (isGameMaster(message)) {
            let timer = "3m";
            if (typeof args[0] !== "undefined") {
                timer = args[0];
            }
            message.channel.send(`Timer lancé pour : ${timer}`);
            setTimeout(function () {
                message.channel.send("@everyone, le temps est écoulé !");
            }, ms(timer));
        } else {
            message.reply("vous n'avez pas les droits nécessaires pour utiliser cette commande.");
        }
    }
}

function isGameMaster(message) {
    var adminRole = message.channel.guild.roles.cache.find(role => role.name === "Maître du jeu");
    return message.member.roles.cache.has(adminRole.id);
}