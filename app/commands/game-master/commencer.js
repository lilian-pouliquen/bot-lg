const cmdConfig = require('../cmd_config.json');
const { getLogDate } = require('../../functions');
const { SlashCommandBuilder, Collection, EmbedBuilder } = require('discord.js');

module.exports = {
    requiredRoleId: cmdConfig.idRoleGameMaster,
    data: new SlashCommandBuilder()
        .setName('commencer')
        .setDescription('Commence la partie en distribuant les rôles spécifiés aléatoirement aux joueurs')
        .setDefaultMemberPermissions(2415937536)
        .addStringOption(option =>
            option.setName('assignations')
                .setDescription('Liste des assignations (ex : 2lg 3vil 1sor 1voy)')
        ),
    async execute(interaction) {
        // App is thinking
        await interaction.deferReply();

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
            console.log(`${getLogDate()} INFO: Displayed help for 'commencer'`);
            interaction.editReply({ embeds: [embedMessage] });
        } else {
            // Build the assignation array from the string parameter
            const assignations = _assignationsString.split(' ');

            // Retrieve players
            const vocalChannel = await interaction.guild.channels.resolve(cmdConfig.idVocalChannelMain);
            const playersInVocalChannel = vocalChannel.members.filter(user => !user.roles.resolve(cmdConfig.idRoleGameMaster));

            // Check if there is at least one player
            // If true, proceed
            // If false, stop
            if (0 < playersInVocalChannel.size) {
                // Creating a collection of roles with roleCode => role
                const roleCollection = getRoleCollection(interaction.guild.roles);

                // Detect wrong role codes by checking assignations and tell the Game Master about them
                let messageReply = 'Les codes de rôle suivants n\'existent pas :';
                let messageConsole = `${getLogDate()} [commencer] ERROR: The following role codes do not exist:`;
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
                        messageConsole += ` '${roleCode}'`;
                        foundWrongRoleCode = true;
                    }
                }

                // Check if wrong role code have been found
                // If true, tell the Game Master which codes are wrong
                // If false, assign the roles randomly to the players
                if (foundWrongRoleCode) {
                    console.log(messageConsole);
                    await interaction.editReply(messageReply);
                } else {
                    for await (const assignation of assignationsArray) {
                        for (let i = 0; i < assignation.quota; i++) {
                            const user = playersInVocalChannel.random(1)[0];
                            user.roles.add(assignation.role);
                            playersInVocalChannel.delete(user.id);
                            console.log(`${getLogDate()} [commencer] INFO: Assigned role '${assignation.role.name}' to user '${user.user.username}'`);
                        }
                    }
                    console.log(`${getLogDate()} [commencer] INFO: All roles have been assigned`);
                    await interaction.editReply('Tous les rôles ont été attribués');
                }
            } else {
                console.log(`${getLogDate()} [commencer] INFO: No player in the main vocal channel`);
                interaction.editReply('Il n\'y a aucun joueur actuellement');
            }
        }
    }
}

function getRoleCollection(guildRoles) {
    const roles = new Collection();
    roles.set("anc", guildRoles.resolve(cmdConfig.idRoleAncient));
    roles.set("ang", guildRoles.resolve(cmdConfig.idRoleAngel));
    roles.set("ank", guildRoles.resolve(cmdConfig.idRoleReaper));
    roles.set("ass", guildRoles.resolve(cmdConfig.idRoleAssassin));
    roles.set("cham", guildRoles.resolve(cmdConfig.idRoleShaman));
    roles.set("chas", guildRoles.resolve(cmdConfig.idRoleHunter));
    roles.set("cup", guildRoles.resolve(cmdConfig.idRoleCupid));
    roles.set("gar", guildRoles.resolve(cmdConfig.idRoleGuard));
    roles.set("jdf", guildRoles.resolve(cmdConfig.idRoleFlutist));
    roles.set("lg", guildRoles.resolve(cmdConfig.idRoleWerewolf));
    roles.set("lgb", guildRoles.resolve(cmdConfig.idRoleWhiteWerewolf));
    roles.set("plg", guildRoles.resolve(cmdConfig.idRoleInfectWerewolf));
    roles.set("pyr", guildRoles.resolve(cmdConfig.idRolePyromaniac));
    roles.set("sor", guildRoles.resolve(cmdConfig.idRoleWitch));
    roles.set("vil", guildRoles.resolve(cmdConfig.idRoleVillager));
    roles.set("voy", guildRoles.resolve(cmdConfig.idRoleSeer));
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
