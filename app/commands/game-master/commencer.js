const { createLog } = require('../../functions');
const { SlashCommandBuilder, Collection, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

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

        //Check if user has the required role
        const requiredRole = await interaction.guild.roles.fetch(serverConfig.roleGameMasterId);
        if (!userHasRole(interaction, requiredRole.id)) {
            await interaction.editReply(`Vous n\'avez pas le rôle nécessaire pour exécuter cette commande : ${requiredRole.name}`);
            return;
        }

        // Retrieve arguments
        const _assignationsString = interaction.options.getString('assignations') ?? '';

        // Check if the list of assignations is empty
        // If true, display command help
        // If false, process the assignations
        if (0 === _assignationsString.length) {
            embedMessage = new EmbedBuilder()
                .setColor('#4A03C3')
                .setTitle('commencer')
                .setDescription('Aide de la commande `commencer`')
                .addFields([
                    { name: 'Utilisation', value: '`/commencer <n><code_role> [...]`', inline: true },
                    { name: 'Exemple', value: '`/commencer 1lg 1sor 1voy 2vil`', inline: true },
                    { name: 'Codes des rôles disponibles', value: getHelpRoleCodes(), inline: false }
                ]);
            createLog(interaction.guild.id, 'commencer', 'info', 'Displayed help for \'commencer\'');
            interaction.editReply({ embeds: [embedMessage] });
        } else {
            // Build the assignation array from the string parameter
            const assignations = _assignationsString.split(' ');

            // Retrieve players
            const vocalChannel = await interaction.guild.channels.resolve(serverConfig.vocalChannelGameId);
            const playersInVocalChannel = vocalChannel.members.filter(user => !user.roles.resolve(serverConfig.roleGameMasterId));

            // Check if there is at least one player
            // If true, proceed
            // If false, stop
            if (0 < playersInVocalChannel.size) {
                // Creating a collection of roles with roleCode => role
                const roleCollection = getRoleCollection(interaction.guild.roles);

                // Detect wrong role codes by checking assignations and tell the Game Master about them
                let messageReply = 'Les codes de rôle suivants n\'existent pas :';
                let messageLog = `The following role codes do not exist:`;
                let foundWrongRoleCode = false;
                const assignationsArray = [];

                for await (const assignation of assignations) {
                    const quota = assignation.substr(0, 1);
                    const roleCode = assignation.substr(1);
                    const roleToAssign = await roleCollection.get(roleCode);

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
                    createLog(interaction.guild.id, 'commencer', 'error', messageLog);
                    await interaction.editReply(messageReply);
                } else {
                    for await (const assignation of assignationsArray) {
                        for (let i = 0; i < assignation.quota; i++) {
                            const user = playersInVocalChannel.random(1)[0];
                            user.roles.add(assignation.role);
                            playersInVocalChannel.delete(user.id);
                            createLog(interaction.guild.id, 'commencer', 'info', `Assigned role '${assignation.role.name}' to user '${user.user.username}'`);
                        }
                    }
                    createLog(interaction.guild.id, 'commencer', 'info', 'All roles have been assigned');
                    await interaction.editReply('Tous les rôles ont été attribués');
                }
            } else {
                createLog(interaction.guild.id, 'commencer', 'info', 'No player in the main vocal channel');
                interaction.editReply('Il n\'y a aucun joueur actuellement');
            }
        }
    }
}

function getRoleCollection(guildRoles) {
    const roles = new Collection();
    roles.set("anc", guildRoles.resolve(serverConfig.roleElderId));
    roles.set("ang", guildRoles.resolve(serverConfig.roleAngelId));
    roles.set("ank", guildRoles.resolve(serverConfig.roleReaperId));
    roles.set("ass", guildRoles.resolve(serverConfig.roleAssassinId));
    roles.set("cham", guildRoles.resolve(serverConfig.roleShamanId));
    roles.set("chas", guildRoles.resolve(serverConfig.roleHunterId));
    roles.set("cup", guildRoles.resolve(serverConfig.roleCupidId));
    roles.set("gar", guildRoles.resolve(serverConfig.roleGuardId));
    roles.set("jdf", guildRoles.resolve(serverConfig.roleFlutistId));
    roles.set("lg", guildRoles.resolve(serverConfig.roleWerewolfId));
    roles.set("lgb", guildRoles.resolve(serverConfig.roleWhiteWerewolfId));
    roles.set("plg", guildRoles.resolve(serverConfig.roleInfectedWerewolfId));
    roles.set("pyr", guildRoles.resolve(serverConfig.rolePyromaniacId));
    roles.set("sor", guildRoles.resolve(serverConfig.roleWitchId));
    roles.set("vil", guildRoles.resolve(serverConfig.roleVillagerId));
    roles.set("voy", guildRoles.resolve(serverConfig.roleSeerId));
    return roles;
}

function getHelpRoleCodes() {
    return '> – `anc` : Ancien\n\
> – `ang` : Ange\n\
> – `ank` : Ankou\n\
> – `ass` : Assassin\n\
> – `cham` : Chaman\n\
> – `chas` : Chasseur\n\
> – `cup` : Cupidon\n\
> – `gar` : Gardien\n\
> – `jdf` : Joueur de flûte\n\
> – `lg` : Loup-garou\n\
> – `lgb` : Loup-garou blanc\n\
> – `plg` : Père des loups\n\
> – `pyr` : Pyromane\n\
> – `sor` : Sorcière\n\
> – `vil` : Villageois\n\
> – `voy` : Voyante';
}
