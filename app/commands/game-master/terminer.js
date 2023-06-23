const cmdConfig = require("./cmd_config.json");
const { SlashCommandBuilder, Collection } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('terminer')
        .setDescription('Termine la partie en retirant tous les rôles de jeu des joueurs'),
    async execute(interaction) {
        // App is thinking
        await interaction.deferReply();

        // Retrieve players
        const vocalChannel = await interaction.guild.channels.fetch(cmdConfig.idVocalChannelMain);
        const playersInVocalChannel = vocalChannel.members.filter(user => !user.roles.resolve(cmdConfig.idRoleGameMaster));

        // Remove all game roles
        for await (const [idUser, user] of playersInVocalChannel) {
            const userRoleManager = user.roles;
            const rolesToKeepCollection = new Collection();
            for (const roleId of cmdConfig.excludedRoleIds) {
                const roleToKeep = await userRoleManager.resolve(roleId);
                if (null !== roleToKeep) {
                    rolesToKeepCollection.set(roleId, roleToKeep);
                }
            }
            await userRoleManager.set(rolesToKeepCollection);
            console.log(`Removed all game roles from ${user.user.username}.`);
        }
        await interaction.editReply('Les rôles des joueurs ont été retirés');
    }
}
