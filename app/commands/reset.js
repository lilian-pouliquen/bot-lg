const cmdConfig = require("./cmd_config.json");
module.exports = {
    name: "reset",
    description: "Enlève les rôles de tous les joueurs",
    idRequiredRole: cmdConfig.idRoleGameMaster,
    execute(message, args) {

        let members = message.channel.guild.channels.resolve(channel => channel.id === cmdConfig.idVocalChannelMain).members;
        let excludedRoles = [
            cmdConfig.idRoleAdmin,
            cmdConfig.idRoleGameMaster,
            message.channel.guild.roles.cache.find(role => role.name === "@everyone").id
        ];

        members.forEach(member => {
            member.roles.cache.forEach(role => {
                if (excludedRoles.indexOf(role.id) === -1) {
                    member.roles.remove(role);
                }
            });
        });
    }
};
