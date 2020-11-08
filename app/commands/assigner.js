const cmdConfig = require("./cmd_config.json");
module.exports = {
    name: "assigner",
    description: "Assigne le rôle spécifié à la personne spécifiée",
    idRequiredRole: cmdConfig.idRoleGameMaster,
    execute(message, args) {
        let guildRolesToAssign = getMapRoles(message.channel.guild.roles);
        let roleToAssign = guildRolesToAssign.get(args[0]);
        let playerToAssign = message.mentions.members.first();
        playerToAssign.roles.add(roleToAssign);
    }
}

function getMapRoles(guildRoles) {
    let roles = new Map();
    roles.set("amo", guildRoles.resolve(cmdConfig.idRoleLovers));
    roles.set("inf", guildRoles.resolve(cmdConfig.idRoleInfected));
    roles.set("asp", guildRoles.resolve(cmdConfig.idRoleOiled));
    roles.set("env", guildRoles.resolve(cmdConfig.idRoleEnchanted));
    roles.set("mort", guildRoles.resolve(cmdConfig.idRoleDead));
    return roles;
}
