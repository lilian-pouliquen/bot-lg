const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits } = require('discord.js');

const mongodb = require('./models');
const { createLog } = require('./functions');
const { getLocalisedString } = require('./localisation')
const { token } = require('./config.json');

// Initialise client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// Load commands
client.commands = new Map();
const commandFoldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandFoldersPath).filter(folder => fs.statSync(path.join(commandFoldersPath, folder)).isDirectory());

for (const folder of commandFolders) {
    const commandsPath = path.join(commandFoldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            createLog('global', 'load-commands', 'warn', `The command at ${filePath} is missing a required "data" or "execute" property`);
        }
    }
}

// Log in when client is ready
// If server config
client.once(Events.ClientReady, clientBot => {
    createLog('global', 'connect', 'info', `Logged in as '${clientBot.user.tag}'`);
    clientBot.user.setPresence({ activities: [{ name: 'Loups-garous' }], status: 'online' })
});

// Add a role to excluded roles when added to the server
client.on(Events.GuildRoleCreate, async role => {
    // If server config does not exist, insert it into database
    let serverConfig = await mongodb.findOne({ _id: role.guild.id });
    if (null === serverConfig) {
        serverConfig = { _id: role.guild.id, isInitialised: false, locale: "fr" };
        await mongodb.insertOne(serverConfig);
        createLog('global', 'create-role', 'info', 'Inserted server config in database with \'IsInitialised\' key to \'false\' and \'locale\' key to \'fr\'');
    }

    // Check if server is inititialised, add the new role id to the excluded role ids list
    if (serverConfig.isInitialised) {
        serverConfig.excludedRoleIds.push(role.id);
        mongodb.updateOne({ _id: role.guild.id }, { $set: serverConfig });
        createLog('global', 'create-role', 'info', `Added '${role.id}' in the list of excluded roles`);
    } else {
        createLog('global', 'create-role', 'warn', `The server is not initialised, cannot add '${role.id}' in the list of excluded roles`);
    }
});

// Delete role from excluded roles when deleted from the server
client.on(Events.GuildRoleDelete, async role => {
    // If server config does not exist, insert it into database
    let serverConfig = await mongodb.findOne({ _id: role.guild.id });
    if (null === serverConfig) {
        serverConfig = { _id: role.guild.id, isInitialised: false, locale: "fr" };
        await mongodb.insertOne(serverConfig);
        createLog('global', 'delete-role', 'info', 'Inserted server config in database with \'IsInitialised\' key to \'false\' and \'locale\' key to \'fr\'');
    }

    // Check if server is inititialised, delete the role id from the excluded role ids list
    if (serverConfig.isInitialised) {
        serverConfig.excludedRoleIds = serverConfig.excludedRoleIds.filter(id => id !== role.id);
        mongodb.updateOne({ _id: role.guild.id }, { $set: serverConfig });
        createLog('global', 'delete-role', 'info', `Deleted '${role.id}' from the list of excluded roles`);
    } else {
        createLog('global', 'delete-role', 'warn', `The server is not initialised, cannot delete '${role.id}' from the list of excluded roles`);
    }
});


// Execute commands
client.on(Events.InteractionCreate, async interaction => {
    // If server config does not exist, insert it into database
    let serverConfig = await mongodb.findOne({ _id: interaction.guild.id });
    if (null === serverConfig) {
        serverConfig = { _id: interaction.guild.id, isInitialised: false, locale: "fr" };
        await mongodb.insertOne(serverConfig);
        createLog(interaction.guild.id, interaction.commandName, 'info', 'Inserted server config in database with \'IsInitialised\' key to \'false\' and \'locale\' key to \'fr\'');
    }

    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    // check if the command exists
    if (!command) {
        createLog('global', 'execute-command', 'error', `No command matching '${interaction.commandName}' was found in server '${interaction.guild.name}'`);
        return;
    }

    // Get locale
    const locale = serverConfig.locale;

    // Execute the command
    try {
        await command.execute(interaction);
    } catch (error) {
        console.log(error)
        createLog(interaction.guild.id, interaction.commandName, 'error', error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: getLocalisedString(locale, 'command_error'), ephemeral: true });
        } else {
            await interaction.reply({ content: getLocalisedString(locale, 'command_error'), ephemeral: true });
        }
    }

});

// Log in
client.login(token);
