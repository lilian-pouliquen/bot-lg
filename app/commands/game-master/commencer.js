const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

const { createLog, userHasRole } = require('../../functions');
const { getLocalisedString } = require('../../localisation');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('commencer')
        .setDescription('Commence la partie en distribuant les rôles spécifiés aléatoirement aux joueurs')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles | PermissionFlagsBits.SendMessages | PermissionFlagsBits.EmbedLinks | PermissionFlagsBits.UseApplicationCommands)
        .addStringOption(option =>
            option.setName('assignations')
                .setDescription('Liste des assignations (ex : 2lg 3vil 1sor 1voy)')
        ),
    async execute(interaction) {
        // App is thinking
        await interaction.deferReply();

        // Import server config
        const serverConfig = require(`../../config/${interaction.guild.id}/server_config.json`);

        // Get locale
        const locale = serverConfig.locale;

        //Check if user has the required role
        const requiredRole = await interaction.guild.roles.fetch(serverConfig.roleGameMasterId);
        if (! await userHasRole(interaction, requiredRole.id)) {
            await interaction.editReply(getLocalisedString(locale, 'user_does_not_have_required_role', requiredRole.name));
            createLog(interaction.guild.id, interaction.commandName, 'error', `User '${interaction.member.user.username}' does not have the required role to execute '${interaction.commandName}': '${requiredRole.name}'`);
            return;
        }

        // Retrieve arguments
        const _assignationsString = interaction.options.getString('assignations') ?? '';

        // Creating a collection of roles with roleCode => role
        const rolesMap = getRolesMap(interaction.guild.roles, serverConfig);

        // Check if the list of assignations is empty
        // If true, display command help
        // If false, process the assignations
        if (0 === _assignationsString.length) {
            embedMessage = new EmbedBuilder()
                .setColor('#4A03C3')
                .setTitle('commencer')
                .setDescription(getLocalisedString(locale, 'commencer_command_help'))
                .addFields([
                    { name: getLocalisedString(locale, 'usage'), value: '`/commencer <n><code_role> [...]`', inline: true },
                    { name: getLocalisedString(locale, 'example'), value: '`/commencer 1lg 1sor 1voy 2vil`', inline: true },
                    { name: getLocalisedString(locale, 'available_role_codes'), value: getHelpRoleCodes(rolesMap), inline: false }
                ]);
            createLog(interaction.guild.id, interaction.commandName, 'info', 'Displayed help for \'commencer\'');
            interaction.editReply({ embeds: [embedMessage] });
        } else {
            // Build the assignation array from the string parameter
            const assignations = _assignationsString.split(' ');

            // Retrieve players
            const voiceChannel = await interaction.guild.channels.resolve(serverConfig.voiceChannelGameId);
            const playersInVocalChannel = voiceChannel.members.filter(user => !user.roles.resolve(serverConfig.roleGameMasterId));

            // Check if there is at least one player
            // If true, proceed
            // If false, stop
            if (0 < playersInVocalChannel.size) {
                // Detect wrong role codes by checking assignations and tell the Game Master about them
                let messageReply = getLocalisedString(locale, 'following_role_codes_do_not_exist');
                let messageLog = `The following role codes do not exist:`;
                let foundWrongRoleCode = false;
                const assignationsArray = [];

                for await (const assignation of assignations) {
                    const quota = assignation.substr(0, 1);
                    const roleCode = assignation.substr(1);
                    const roleToAssign = await rolesMap.get(roleCode);

                    if (undefined !== roleToAssign) {
                        assignationsArray.push({ quota: quota, role: roleToAssign });
                    } else {
                        messageReply += ` \`${roleCode}\``;
                        messageLog += ` '${roleCode}'`;
                        foundWrongRoleCode = true;
                    }
                }

                // Check if wrong role code have been found
                // If true, tell the Game Master which codes are wrong
                // If false, assign the roles randomly to the players
                if (foundWrongRoleCode) {
                    createLog(interaction.guild.id, interaction.commandName, 'error', messageLog);
                    await interaction.editReply(messageReply);
                } else {
                    for await (const assignation of assignationsArray) {
                        for (let i = 0; i < assignation.quota; i++) {
                            const user = playersInVocalChannel.random(1)[0];
                            user.roles.add(assignation.role);
                            playersInVocalChannel.delete(user.id);
                            createLog(interaction.guild.id, interaction.commandName, 'info', `Assigned role '${assignation.role.name}' to user '${user.user.username}'`);
                        }
                    }
                    createLog(interaction.guild.id, interaction.commandName, 'info', 'All roles have been assigned');
                    await interaction.editReply(getLocalisedString(locale, 'all_roles_have_been_assigned'));
                }
            } else {
                createLog(interaction.guild.id, interaction.commandName, 'info', 'No player in the main vocal channel');
                interaction.editReply(getLocalisedString(locale, 'no_player'));
            }
        }
    }
}

function getRolesMap(_guildRoles, _serverConfig) {
    return new Map([
        ["anc", _guildRoles.resolve(_serverConfig.roleElderId)],
        ["ang", _guildRoles.resolve(_serverConfig.roleAngelId)],
        ["ank", _guildRoles.resolve(_serverConfig.roleReaperId)],
        ["ass", _guildRoles.resolve(_serverConfig.roleAssassinId)],
        ["cham", _guildRoles.resolve(_serverConfig.roleShamanId)],
        ["chas", _guildRoles.resolve(_serverConfig.roleHunterId)],
        ["cup", _guildRoles.resolve(_serverConfig.roleCupidId)],
        ["gar", _guildRoles.resolve(_serverConfig.roleGuardId)],
        ["jdf", _guildRoles.resolve(_serverConfig.roleFlutistId)],
        ["lg", _guildRoles.resolve(_serverConfig.roleWerewolfId)],
        ["lgb", _guildRoles.resolve(_serverConfig.roleWhiteWerewolfId)],
        ["plg", _guildRoles.resolve(_serverConfig.roleInfectedWerewolfId)],
        ["pyr", _guildRoles.resolve(_serverConfig.rolePyromaniacId)],
        ["sor", _guildRoles.resolve(_serverConfig.roleWitchId)],
        ["vil", _guildRoles.resolve(_serverConfig.roleVillagerId)],
        ["voy", _guildRoles.resolve(_serverConfig.roleSeerId)]
    ]);
}

function getHelpRoleCodes(_rolesMap) {
    let helpRoleCodesString = '';
    for (const [roleCode, role] of _rolesMap) {
        helpRoleCodesString += `> – \`${roleCode}\`: ${role.name}\n`;
    }
    return helpRoleCodesString;
}
