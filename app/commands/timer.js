const ms = require("ms");

module.exports = {
    name: "timer",
    description: "Lance un timer pour n s/m/h",
    requiredRole: "Maître du jeu",
    execute(message, args) {
        let timer = "3m";
        if (typeof args[0] !== "undefined") {
            timer = args[0];
        }
        message.channel.send(`Timer lancé pour : ${timer}`);
        setTimeout(function () {
            message.channel.send("@everyone, le temps est écoulé !");
        }, ms(timer));
    }
}
