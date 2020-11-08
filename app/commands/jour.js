const cmdConfig = require("./cmd_config.json");
module.exports = {
    name: "jour",
    description: "Redonne la parole à l'ensemble des joueurs",
    requiredRole: "Maître du jeu",
    execute(message, args) {
        let vocalChannel = message.guild.channels.resolve(cmdConfig.idVocalChannelMain);

        vocalChannel.members.forEach(member => {
            if (!member.roles.cache.has(cmdConfig.idRoleGameMaster)) {
                member.voice.setMute(false);
                member.roles.remove(cmdConfig.idRoleMuted);
            }
        });
    }
};
