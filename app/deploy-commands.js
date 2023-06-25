const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');
const { getLogDate } = require('./functions');
const { clientId, guildId, token } = require('./config.json');

// Load commands
const commands = [];
const commandFoldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandFoldersPath).filter(folder => fs.statSync(path.join(commandFoldersPath, folder)).isDirectory());

for (const folder of commandFolders) {
	const commandsPath = path.join(commandFoldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`${getLogDate()} WARNING: The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Deploy commands via REST API
const rest = new REST().setToken(token);
(async () => {
	try {
		console.log(`${getLogDate()} INFO: Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`${getLogDate()} INFO: Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();
