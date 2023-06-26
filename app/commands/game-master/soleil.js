const cmdConfig = require('../cmd_config.json');
const { createLog } = require('../../functions');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    requiredRoleId: cmdConfig.idRoleGameMaster,
    data: new SlashCommandBuilder()
        .setName('soleil')
        .setDescription('Rend les joueurs muets ou non, pour le jour ou la nuit')
        .setDefaultMemberPermissions(2420115456)
        .addSubcommand(subcommand =>
            subcommand
                .setName('se_leve')
                .setDescription('Le soleil se lève : les joueurs peuvent débattre')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('se_couche')
                .setDescription('Le soleil se couche : les joueurs sont rendus muets')
        ),
    async execute(interaction) {
        // App is thinking
        await interaction.deferReply();

        // Retrieve players
        const vocalChannel = await interaction.guild.channels.fetch(cmdConfig.idVocalChannelMain);
        const playersInVocalChannel = vocalChannel.members.filter(user => !user.roles.resolve(cmdConfig.idRoleGameMaster));

        // Retrieve subcommand
        const _subcommand = interaction.options.getSubcommand();

        // If there are players, check which subcommand has been chosen
        // If se_leve, unmute all players
        // If se_couche, mute them all
        let messageReply = '';
        let messageLog = '';
        if (0 < playersInVocalChannel.size) {
            switch (_subcommand) {
                case 'se_leve':
                    messageReply = 'Le soleil s\'est levé !';
                    messageLog = 'Unmuted all players';
                    for await (const [idPlayer, player] of playersInVocalChannel) {
                        player.roles.remove(cmdConfig.idRoleMuted);
                        player.voice.setMute(false);
                    }
                    createLog(interaction.guild.id, 'soleil', 'info', 'Unmuted all players');
                    break;
                case 'se_couche':
                    messageReply = 'Le soleil s\'est couché !';
                    messageLog = 'Muted all players';
                    for await (const [idPlayer, player] of playersInVocalChannel) {
                        player.roles.add(cmdConfig.idRoleMuted);
                        player.voice.setMute(true);
                    }
                    break;
            }
            createLog(interaction.guild.id, 'soleil', 'info', messageLog);
            await interaction.editReply(message);
        } else {
            createLog(interaction.guild.id, 'soleil', 'info', 'No player in the main vocal channel');
            await interaction.editReply('Il n\'y a aucun joueur actuellement');
        }
    }
}
