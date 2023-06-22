const cmdConfig = require("./cmd_config.json");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roles')
        .setDescription('Affiche les rôles et leurs membres dans le cannal "maitre-du-jeu"'),
    async execute(interaction) {
        // App is thinking
        await interaction.deferReply();

        // Retrieve players
        const vocalChannel = await interaction.guild.channels.fetch(cmdConfig.idVocalChannelMain);
        const playersInVocalChannel = vocalChannel.members.filter(user => !user.roles.resolve(cmdConfig.idRoleGameMaster));

        // Other variables
        const excludedRoleIds = cmdConfig.excludedRoleIds;
        const channelGameMaster = await interaction.guild.channels.fetch(cmdConfig.idTextChannelGameMaster);
        const roleCollection = await interaction.guild.roles.fetch();

        // Check if the user is the Game Master
        // If true, sends the entire list to the Game Master channel
        // If false, reply to the player with a truncated list of roles only
        if (roleCollection.get(cmdConfig.idRoleGameMaster).members.has(interaction.user.id)) {
            var channelToSend = channelGameMaster;
            var displayPlayerNames = true;
        } else {
            excludedRoleIds.push(cmdConfig.idRoleLovers);
            excludedRoleIds.push(cmdConfig.idRoleInfected);
            excludedRoleIds.push(cmdConfig.idRoleOiled);
            excludedRoleIds.push(cmdConfig.idRoleEnchanted);
            excludedRoleIds.push(cmdConfig.idRoleDead);
            var channelToSend = await interaction.guild.channels.fetch(interaction.channelId);
            var displayPlayerNames = false;
        }

        // Filter the role list to keep only the roles that have to be shown
        const roleCollectionFiltered = roleCollection.filter(role => -1 === excludedRoleIds.indexOf(role.id));

        // Check if there is at least one player
        if (0 === playersInVocalChannel.size) {
            await interaction.editReply('Il n\'y a aucun joueur actuellement');
        } else {
            // For each game role, display who are its members
            for await (const [roleId, role] of roleCollectionFiltered) {
                if (0 !== role.members.size) {
                    let message = `Rôle ${role.name}\n`;
                    for await (const [memberId, member] of role.members) {
                        if (displayPlayerNames && (playersInVocalChannel.has(memberId))) {
                            message += `> – ${member.nickname}\n`;
                        }
                    }
                    channelToSend.send(message);
                }
            }
            await interaction.editReply('Affichage terminé !');
        }
    }
}
