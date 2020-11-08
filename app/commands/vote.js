const cmdConfig = require("./cmd_config.json");
module.exports = {
    name: "vote",
    description: "Affiche le formulaire de vote spécifié",
    idRequiredRole: cmdConfig.idRoleGameMaster,
    execute(message, args) {
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
    }
}

function vote(message) {
    let idExcludedRoles = [
        cmdConfig.idRoleAdmin,
        cmdConfig.idRoleGameMaster,
        cmdConfig.idRoleDead
    ];

    let vocalChannel = message.channel.guild.channels.resolve(cmdConfig.idVocalChannelMain);
    let strVote = '/poll "Qui voter ?" ';
    vocalChannel.members.forEach(member => {
        let hasExcludedRole = false;
        idExcludedRoles.forEach(idExcludedRole => {
            if (member.roles.cache.has(idExcludedRole)) {
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
    let channelSor = message.channel.guild.channels.resolve(cmdConfig.idTextChannelWitch);
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
    let channelPyr = message.channel.guild.channels.resolve(cmdConfig.idTextChannelPyromaniac);
    channelPyr.send('/poll "Veux-tu imbiber une personne ou brûler celles qui le sont déjà ?" "Imbiber" "Brûler"');
}
