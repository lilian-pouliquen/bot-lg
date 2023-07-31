const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

const mongodb = require("../../models");
const { createLog, userHasRole } = require("../../functions");
const { getLocalisedString } = require("../../localisation");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("terminer")
        .setDescription("Enlève tous les rôles des joueurs pour terminer la partie")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles | PermissionFlagsBits.SendMessages | PermissionFlagsBits.UseApplicationCommands),
    async execute(interaction) {
        // App is thinking
        await interaction.deferReply();

        // Get server config from database and get locale
        const serverConfig = await mongodb.findOne({_id: interaction.guild.id});
        const locale = serverConfig.locale;

        //Check if user has the required role
        const requiredRole = await interaction.guild.roles.fetch(serverConfig.roleGameMasterId);
        if (! await userHasRole(interaction, requiredRole.id)) {
            await interaction.editReply(getLocalisedString(locale, "user_does_not_have_required_role", requiredRole.name));
            createLog(interaction.guild.id, interaction.commandName, "error", `User '${interaction.member.user.username}' does not have the required role to execute '${interaction.commandName}': '${requiredRole.name}'`);
            return;
        }

        // Retrieve players
        const voiceChannel = await interaction.guild.channels.fetch(serverConfig.voiceChannelGameId);
        const playersInVocalChannel = voiceChannel.members.filter(user => !user.roles.resolve(serverConfig.roleGameMasterId));

        // Remove all game roles
        for await (const user of playersInVocalChannel.values()) {
            const userRoleManager = user.roles;
            const rolesToKeepMap = new Map();
            for (const roleId of serverConfig.excludedRoleIds) {
                const roleToKeep = await userRoleManager.resolve(roleId);
                if (null !== roleToKeep) {
                    rolesToKeepMap.set(roleId, roleToKeep);
                }
            }
            await userRoleManager.set(rolesToKeepMap);
            createLog(interaction.guild.id, interaction.commandName, "info", `Removed all game roles from user '${user.user.username}'`);
        }
        await interaction.editReply(getLocalisedString(locale, "player_roles_withdrawn"));
    }
};
