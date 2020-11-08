const cmdConfig = require("./cmd_config.json");
module.exports = {
    name: "nuit",
    description: "Rend muet l'ensemble des joueurs",
    idRequiredRole: cmdConfig.idRoleGameMaster,
    execute(message, args) {
        let vocalChannel = message.guild.channels.resolve(cmdConfig.idVocalChannelMain);

        vocalChannel.members.forEach(member => {
            if (!member.roles.cache.has(cmdConfig.idRoleGameMaster)) {
                member.voice.setMute(true);
                member.roles.add(cmdConfig.idRoleMuted);
            }
        });
    }
};
