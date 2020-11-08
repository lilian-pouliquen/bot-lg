const ms = require("ms");
const cmdConfig = require("./cmd_config.json");
module.exports = {
    name: "timer",
    description: "Lance un timer pour n s/m/h",
    idRequiredRole: cmdConfig.idRoleGameMaster,
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
