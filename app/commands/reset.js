module.exports = {
    name: "reset",
    description: "Enlève les rôles de tous les joueurs",
    requiredRole: "Maître du jeu",
    execute(message, args) {

        let members = message.channel.guild.channels.cache.find(channel => channel.name === "Salon vocal").members;
        let excludedRoles = [
            message.channel.guild.roles.cache.find(role => role.name === "Admin").id,
            message.channel.guild.roles.cache.find(role => role.name === "Maître du jeu").id,
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
