module.exports = {
    name: "assigner",
    description: "Assigne le rôle spécifié à la personne spécifiée",
    requiredRole: "Maître du jeu",
    execute(message, args) {
        let guildRoles = getMapRoles(message.channel.guild.roles.cache);
        let roleToAssign = guildRoles.get(args[0]);
        let idPlayer = args[1].replace("<@!", "").replace(">", "");
        let playerToAssign = message.channel.guild.members.cache.find(player => player.id === idPlayer);

        playerToAssign.roles.add(roleToAssign);
    }
}

function getMapRoles(guildRoles) {
    let roles = new Map();
    roles.set("amo", guildRoles.find(role => role.name === "Amoureux"));
    roles.set("inf", guildRoles.find(role => role.name === "Infecté"));
    roles.set("asp", guildRoles.find(role => role.name === "Aspergé d'essence"));
    roles.set("env", guildRoles.find(role => role.name === "Envouté"));
    roles.set("mort", guildRoles.find(role => role.name === "Mort"));
    return roles;
}
