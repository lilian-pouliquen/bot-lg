const cmdConfig = require("./cmd_config.json");
module.exports = {
    name: "roles",
    description: "Affiche les rôles encore en jeu",
    idRequiredRole: "None",
    execute(message, args) {
        let excludedRoles = [
            cmdConfig.idRoleAdmin,
            cmdConfig.idRoleGameMaster,
            cmdConfig.idRoleInfected,
            cmdConfig.idRoleOiled,
            cmdConfig.idRoleEnchanted,
            cmdConfig.idRoleDead,
            message.channel.guild.roles.cache.find(role => role.name === "@everyone").id
        ];

        let remainingRoles = new Map();
        let voiceChannel = message.channel.guild.channels.resolve(cmdConfig.idVocalChannelMain);

        var constructList = new Promise((resolve, reject) => {
            voiceChannel.members.forEach(member => {
                member.roles.cache.forEach(role => {
                    if (excludedRoles.indexOf(role.id) === -1) {
                        if (remainingRoles.has(role.id)) {
                            let updatedRole = remainingRoles.get(role.id);
                            let occurences = updatedRole.get("occurences");
                            updatedRole.set("occurences", occurences + 1);
                            remainingRoles.set(role.id, updatedRole)
                        } else {
                            let roleInfo = new Map();
                            roleInfo.set("name", role.name);
                            roleInfo.set("occurences", 1)
                            remainingRoles.set(role.id, roleInfo);
                        }
                    }
                })
                resolve();
            });
        });

        constructList
            .then(() => {
                message.reply("voici les rôles encore en jeu :");
                remainingRoles.forEach(role => {
                    message.channel.send(`${role.get("name")} : ${role.get("occurences")}`);
                });
            })
            .catch(console.error);
    }
}
