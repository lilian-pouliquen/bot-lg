module.exports = {
    name: "joueurs",
    description: "Affiche les rôles de tous les joueurs dans le canal 'maitre-du-jeu'",
    requiredRole: "Maître du jeu",
    execute(message, args) {
        let channelGM = message.channel.guild.channels.cache.find(channel => channel.name === "maitre-du-jeu");
        let members = message.channel.guild.channels.cache.find(channel => channel.name === "Salon vocal").members;

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
