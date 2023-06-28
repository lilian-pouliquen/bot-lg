const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');
const { createLog } = require('./functions');
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
			createLog('global', 'bot-lg', 'warn', `The command at ${filePath} is missing a required "data" or "execute" property`);
		}
	}
}

// Delete commands via REST API
const rest = new REST().setToken(token);
(async () => {
	try {
		createLog('global', 'bot-lg', 'info', `Started deleting ${commands.length} application commands for server '${guildId}'`);
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: [] }
		);
		createLog('global', 'bot-lg', 'info', `Successfully deleted ${data.length} application commands for server '${guildId}'`);
	} catch (error) {
		console.error(error);
		createLog('global', 'bot-lg', 'error', error);
	}
})();
