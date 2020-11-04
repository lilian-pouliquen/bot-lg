module.exports = {
    name: "joueurs",
    description: "Affiche les rôles de tous les joueurs dans le canal 'maitre-du-jeu' (requiert le rôle MAITRE DU JEU)",
    execute(message, args) {

        if (isGameMaster(message)) {
            let channelGM = message.channel.guild.channels.cache.find(channel => channel.name === "maitre-du-jeu");
            let members = message.channel.guild.channels.cache.find(channel => channel.name === "Salon vocal").members;

            if (members.size === 0) {
                channelGM.send("Il n'y à personne dans le salon vocal");
            } else {
                channelGM.send("Voici les rôles des joueurs présents :");
                members.forEach(member => {
                    channelGM.send(`Rôles de ${member.nickname}`);
                    member.roles.cache.forEach(role => {
                        if (role.name !== "@everyone") {
                            channelGM.send(`> - ${role.name}`);
                        }
                    });
                });
            }
        } else {
            message.reply("vous n'avez pas les droits nécessaires pour utiliser cette commande.");
        }
    }
}

function isGameMaster(message) {
    var adminRole = message.channel.guild.roles.cache.find(role => role.name === "Maître du jeu");
    return message.member.roles.cache.has(adminRole.id);
}