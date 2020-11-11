const cmdConfig = require("./cmd_config.json");
module.exports = {
    name: "roles",
    description: "Affiche les rôles encore en jeu",
    idRequiredRole: "None",
    execute(message, args) {
        let guildRoles = message.channel.guild.roles
        let rolesAvailable = [
            guildRoles.resolve(cmdConfig.idRoleVillager),
            guildRoles.resolve(cmdConfig.idRoleCupid),
            guildRoles.resolve(cmdConfig.idRoleGuard),
            guildRoles.resolve(cmdConfig.idRoleWerewolf),
            guildRoles.resolve(cmdConfig.idRoleWhiteWerewolf),
            guildRoles.resolve(cmdConfig.idRoleInfectWerewolf),
            guildRoles.resolve(cmdConfig.idRoleWitch),
            guildRoles.resolve(cmdConfig.idRoleSeer),
            guildRoles.resolve(cmdConfig.idRoleAssassin),
            guildRoles.resolve(cmdConfig.idRolePyromaniac),
            guildRoles.resolve(cmdConfig.idRoleFlutist),
            guildRoles.resolve(cmdConfig.idRoleReaper),
            guildRoles.resolve(cmdConfig.idRoleAncient),
            guildRoles.resolve(cmdConfig.idRoleAngel),
            guildRoles.resolve(cmdConfig.idRoleShaman),
            guildRoles.resolve(cmdConfig.idRoleHunter)
        ];

        let rolesToPrint = rolesAvailable.filter(role => role.members.size > 0);
        if (rolesToPrint.length === 0) {
            message.reply("il n'y a plus de rôle en jeu :sweat_smile:")
        } else {
            message.reply("voici les roles encore en jeu :")
            rolesToPrint.forEach(role => {
                message.channel.send(`> ${role.name} : ${role.members.size}`)
            });
        }
    }
}
