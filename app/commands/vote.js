module.exports = {
    name: "vote",
    description: "Affiche le formulaire de vote spécifié",
    requiredRole: "Maître du jeu",
    execute(message, args) {
        if (isGameMaster(message)) {
            let voteCase;
            if (typeof args[0] !== "undefined") {
                voteCase = args[0];
            }
            switch (voteCase) {
                case "sor":
                    votesSorciere(message, args[1], args[2]);
                    break;
                case "pyr":
                    votePyromane(message);
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

function votesSorciere(message, voteCase, deadPerson,) {
    let channelSor = message.channel.guild.channels.cache.find(channel => channel.name === "sorcière");
    switch (voteCase) {
        case "vie":
            if (typeof deadPerson !== "undefined") {
                channelSor.send(`/poll "Veux-tu sauver ${deadPerson} ? "`)
            }
            break;
        case "mort":
            channelSor.send('/poll "Veux-tu tuer quelqu\'un ?"')
            break;

        case "all":
            if (typeof deadPerson !== "undefined") {
                channelSor.send(`/poll "Veux-tu sauver ${deadPerson} ? "`)
            }
            channelSor.send('/poll "Veux-tu tuer quelqu\'un ?"')
            break;
    }
}

function votePyromane(message) {
    let channelPyr = message.channel.guild.channels.cache.find(channel => channel.name === "pyromane");
    channelPyr.send('/poll "Veux-tu imbiber une personne ou brûler celles qui le sont déjà ?" "Imbiber" "Brûler"');
}