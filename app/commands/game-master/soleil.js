const cmdConfig = require("./cmd_config.json");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('soleil')
        .setDescription('Rend les joueurs muets ou non, pour le jour ou la nuit')
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

        // Check which subcommand has been chosen
        // If se_leve, unmute all players
        // If se_couche, mute them all
        let message = '';
        switch (_subcommand) {
            case 'se_leve':
                message = 'Le soleil s\'est levé !';
                for await (const [idPlayer, player] of playersInVocalChannel) {
                    player.roles.remove(cmdConfig.idRoleMuted);
                    player.voice.setMute(false);
                }
                break;
            case 'se_couche':
                message = 'Le soleil s\'est couché !';
                for await (const [idPlayer, player] of playersInVocalChannel) {
                    player.roles.add(cmdConfig.idRoleMuted);
                    player.voice.setMute(true);
                }
                break;
        }
        await interaction.editReply(`${message}`);
    }
}
