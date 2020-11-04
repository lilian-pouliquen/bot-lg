module.exports = {
    name: "roles",
    description: "Affiche les rôles encore en jeu",
    requiredRole: "None",
    execute(message, args) {
        let excludedRoles = [
            message.channel.guild.roles.cache.find(role => role.name === "Admin").id,
            message.channel.guild.roles.cache.find(role => role.name === "Maître du jeu").id,
            message.channel.guild.roles.cache.find(role => role.name === "Infecté").id,
            message.channel.guild.roles.cache.find(role => role.name === "Envouté").id,
            message.channel.guild.roles.cache.find(role => role.name === "Mort").id,
            message.channel.guild.roles.cache.find(role => role.name === "@everyone").id
        ];

        let remainingRoles = new Map();
        let voiceChannel = message.channel.guild.channels.cache.find(channel => channel.name === "Salon vocal");

        var constructList = new Promise((resolve, reject) => {
            voiceChannel.members.forEach(member => {
                member.roles.cache.forEach(role => {
                    if (excludedRoles.indexOf(role.id) === -1) {
                        if (remainingRoles.has(role.id)) {
                            remainingRoles[role.id]["number"] += 1;
                        } else {
                            let roleInfo = new Map();
                            roleInfo.set("name", role.name);
                            roleInfo.set("number", 1)
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
                    message.channel.send(`${role.get("name")} : ${role.get("number")}`);
                });
            })
            .catch(console.error);
    }
}