module.exports = {
    name: "clear",
    description: "Efface tous les messages non épinglés dans le cannal courant",
    requiredRole: "Admin",
    execute(message, args) {
        if (isAdmin(message)) {
            message.channel.messages.fetch({ limit: 100 })
                .then(fetched => {
                    const notPinned = fetched.filter(msg => !msg.pinned);
                    if (typeof args[0] !== "undefined" && args[0] === "old") {
                        notPinned.forEach(msg => {
                            msg.delete();
                        })
                    } else {
                        message.channel.bulkDelete(notPinned, true);
                    }
                })
                .catch(console.error());
        } else {
            message.reply("vous n'avez pas les droits nécessaires pour utiliser cette commande.");
        }
    }
};

function isAdmin(message) {
    var adminRole = message.channel.guild.roles.cache.find(role => role.name === "Admin");
    return message.member.roles.cache.has(adminRole.id);
}