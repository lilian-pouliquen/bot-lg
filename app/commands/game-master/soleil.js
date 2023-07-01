const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const mongodb = require('../../models');
const { createLog, userHasRole } = require('../../functions');
const { getLocalisedString } = require('../../localisation');

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

        // Get server config from database and get locale
        const serverConfig = await mongodb.findOne({_id: interaction.guild.id});
        const locale = serverConfig.locale;

        //Check if user has the required role
        const requiredRole = await interaction.guild.roles.fetch(serverConfig.roleGameMasterId);
        if (! await userHasRole(interaction, requiredRole.id)) {
            await interaction.editReply(getLocalisedString(locale, 'user_does_not_have_required_role', requiredRole.name));
            createLog(interaction.guild.id, interaction.commandName, 'error', `User '${interaction.member.user.username}' does not have the required role to execute '${interaction.commandName}': '${requiredRole.name}'`);
            return;
        }

        // Retrieve players
        const voiceChannel = await interaction.guild.channels.fetch(serverConfig.voiceChannelGameId);
        const playersInVocalChannel = voiceChannel.members.filter(user => !user.roles.resolve(serverConfig.roleGameMasterId));

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
                    messageReply = getLocalisedString(locale, 'sun_rises');
                    messageLog = 'Unmuted all players';
                    for await (const [idPlayer, player] of playersInVocalChannel) {
                        player.roles.remove(serverConfig.roleMutedId);
                        player.voice.setMute(false);
                    }
                    createLog(interaction.guild.id, interaction.commandName, 'info', 'Unmuted all players');
                    break;
                case 'se_couche':
                    messageReply = getLocalisedString(locale, 'sun_sets');
                    messageLog = 'Muted all players';
                    for await (const [idPlayer, player] of playersInVocalChannel) {
                        player.roles.add(serverConfig.roleMutedId);
                        player.voice.setMute(true);
                    }
                    break;
            }
            createLog(interaction.guild.id, interaction.commandName, 'info', messageLog);
            await interaction.editReply(message);
        } else {
            createLog(interaction.guild.id, interaction.commandName, 'info', 'No player in the main vocal channel');
            await interaction.editReply(getLocalisedString(locale, 'no_player'));
        }
    }
}
