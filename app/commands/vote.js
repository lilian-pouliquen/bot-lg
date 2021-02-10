const cmdConfig = require("./cmd_config.json");
module.exports = {
    name: "vote",
    description: "Affiche le formulaire de vote spécifié",
    idRequiredRole: cmdConfig.idRoleGameMaster,
    execute(message, args) {
        let voteCase = args[0];
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
    let deadPlayers = message.guild.roles.resolve(cmdConfig.idRoleDead).members;
    let gameMasters = message.guild.roles.resolve(cmdConfig.idRoleGameMaster).members;
    let players = message.channel.guild.channels.resolve(cmdConfig.idVocalChannelMain).members.filter(member => !deadPlayers.has(member.id) && !gameMasters.has(member.id));

    let strVote = '!poll Qui\_voter\_? ';
    players.forEach(player => {
        strVote += `${player.displayName.replace(/ +/g, "\_")} `
    });

    message.channel.send(strVote);
}

function votesSorciere(message, voteCase, deadPerson,) {
    let channelSor = message.channel.guild.channels.resolve(cmdConfig.idTextChannelWitch);
    switch (voteCase) {
        case "vie":
            if (typeof deadPerson === "undefined") {
                message.reply("je dois connaître la personnes en danger pour proposer de la sauver... :sweat_smile:");
            } else {
                channelSor.send(`!poll Veux-tu\_sauver\_${deadPerson}\_? `);
            }
            break;
        case "mort":
            channelSor.send("!poll Veux-tu\_tuer\_quelqu\'un\_?");
            break;

        case "all":
            if (typeof deadPerson === "undefined") {
                message.reply("tu as oublié de préciser la victime des loups-garous !");
            } else {
                channelSor.send(`!poll Veux-tu\_sauver\_${deadPerson}\_? `);
                channelSor.send('!poll Veux-tu\_tuer\_quelqu\'un\_?');
            }
            break;
        case "vide":
            if (typeof deadPerson === "undefined") {
                message.reply("tu as oublié de spécifier la personne visée par les loups !");
            } else {
                channelSor.send(`Cette personne est visée par les loups : ${deadPerson}.`);
                channelSor.send("Malheureusement tu n'as plus de potion de vie pour la sauver...");
            }
            break;

        default:
            message.reply("désolé, il manque des arguments ! Pour quel cas voulais-tu que j'affiche le vote : \"vie\", \"mort\", \"all\" ou \"vide\" ?");
            break;
    }
}

function votePyromane(message) {
    let channelPyr = message.channel.guild.channels.resolve(cmdConfig.idTextChannelPyromaniac);
    channelPyr.send("!poll Veux-tu\_imbiber\_une\_personne\_ou\_brûler\_celles\_qui\_le\_sont\_déjà\_? Imbiber Brûler");
}
