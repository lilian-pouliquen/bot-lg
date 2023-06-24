const fs = require('node:fs');
const path = require('node:path');
const { getLogDate } = require('./shared_functions');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

// Initialise client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Load commands
client.commands = new Collection();
const commandFoldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandFoldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(commandFoldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		// Set a new item in the Collection with commandName => module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`${getLogDate()} [bot-lg] WARNING: The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Log when client is ready
client.once(Events.ClientReady, clientBot => {
	console.log(`${getLogDate()} [bot-lg] INFO: Logged in as ${clientBot.user.tag}!`);
	clientBot.user.setPresence({ activities: [{ name: 'Loups-garous' }], status: 'online' })
});

// Execute commands
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`${getLogDate()} [bot-lg] ERROR: No command matching '${interaction.commandName}' was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'Une erreur est survenue lors de l\'exécution de la commande', ephemeral: true });
		} else {
			await interaction.reply({ content: 'Une erreur est survenue lors de l\'exécution de la commande', ephemeral: true });
		}
	}

})

// client.on("message", message => {
//     if (!message.content.startsWith(prefix)) return;

//     const args = message.content.slice(prefix.length).trim().split(/ +/);
//     const command = args.shift().toLowerCase();

//     if (!client.commands.has(command)) return;
//     message.delete();
//     try {
//         switch (command) {
//             case "commandes":
//                 message.reply("voici les commandes disponibles :");
//                 client.commands.forEach(command => {
//                     if (command.idRequiredRole === "None") {
//                         message.channel.send(`${command.name} : ${command.description}`);
//                     } else {
//                         if (hasRequiredRole(message, command.idRequiredRole)) {
//                             let requiredRoleName = message.channel.guild.roles.resolve(command.idRequiredRole).name;
//                             message.channel.send(`${command.name} : ${command.description} --- _Requiert le rôle ${requiredRoleName}_`);
//                         }
//                     }
//                 })
//                 break;

//             case "deconnexion":
//                 if (hasRequiredRole(message, client.commands.get(command).idRequiredRole)) {
//                     client.user.setPresence({ status: 'offline' })
//                     message.channel.send("Je me déconnecte, à bientôt !")
//                         .then(() => { client.destroy() });
//                 } else {
//                     message.reply("vous n'avez pas les droits nécessaires pour utiliser cette commande.");
//                 }
//                 break;

//             default:
//                 let objCommand = client.commands.get(command);
//                 if (objCommand.idRequiredRole === "None") {
//                     objCommand.execute(message, args);
//                 } else {
//                     if (hasRequiredRole(message, objCommand.idRequiredRole)) {
//                         objCommand.execute(message, args);
//                     } else {
//                         message.reply("vous n'avez pas les droits nécessaires pour utiliser cette commande.");
//                     }
//                 }
//                 break;
//         }
//     } catch (errorObject) {
//         console.error(errorObject.error);
//         message.reply(`un problème est survenu lors de l'exécution de la commande :\n${errorObject.message}`);
//     }
// });

// Log in
client.login(token);

// // Check if user has the required role to execute a command
// function hasRequiredRole(message, idRequiredRole) {
//     return message.member.roles.cache.has(idRequiredRole);
// }
