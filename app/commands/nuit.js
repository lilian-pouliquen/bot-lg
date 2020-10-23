module.exports = {
	name: "nuit",
    description: "Rend muet l'ensemble des joueurs",
	execute(message, args) {
        var gmRole = message.guild.roles.cache.find(role => role.name === "Maître du jeu");
        var mutedRole = message.guild.roles.cache.find(role => role.name === "Muted");
        var vocalChannel = message.guild.channels.cache.find(channel => channel.name === "Salon vocal");
        
        vocalChannel.members.forEach( member => {
            if (! member.roles.cache.has(gmRole)) {
                member.voice.setMute(true);
                member.roles.add(mutedRole);
            }
        });
	}
};