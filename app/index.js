const fs = require('fs');
const Discord = require('discord.js');

const { prefix, token } = require('./config.json');
const client = new Discord.Client();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
client.commands = new Discord.Collection();

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({ activity: { name: '!commandes' }, status: 'online' })
});

client.on("message", message => {
    if (!message.content.startsWith(prefix)) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if (!client.commands.has(command)) return;
    message.delete();
    try {
        switch (command) {
            case "commandes":
                message.reply("voici les commandes disponibles :");
                client.commands.forEach(command => {
                    if (command.idRequiredRole === "None") {
                        message.channel.send(`${command.name} : ${command.description}`);
                    } else {
                        if (hasRequiredRole(message, command.idRequiredRole)) {
                            let requiredRoleName = message.channel.guild.roles.resolve(command.idRequiredRole).name;
                            message.channel.send(`${command.name} : ${command.description} --- _Requiert le rôle ${requiredRoleName}_`);
                        }
                    }
                })
                break;

            case "deconnexion":
                if (hasRequiredRole(message, client.commands.get(command).idRequiredRole)) {
                    client.user.setPresence({ status: 'offline' })
                    message.channel.send("Je me déconnecte, à bientôt !")
                        .then(() => { client.destroy() });
                } else {
                    message.reply("vous n'avez pas les droits nécessaires pour utiliser cette commande.");
                }
                break;

            default:
                let objCommand = client.commands.get(command);
                if (objCommand.idRequiredRole === "None") {
                    objCommand.execute(message, args);
                } else {
                    if (hasRequiredRole(message, objCommand.idRequiredRole)) {
                        objCommand.execute(message, args);
                    } else {
                        message.reply("vous n'avez pas les droits nécessaires pour utiliser cette commande.");
                    }
                }
                break;
        }
    } catch (error) {
        console.error(error);
        message.reply("un problème est survenu lors de l'exécution de la commande");
    }
});

client.login(token);

function hasRequiredRole(message, idRequiredRole) {
    return message.member.roles.cache.has(idRequiredRole);
}
