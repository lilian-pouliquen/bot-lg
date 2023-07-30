const fs = require("node:fs");
const path = require("node:path");
const { REST, Routes } = require("discord.js");
const { createLog } = require("./functions");
const { clientId, guildId, token } = require("./config.json");

// Load commands
const commands = [];
const commandFoldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(commandFoldersPath).filter(folder => fs.statSync(path.join(commandFoldersPath, folder)).isDirectory());

for (const folder of commandFolders) {
    const commandsPath = path.join(commandFoldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ("data" in command && "execute" in command) {
            commands.push(command.data.toJSON());
        } else {
            createLog("global", "load-commands", "warn", `The command at ${filePath} is missing a required "data" or "execute" property`);
        }
    }
}

// Deploy commands via REST API
const rest = new REST().setToken(token);
(async () => {
    try {
        const deployGlobal = process.argv[2] ?? false;
        const route = deployGlobal ? Routes.applicationCommands(clientId) : Routes.applicationGuildCommands(clientId, guildId);
        const where = deployGlobal ? "in all servers" : `in server '${guildId}'`;
        createLog("global", "deploy-commands", "info", `Started refreshing ${commands.length} application commands ${where}`);

        const data = await rest.put(
            route,
            { body: commands },
        );
        createLog("global", "deploy-commands", "info", `Successfully reloaded ${data.length} application commands ${where}`);
    } catch (error) {
        console.error(error);
        createLog("global", "deploy-commands", "error", error);
    }
})();
