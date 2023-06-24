const cmdConfig = require('./cmd_config.json');
const { SlashCommandBuilder, Collection } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('assigner')
        .setDescription('Assigne le rôle spécifié à la ou les personnes spécifiées')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Le code du rôle à assigner')
                .setRequired(true)
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
        const _role = interaction.options.getRole('role');

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
            if (_role.id === cmdConfig.idRoleDead) {
                const rolesToKeepCollection = new Collection();
                for (const roleId of excludedRoleIds) {
                    const roleToKeep = await userRoleManager.resolve(roleId);
                    if (null !== roleToKeep) {
                        rolesToKeepCollection.set(roleId, roleToKeep);
                    }
                }
                await userRoleManager.set(rolesToKeepCollection);
                console.log(`[assigner] Removed all roles from ${user.user.username} but the ones to keep`);
            }
            await userRoleManager.add(_role);
            console.log(`[assigner] Added role '${_role.name}' to user '${user.user.username}'`);
        }
        await interaction.editReply('Le rôle a bien été ajouté aux joueurs');
    }
};
