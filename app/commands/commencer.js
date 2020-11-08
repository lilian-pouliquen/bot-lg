module.exports = {
    name: "commencer",
    description: "Assigne les rôles spécifiés aux joueurs",
    requiredRole: "Maître du jeu",
    execute(message, args) {
        let idRoleGM = message.channel.guild.roles.cache.find(role => role.name === "Maître du jeu").id;
        let players = message.channel.guild.channels.cache.find(channel => channel.name === "Salon vocal").members;
        let lstPlayersToAssign = players;

        players.forEach(player => {
            if (player.roles.cache.has(idRoleGM)) {
                lstPlayersToAssign.delete(player.id);
            }
        });

        if (checkCoherenceArgs(lstPlayersToAssign.size, args)) {
            let guildRoles = message.channel.guild.roles.cache;
            let roles = getMapRoles(guildRoles);

            args.forEach(assignation => {
                let number = assignation.substr(0, 1);
                let strRoleToAssign = assignation.substr(1);
                let roleToAssign = roles.get(strRoleToAssign);

                for (index = 0; index < number; index++) {
                    let playerToAssign = lstPlayersToAssign.random(1)[0];
                    playerToAssign.roles.add(roleToAssign);
                    lstPlayersToAssign.delete(playerToAssign.id)
                }
            });
        } else {
            message.reply("il y a plus de rôles à attribuer que de joueurs.")
        }
    }
}

function checkCoherenceArgs(nbPlayers, args) {
    let checkNbArgs = nbPlayers === args.length;
    let nbRoles = 0;
    args.forEach(arg => {
        nbRoles += Number(arg.substr(0, 1));
    });
    let checkNbRoles = nbPlayers === nbRoles;
    return checkNbArgs || checkNbRoles;
}

function getMapRoles(guildRoles) {
    let roles = new Map();
    roles.set("vil", guildRoles.find(role => role.name === "Villageois"));
    roles.set("cup", guildRoles.find(role => role.name === "Cupidon"));
    roles.set("gar", guildRoles.find(role => role.name === "Gardien"));
    roles.set("lg", guildRoles.find(role => role.name === "Loups-garous"));
    roles.set("lgb", guildRoles.find(role => role.name === "Loup Blanc"));
    roles.set("plg", guildRoles.find(role => role.name === "Père des loups"));
    roles.set("sor", guildRoles.find(role => role.name === "Sorcière"));
    roles.set("voy", guildRoles.find(role => role.name === "Voyante"));
    roles.set("ass", guildRoles.find(role => role.name === "Assassin"));
    roles.set("pyr", guildRoles.find(role => role.name === "Pyromane"));
    roles.set("jdf", guildRoles.find(role => role.name === "Joueur de flûte"));
    roles.set("ank", guildRoles.find(role => role.name === "Ankou"));
    roles.set("anc", guildRoles.find(role => role.name === "Ancien"));
    roles.set("ang", guildRoles.find(role => role.name === "Ange"));
    roles.set("cham", guildRoles.find(role => role.name === "Chaman"));
    roles.set("chass", guildRoles.find(role => role.name === "Chasseur"));
    return roles;
}
