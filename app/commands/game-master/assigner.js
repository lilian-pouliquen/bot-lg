const { Collection } = require("discord.js");
const cmdConfig = require("./cmd_config.json");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('assigner')
        .setDescription('Assigne le rôle spécifié à la personne spécifiée')
        .addRoleOption(option =>
            option.setName('role')
                .setDescription('Le code du role à assigner')
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName('utilisateur1')
                .setDescription('Le joueur à qui assigner le rôle')
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName('utilisateur2')
                .setDescription('(facultatif) Un joueur à qui assigner le rôle')
                .setRequired(true)
        )
        .addUserOption(option =>
            option.setName('utilisateur3')
                .setDescription('(facultatif) Un joueur à qui assigner le rôle')
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

        const excludedRoleIds = [
            cmdConfig.idRoleAdmin,
            cmdConfig.idRoleGameMaster,
            cmdConfig.idRoleEveryone
        ];

        // For each user
        for await (const [user, userRoleManager] of userRoleManagerByUser) {
            // Removing all game roles if role is "Dead"
            if ((_role.id === cmdConfig.idRoleDead) && (null === await userRoleManager.resolve(cmdConfig.idRoleReaper))) {
                const rolesToKeepCollection = new Collection();
                for (const roleId of excludedRoleIds) {
                    const roleToKeep = await userRoleManager.resolve(roleId);
                    if (null !== roleToKeep) {
                        rolesToKeepCollection.set(roleId, roleToKeep)
                    }
                }
                await userRoleManager.set(rolesToKeepCollection);
                console.log(`Removed all roles from ${user.user.username} but the ones to keep.`)
            }
            // Adding role to the user
            await userRoleManager.add(_role);
            console.log(`Added role ${_role.name} to user ${user.user.username}`);
        }
        await interaction.editReply(`Le rôle ${_role.name} a bien été ajouté aux joueurs`);
    }
};
