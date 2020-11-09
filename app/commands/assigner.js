const cmdConfig = require("./cmd_config.json");
module.exports = {
    name: "assigner",
    description: "Assigne le rôle spécifié à la personne spécifiée",
    idRequiredRole: cmdConfig.idRoleGameMaster,
    execute(message, args) {
        let guildRolesToAssign = getMapRoles(message.channel.guild.roles);
        let roleToAssign = guildRolesToAssign.get(args[0]);
        let playerToAssign = message.mentions.members.first();
        let excludedRoleIds = [
            cmdConfig.idRoleAdmin,
            cmdConfig.idRoleGameMaster,
            message.channel.guild.roles.cache.find(role => role.name === "@everyone").id
        ];

        if (roleToAssign.id === cmdConfig.idRoleDead && !playerToAssign.roles.cache.has(cmdConfig.idRoleReaper)) {
            playerToAssign.roles.cache.forEach(role => {
                if (excludedRoleIds.indexOf(role.id) === -1) {
                    playerToAssign.roles.remove(role);
                }
            });
        }
        playerToAssign.roles.add(roleToAssign)
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
