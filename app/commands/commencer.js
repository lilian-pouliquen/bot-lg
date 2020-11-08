const cmdConfig = require("./cmd_config.json");
module.exports = {
    name: "commencer",
    description: "Assigne les rôles spécifiés aux joueurs",
    idRequiredRole: cmdConfig.idRoleGameMaster,
    execute(message, args) {
        let players = message.channel.guild.channels.cache.resolve(cmdConfig.idVocalChannelMain).members;
        let lstPlayersToAssign = players;

        players.forEach(player => {
            if (player.roles.cache.has(cmdConfig.idRoleGameMaster)) {
                lstPlayersToAssign.delete(player.id);
            }
        });

        if (checkCoherenceArgs(lstPlayersToAssign.size, args)) {
            let guildRoles = message.channel.guild.roles;
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
    roles.set("vil", guildRoles.resolve(cmdConfig.idRoleVillager));
    roles.set("cup", guildRoles.resolve(cmdConfig.idRoleCupid));
    roles.set("gar", guildRoles.resolve(cmdConfig.idRoleGuard));
    roles.set("lg", guildRoles.resolve(cmdConfig.idRoleWerewolf));
    roles.set("lgb", guildRoles.resolve(cmdConfig.idRoleWhiteWerewolf));
    roles.set("plg", guildRoles.resolve(cmdConfig.idRoleInfectWerewolf));
    roles.set("sor", guildRoles.resolve(cmdConfig.idRoleWitch));
    roles.set("voy", guildRoles.resolve(cmdConfig.idRoleSeer));
    roles.set("ass", guildRoles.resolve(cmdConfig.idRoleAssassin));
    roles.set("pyr", guildRoles.resolve(cmdConfig.idRolePyromaniac));
    roles.set("jdf", guildRoles.resolve(cmdConfig.idRoleFlutist));
    roles.set("ank", guildRoles.resolve(cmdConfig.idRoleReaper));
    roles.set("anc", guildRoles.resolve(cmdConfig.idRoleAncient));
    roles.set("ang", guildRoles.resolve(cmdConfig.idRoleAngel));
    roles.set("cham", guildRoles.resolve(cmdConfig.idRoleShaman));
    roles.set("chass", guildRoles.resolve(cmdConfig.idRoleHunter));
    return roles;
}
