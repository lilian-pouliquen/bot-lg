const fs = require('fs');
const Discord = require('discord.js');

const { prefix, token } = require('./config.json');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({ activity: { name: '!commandes' }, status: 'online' })
});

client.on("message", message => {
    if (message.author.bot) return;

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
                    if(command.requiredRole === "None") {
                        message.channel.send(`${command.name} : ${command.description}`);
                    } else {
                        let idRequiredRole = message.channel.guild.roles.cache.find(role => role.name === command.requiredRole).id;
                        if (message.member.roles.cache.has(idRequiredRole)) {
                            message.channel.send(`${command.name} : ${command.description} --- _Requiert le rôle ${command.requiredRole}_`);
                        }
                    }
                })
                break;

            case "deconnexion":
                if (isAdmin(message)) {
                    message.channel.send("Je me déconnecte, à bientôt !")
                        .then(message => { client.destroy() });
                } else {
                    message.reply("vous n'avez pas les droits nécessaires pour utiliser cette commande.");
                }
                break;

            default:
                client.commands.get(command).execute(message, args);
                break;
        }
    } catch (error) {
        console.error(error);
        message.reply("un problème est survenu lors de l'exécution de la commande");
    }
});

client.login(token);

function isAdmin(message) {
    var adminRole = message.channel.guild.roles.cache.find(role => role.name === "Admin");
    return message.member.roles.cache.has(adminRole.id);
}