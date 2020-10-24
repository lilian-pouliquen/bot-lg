module.exports = {
    name: "jour",
    description: "Redonne la parole à l'ensemble des joueurs (requiert le rôle MAÎTRE DU JEU)",
    execute(message, args) {
        if (isGameMaster(message)) {
            var gmRole = message.guild.roles.cache.find(role => role.name === "Maître du jeu");
            var mutedRole = message.guild.roles.cache.find(role => role.name === "Muted");
            var vocalChannel = message.guild.channels.cache.find(channel => channel.name === "Salon vocal");

            vocalChannel.members.forEach(member => {
                if (!member.roles.cache.has(gmRole.id)) {
                    member.voice.setMute(false);
                    member.roles.remove(mutedRole);
                }
            });
        } else {
            message.reply("vous n'avez pas les droits nécessaires pour utiliser cette commande.");
        }
    }
};

function isGameMaster(message) {
    var adminRole = message.channel.guild.roles.cache.find(role => role.name === "Maître du jeu");
    return message.member.roles.cache.has(adminRole.id);
}