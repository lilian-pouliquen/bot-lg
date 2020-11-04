module.exports = {
    name: "clear",
    description: "Efface tous les messages non épinglés dans le cannal courant",
    requiredRole: "Admin",
    execute(message, args) {
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
    }
};
