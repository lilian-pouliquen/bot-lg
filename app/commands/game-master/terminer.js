const { createLog, userHasRole } = require('../../functions');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('terminer')
        .setDescription('Termine la partie en retirant tous les rôles de jeu des joueurs')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles | PermissionFlagsBits.SendMessages | PermissionFlagsBits.UseApplicationCommands),
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
        const voiceChannel = await interaction.guild.channels.fetch(serverConfig.voiceChannelGameId);
        const playersInVocalChannel = voiceChannel.members.filter(user => !user.roles.resolve(serverConfig.roleGameMasterId));

        // Remove all game roles
        for await (const [idUser, user] of playersInVocalChannel) {
            const userRoleManager = user.roles;
            const rolesToKeepMap = new Map();
            for (const roleId of serverConfig.excludedRoleIds) {
                const roleToKeep = await userRoleManager.resolve(roleId);
                if (null !== roleToKeep) {
                    rolesToKeepMap.set(roleId, roleToKeep);
                }
            }
            await userRoleManager.set(rolesToKeepMap);
            createLog(interaction.guild.id, interaction.commandName, 'info', `Removed all game roles from user '${user.user.username}'`);
        }
        await interaction.editReply('Les rôles des joueurs ont été retirés');
    }
}
