const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const mongodb = require('../../models');
const { createLog } = require('../../functions');
const { getLocalisedString } = require('../../localisation');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('nettoyer')
    .setDescription('Efface tous les messages non épinglés du salon actuel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        // Get server config from databaseang get locale
        const serverConfig = await mongodb.findOne({_id: interaction.guild.id});
        const locale = serverConfig.locale;

        // Answer to the user
        await interaction.reply(getLocalisedString(locale, 'deleting_messages'));

        // Delete all unpinned messages
        let messagesToDelete;
        do {
            const fetched = await interaction.channel.messages.fetch({ limit: 100 });
            messagesToDelete = fetched.filter(message => !message.pinned);
            await interaction.channel.bulkDelete(messagesToDelete, true);
            createLog(interaction.guild.id, interaction.commandName, 'info', `Messages being deleted ${messagesToDelete.size} in the channel '${interaction.channel.name}'`);
        }
        while (messagesToDelete.size >= 2);
        createLog(interaction.guild.id, interaction.commandName, 'info', `Removed all unpinned messages from the channel '${interaction.channel.name}'`);
    }
}
