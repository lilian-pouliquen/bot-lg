const cmdConfig = require('../cmd_config.json');
const { createLog } = require('../../functions');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    requiredRoleId: cmdConfig.idRoleAdmin,
    data: new SlashCommandBuilder()
        .setName('nettoyer')
        .setDescription('Efface tous les messages non épinglés du salon actuel')
        .setDefaultMemberPermissions(2147560448),
    async execute(interaction) {
        // Answer to the user
        await interaction.reply('Suppression des messages en cours');

        // Delete all unpinned messages
        let messagesToDelete;
        do {
            const fetched = await interaction.channel.messages.fetch({ limit: 100 });
            messagesToDelete = fetched.filter(message => !message.pinned);
            await interaction.channel.bulkDelete(messagesToDelete, true);
            createLog(interaction.guild.id, 'nettoyer', 'info', `Messages being deleted ${messagesToDelete.size} in the channel '${interaction.channel.name}'`);
        }
        while (messagesToDelete.size >= 2);
        createLog(interaction.guild.id, 'nettoyer', 'info', `Removed all unpinned messages from the channel '${interaction.channel.name}'`)
    }
}
