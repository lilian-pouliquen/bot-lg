const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const mongodb = require('../../models');
const { userHasRole, createLog } = require('../../functions');
const { getLocalisedString } = require('../../localisation');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('roles')
    .setDescription('Affiche les rôles encore en vie')
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.EmbedLinks | PermissionFlagsBits.UseApplicationCommands),
    async execute(interaction) {
        // App is thinking
        await interaction.deferReply();

        // Get server config from database and get locale
        const serverConfig = await mongodb.findOne({_id: interaction.guild.id});
        const locale = serverConfig.locale;

        // Retrieve players
        const voiceChannel = await interaction.guild.channels.fetch(serverConfig.voiceChannelGameId);
        const playersInVocalChannel = voiceChannel.members.filter(user => null === user.roles.resolve(serverConfig.roleGameMasterId));

        // Other variables
        const excludedRoleIds = serverConfig.excludedRoleIds;
        const channelGameMaster = await interaction.guild.channels.fetch(serverConfig.textChannelGameMasterId);
        const roleCollection = await interaction.guild.roles.fetch();

        // Check if the user is the Game Master
        // If true, sends the list of still alive roles with their members to the Game Master channel
        // If false, reply to the player with a truncated list of roles only
        if (await userHasRole(interaction, serverConfig.roleGameMasterId)) {
            var channelToSend = channelGameMaster;
            var displayPlayerNames = true;
        } else {
            excludedRoleIds.push(serverConfig.roleLoversId);
            excludedRoleIds.push(serverConfig.roleInfectedId);
            excludedRoleIds.push(serverConfig.roleOiledId);
            excludedRoleIds.push(serverConfig.roleEnchantedId);
            excludedRoleIds.push(serverConfig.roleDeadId);
            var channelToSend = await interaction.guild.channels.fetch(interaction.channelId);
            var displayPlayerNames = false;
        }

        // Filter the role list to keep only the roles that have to be shown
        const roleCollectionFiltered = roleCollection.filter(role => -1 === excludedRoleIds.indexOf(role.id));

        // Check if there is at least one player
        if (0 === playersInVocalChannel.size) {
            createLog(interaction.guild.id, interaction.commandName, 'info', 'No player in the main vocal channel');
            await interaction.editReply(getLocalisedString(locale, 'no_player'));
        } else {
            const roleFieldsArray = [];
            // For each game role, display who are its members
            for await (const [roleId, role] of roleCollectionFiltered) {
                if (0 !== role.members.size) {
                    let message = '.\n';
                    for await (const [memberId, member] of role.members) {
                        if (displayPlayerNames && (playersInVocalChannel.has(memberId))) {
                            message += `> – ${member.nickname ?? member.user.username}\n`;
                        }
                    }
                    roleFieldsArray.push({ name: role.name, value: message, inline: true });
                }
            }
            const embedFields = 0 < roleFieldsArray.size ? roleFieldsArray : [{ name: 'Aucun', value: getLocalisedString(locale, 'no_player'), inline: true }];
            embedMessage = new EmbedBuilder()
                .setColor('#4A03C3')
                .setTitle('roles')
                .setDescription(getLocalisedString(locale, 'still_alive_role_list'))
                .addFields(embedFields);

            await channelToSend.send({ embeds: [embedMessage]});
            if (displayPlayerNames) {
                createLog(interaction.guild.id, interaction.commandName, 'info', `Listed all alive roles and their players in the channel '${channelToSend.name}'`);
            } else {
                createLog(interaction.guild.id, interaction.commandName, 'info', `Listed truncated alive roles in the channel '${channelToSend.name}'`);
            }
            await interaction.editReply(getLocalisedString(locale, 'done_displaying'));
        }
    }
}
