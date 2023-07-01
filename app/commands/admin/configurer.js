const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const mongodb = require('../../models');
const { createLog } = require('../../functions');
const { getLocalisedString } = require('../../localisation');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('configurer')
        .setDescription('Configure Bot-lg')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
            subcommand.setName('afficher')
                .setDescription('Afficher la configuration actuelle de Bot-lg')
        )
        .addSubcommand(subcommand =>
            subcommand.setName('langue')
                .setDescription('Configurer la langue de Bot-lg')
                .addStringOption(option =>
                    option.setName('langue')
                        .setDescription('Configurer la langue de Bot-lg')
                        .setRequired(true)
                        .setChoices(
                            { name: 'Français (défaut)', value: 'fr' },
                            { name: 'English', value: 'en' }
                        )
                )
        ),
    async execute(interaction) {
        // Get server config from database and get locale
        const serverConfig = await mongodb.findOne({ _id: interaction.guild.id });
        const locale = serverConfig.locale;

        // Retrieve subcommand
        const _subcommand = interaction.options.getSubcommand();

        switch (_subcommand) {
            case 'afficher':
                let message = '';
                const serverConfigMap = new Map(Object.entries(serverConfig));
                const globalConfigs = new Map([...serverConfigMap].filter(([key, value]) => (!key.toLocaleLowerCase().includes('channel')) && (!key.toLocaleLowerCase().includes('role'))));
                const channelConfigs = new Map([...serverConfigMap].filter(([key, value]) => key.toLocaleLowerCase().includes('channel')));
                const roleConfigs = new Map([...serverConfigMap].filter(([key, value]) => key.toLocaleLowerCase().includes('role')));

                message = getLocalisedString(locale, 'configuration_display_global');
                message += getMessageConfig(globalConfigs);
                await interaction.reply({ content: message, ephemeral: true });

                message = getLocalisedString(locale, 'configuration_display_channels');
                message += getMessageConfig(channelConfigs);
                await interaction.followUp({ content: message, ephemeral: true });

                message = getLocalisedString(locale, 'configuration_display_roles');
                message += getMessageConfig(roleConfigs);
                await interaction.followUp({ content: message, ephemeral: true });

                createLog(interaction.guild.id, interaction.commandName, 'info', `Displayed configuration for server ${interaction.guild.id}`);
                break;
            case 'langue':
                const language = interaction.options.getString('langue');
                serverConfig.locale = language;

                await mongodb.updateOne({ _id: interaction.guild.id }, { $set: serverConfig });
                await interaction.reply({ content: getLocalisedString(serverConfig.locale, 'configuration_change_language', serverConfig.locale), ephemeral: true });
                createLog(interaction.guild.id, interaction.commandName, 'info', `Set 'locale' key to '${serverConfig.locale}' on server ${interaction.guild.id}`);
                break;
        }
    }
}

function getMessageConfig(_map) {
    let message = '```text\n';
    for (const [key, value] of _map) {
        message += `– ${key}: ${value}\n`;
    }
    message += '```'
    return message;
}
