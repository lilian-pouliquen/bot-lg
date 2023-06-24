const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nettoyer')
        .setDescription('Efface tous les messages non épinglés du salon actuel'),
    async execute(interaction) {
        // App is thinking
        await interaction.reply('Suppression des messages en cours');

        // Delete all unpinned messages
        let messagesToDelete;
        do {
            const fetched = await interaction.channel.messages.fetch({ limit: 100 });
            messagesToDelete = fetched.filter(message => !message.pinned);
            interaction.channel.bulkDelete(messagesToDelete, true);
            console.log(`[nettoyer] Deleted ${messagesToDelete.size} messages in the channel '${interaction.channel.name}'`);
        }
        while (messagesToDelete.size >= 2);
        console.log(`[nettoyer] Removed all unpinned messages from the channel '${interaction.channel.name}'`);
    }
}
