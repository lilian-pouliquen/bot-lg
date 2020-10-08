module.exports = {
	name: "mute",
    description: "Rend muet l'ensemble des joueurs",
	execute(message, args) {
        var gmRole = message.guild.roles.find(role => role.name === "Maître du jeu");
        var mutedRole = message.guild.roles.find(role => role.name === "Muted");
        var vocalChannel = message.guild.channels.find(channel => channel.name === "Salon vocal");
        
        vocalChannel.members.forEach( member => {
            if (! member.roles.has(gmRole)) {
                member.setMute(true);
                member.addRole(mutedRole);
            }
        });
	}
};