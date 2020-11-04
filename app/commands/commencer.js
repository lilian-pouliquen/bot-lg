module.exports = {
    name: "commencer",
    description: "Assigne les rôles spécifiés aux joueurs (requiert le rôle MAÎTRE DU JEU)",
    execute(message, args) {
        if (isGameMaster(message)) {
            let players = message.channel.guild.channels.cache.find(channel => channel.name === "Salon vocal").members;

            if (checkCoherenceArgs(players, args)) {
                let assignedPlayers = [message.member];
                let guildRoles = message.channel.guild.roles.cache;
                let roles = getMapRoles(guildRoles);

                args.forEach(assignation => {
                    let number = assignation.substr(0, 1);
                    let strRoleToAssign = assignation.substr(1);
                    let roleToAssign = roles.get(strRoleToAssign);

                    let index = 0;
                    while (index < number) {
                        let playerToAssign = players.random(1)[0];
                        if (assignedPlayers.indexOf(playerToAssign) === -1) {
                            playerToAssign.roles.add(roleToAssign);
                            assignedPlayers.push(playerToAssign);
                            index++;
                        }
                    }
                });
            } else {
                message.reply("il y a plus de rôles à attribuer que de joueurs.")
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

function checkCoherenceArgs(players, args) {
    let checkNbArgs = players.size - 1 === args.length;
    let nbRoles = 0;
    args.forEach(arg => {
        nbRoles += Number(arg.substr(0, 1));
    });
    let checkNbRoles = players.size - 1 === nbRoles;
    return checkNbArgs && checkNbRoles;
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