const cmdConfig = require('../cmd_config.json');
const { createLog } = require('../../functions');
const { SlashCommandBuilder, Collection } = require('discord.js');

module.exports = {
    requiredRoleId: cmdConfig.idRoleGameMaster,
    data: new SlashCommandBuilder()
        .setName('assigner')
        .setDescription('Assigne le rôle spécifié à la ou les personnes spécifiées')
        .setDefaultMemberPermissions(2415921152)
        .addStringOption(option =>
            option.setName('role')
                .setDescription('Le rôle à assigner')
                .setRequired(true)
                .setChoices(
                    { name: 'Amoureux', value: cmdConfig.idRoleLovers },
                    { name: 'Envouté', value: cmdConfig.idRoleEnchanted },
                    { name: 'Imbibé', value: cmdConfig.idRoleOiled },
                    { name: 'Infecté', value: cmdConfig.idRoleInfected },
                    { name: 'Mort', value: cmdConfig.idRoleDead }
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

        // Retrieve role
        const _roleId = interaction.options.getString('role');
        const role = await interaction.guild.roles.fetch(_roleId);

        // Retrieve users
        const iterable = [1, 2, 3];
        const userRoleManagerByUser = new Collection();
        for await (i of iterable) {
            const _user = interaction.options.getUser(`utilisateur${i}`);
            if (_user) {
                const user = await interaction.guild.members.fetch(_user.id);
                const userRoleManager = user.roles;
                userRoleManagerByUser.set(user, userRoleManager);
            }
        }

        // Retrieving config's exluded roles and adding "Reaper" to it
        const excludedRoleIds = cmdConfig.excludedRoleIds;
        excludedRoleIds.push(cmdConfig.idRoleReaper);

        // Check if the role is "Dead"
        // If true, remove all game roles
        // Then add the wanted role
        for await (const [user, userRoleManager] of userRoleManagerByUser) {
            if (role.id === cmdConfig.idRoleDead) {
                const rolesToKeepCollection = new Collection();
                for (const roleId of excludedRoleIds) {
                    const roleToKeep = await userRoleManager.resolve(roleId);
                    if (null !== roleToKeep) {
                        rolesToKeepCollection.set(roleId, roleToKeep);
                    }
                }
                await userRoleManager.set(rolesToKeepCollection);
                createLog(interaction.guild.id, 'assigner', 'info', `Removed all roles from user '${user.user.username}' but the ones to keep`);
            }
            await userRoleManager.add(role);
            createLog(interaction.guild.id, 'assigner', 'info', `Added role '${role.name}' to user '${user.user.username}'`);
        }
        await interaction.editReply('Le rôle a bien été ajouté aux joueurs');
    }
};
