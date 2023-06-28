const { createLog, userHasRole } = require('../../functions');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('soleil')
        .setDescription('Rend les joueurs muets ou non, pour le jour ou la nuit')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles | PermissionFlagsBits.SendMessages | PermissionFlagsBits.UseApplicationCommands | PermissionFlagsBits.MuteMembers)
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

        // Import server config
        const serverConfig = require(`../../config/${interaction.guild.id}/server_config.json`);

        //Check if user has the required role
        const requiredRole = await interaction.guild.roles.fetch(serverConfig.roleGameMasterId);
        if (! await userHasRole(interaction, requiredRole.id)) {
            await interaction.editReply(`Vous n\'avez pas le rôle nécessaire pour exécuter cette commande : \`${requiredRole.name}\``);
            createLog(interaction.guild.id, interaction.commandName, 'error', `User '${interaction.member.user.username}' does not have the required role to execute '${interaction.commandName}': '${requiredRole.name}'`);
            return;
        }

        // Retrieve players
        const vocalChannel = await interaction.guild.channels.fetch(serverConfig.vocalChannelGameId);
        const playersInVocalChannel = vocalChannel.members.filter(user => !user.roles.resolve(serverConfig.roleGameMasterId));

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
                        player.roles.remove(serverConfig.roleMutedId);
                        player.voice.setMute(false);
                    }
                    createLog(interaction.guild.id, 'soleil', 'info', 'Unmuted all players');
                    break;
                case 'se_couche':
                    messageReply = 'Le soleil s\'est couché !';
                    messageLog = 'Muted all players';
                    for await (const [idPlayer, player] of playersInVocalChannel) {
                        player.roles.add(serverConfig.roleMutedId);
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
