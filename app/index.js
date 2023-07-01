const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits } = require('discord.js');

const { createLog } = require('./functions');
const { getLocalisedString } = require('./localisation')
const { token } = require('./config.json');
const mongodb = require('./models');

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
            createLog('global', 'bot-lg', 'warn', `The command at ${filePath} is missing a required "data" or "execute" property`);
        }
    }
}

// Log in when client is ready
// If server config
client.once(Events.ClientReady, clientBot => {
    createLog('global', 'bot-lg', 'info', `Logged in as '${clientBot.user.tag}'`);
    clientBot.user.setPresence({ activities: [{ name: 'Loups-garous' }], status: 'online' })
});

// Execute commands
client.on(Events.InteractionCreate, async interaction => {
    // If server config does not exist
    let serverConfig = await mongodb.findOne({_id: interaction.guild.id});
    if (null === serverConfig) {
        serverConfig = {_id: interaction.guild.id ,isInitialised: false, locale: "fr"};
        await mongodb.insertOne(serverConfig);
        createLog(interaction.guild.id, interaction.commandName, 'info', 'Inserted server config in database with \'IsInitialised\' key to \'false\' and \'locale\' key to \'fr\'');
    }

    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    // check if the command exists
    if (!command) {
        createLog('global', 'bot-lg', 'error', `No command matching '${interaction.commandName}' was found in server '${interaction.guild.name}'`);
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
