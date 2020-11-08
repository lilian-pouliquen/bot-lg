const cmdConfig = require("./cmd_config.json");
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
            channelGM.send("Voici les rôles des joueurs présents :");
            members.forEach(member => {
                channelGM.send(`Rôles de ${member.displayName}`);
                member.roles.cache.forEach(role => {
                    if (role.name !== "@everyone") {
                        channelGM.send(`> - ${role.name}`);
                    }
                });
            });
        }
    }
}
