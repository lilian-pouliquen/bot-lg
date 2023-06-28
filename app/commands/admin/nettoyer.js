const { createLog } = require('../../functions');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('nettoyer')
    .setDescription('Efface tous les messages non épinglés du salon actuel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        // Answer to the user
        await interaction.reply('Suppression des messages en cours');

        // Delete all unpinned messages
        let messagesToDelete;
        do {
            const fetched = await interaction.channel.messages.fetch({ limit: 100 });
            messagesToDelete = fetched.filter(message => !message.pinned);
            await interaction.channel.bulkDelete(messagesToDelete, true);
            createLog(interaction.guild.id, interaction.commandName, 'info', `Messages being deleted ${messagesToDelete.size} in the channel '${interaction.channel.name}'`);
        }
        while (messagesToDelete.size >= 2);
        createLog(interaction.guild.id, interaction.commandName, 'info', `Removed all unpinned messages from the channel '${interaction.channel.name}'`)
    }
}
