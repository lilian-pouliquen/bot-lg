const { createLog, userHasRole } = require('../../functions');
const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('assigner')
        .setDescription('Assigne le rôle spécifié à la ou les personnes spécifiées')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles | PermissionFlagsBits.SendMessages | PermissionFlagsBits.UseApplicationCommands)
        .addStringOption(option =>
            option.setName('role')
                .setDescription('Le rôle à assigner')
                .setRequired(true)
                .setChoices(
                    { name: 'Amoureux', value: 'lovers' },
                    { name: 'Envouté', value: 'enchanted' },
                    { name: 'Imbibé', value: 'oiled' },
                    { name: 'Infecté', value: 'infected' },
                    { name: 'Mort', value: 'dead' }
                )
        )
        .addUserOption(option =>
            option.setName('utilisateur1')
                .setDescription('Le joueur à qui assigner le rôle')
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName('utilisateur2')
                .setDescription('(facultatif) Un autre joueur à qui assigner le rôle')
        )
        .addUserOption(option =>
            option.setName('utilisateur3')
                .setDescription('(facultatif) Un autre joueur à qui assigner le rôle')
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

        // Retrieve role
        const _roleLabel = interaction.options.getString('role');
        let roleId = '';
        switch (_roleLabel) {
            case 'lovers':
                roleId = serverConfig.roleLoversId;
                break;
            case 'enchanted':
                roleId = serverConfig.roleEnchantedId;
                break;
            case 'infected':
                roleId = serverConfig.roleInfectedId;
                break;
            case 'dead':
                roleId = serverConfig.roleDeadId;
                break;
        }
        const role = await interaction.guild.roles.fetch(roleId);

        // Retrieve users
        const iterable = [1, 2, 3];
        const userRoleManagerByUser = new Map();
        for await (i of iterable) {
            const _user = interaction.options.getUser(`utilisateur${i}`);
            if (_user) {
                const user = await interaction.guild.members.fetch(_user.id);
                const userRoleManager = user.roles;
                userRoleManagerByUser.set(user, userRoleManager);
            }
        }

        // Retrieving config's exluded roles and adding "Reaper" to it
        const excludedRoleIds = serverConfig.excludedRoleIds;
        excludedRoleIds.push(serverConfig.roleReaperId);

        // Check if the role is "Dead"
        // If true, remove all game roles
        // Then add the wanted role
        for await (const [user, userRoleManager] of userRoleManagerByUser) {
            if (role.id === serverConfig.roleDeadId) {
                const rolesToKeepMap = new Map();
                for (const roleId of excludedRoleIds) {
                    const roleToKeep = await userRoleManager.resolve(roleId);
                    if (null !== roleToKeep) {
                        rolesToKeepMap.set(roleId, roleToKeep);
                    }
                }
                await userRoleManager.set(rolesToKeepMap);
                createLog(interaction.guild.id, interaction.commandName, 'info', `Removed all roles from user '${user.user.username}' but the ones to keep`);
            }
            await userRoleManager.add(role);
            createLog(interaction.guild.id, interaction.commandName, 'info', `Added role '${role.name}' to user '${user.user.username}'`);
        }
        await interaction.editReply('Le rôle a bien été ajouté aux joueurs');
    }
};
