module.exports = {
    name: "vote",
    description: "Affiche le formulaire de vote spécifié (requiert le rôle MAÎTRE DU JEU)",
    execute(message, args) {
        if (isGameMaster(message)) {
            let voteCase;
            if (typeof args[0] !== "undefined") {
                voteCase = args[0];
            }
            switch (voteCase) {
                case "sor":
                    votesSorciere(message, args[1]);
                    break;
                case "pyr":
                    votesPyromane(message);
                    break;
                default:
                    vote(message);
                    break;
            }
        } else {
            message.reply("vous n'avez pas les droits nécessaires pour utiliser cette commande.")
        }
    }
}

function isGameMaster(message) {
    var adminRole = message.channel.guild.roles.cache.find(role => role.name === "Maître du jeu");
    return message.member.roles.cache.has(adminRole.id);
}

function vote(message) {
    let excludedRoles = [
        message.channel.guild.roles.cache.find(role => role.name === "Admin").id,
        message.channel.guild.roles.cache.find(role => role.name === "Maître du jeu").id,
        message.channel.guild.roles.cache.find(role => role.name === "Mort").id
    ];

    let vocalChannel = message.channel.guild.channels.cache.find(channel => channel.name === "Salon vocal");
    let strVote = '/poll "Qui voter ?" ';
    vocalChannel.members.forEach(member => {
        let hasExcludedRole = false;
        excludedRoles.forEach(excludedRole => {
            if (member.roles.cache.has(excludedRole)) {
                hasExcludedRole = true;
            }
        })

        if (!hasExcludedRole) {
            strVote += `"${member.displayName}" `
        }
    });

    message.channel.send(strVote);
}

function votesSorciere(message, deadPerson) {
    if (typeof deadPerson !== "undefined") {
        message.channel.send(`/poll "Veux tu sauver ${deadPerson} ? "`)
    }
    message.channel.send('/poll "Veux tu tuer quelqu\'un ?"')
}

function votesPyromane(message) {
    vote(message);
    message.channel.send('/poll "Veux-tu brûler les personnes imbibées ?"');
}