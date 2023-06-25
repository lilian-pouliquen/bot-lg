const cmdConfig = require('../cmd_config.json');
const { getLogDate } = require('../../functions');
const { SlashCommandBuilder, Collection } = require('discord.js');

module.exports = {
    requiredRoleId: cmdConfig.idRoleGameMaster,
    data: new SlashCommandBuilder()
        .setName('commencer')
        .setDescription('Commence la partie en distribuant les rôles spécifiés aléatoirement aux joueurs')
        .addStringOption(option =>
            option.setName('assignations')
                .setDescription('Liste des assignations (ex : 2lg 3vil 1sor 1voy)')
                .setRequired(true)
        ),
    async execute(interaction) {
        // App is thinking
        await interaction.deferReply();

        // Retrieve arguments
        const _assignationsString = interaction.options.getString('assignations');
        const assignations = _assignationsString.split(' ');

        // Retrieve players
        const vocalChannel = await interaction.guild.channels.resolve(cmdConfig.idVocalChannelMain);
        const playersInVocalChannel = vocalChannel.members.filter(user => !user.roles.resolve(cmdConfig.idRoleGameMaster));

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
            console.log('${getLogDate()} [commencer] INFO: All roles have been assigned');
            await interaction.editReply('Tous les rôles ont été attribués');
        }
    }
}

function getRoleCollection(guildRoles) {
    const roles = new Collection();
    roles.set("vil", guildRoles.resolve(cmdConfig.idRoleVillager));
    roles.set("cup", guildRoles.resolve(cmdConfig.idRoleCupid));
    roles.set("gar", guildRoles.resolve(cmdConfig.idRoleGuard));
    roles.set("lg", guildRoles.resolve(cmdConfig.idRoleWerewolf));
    roles.set("lgb", guildRoles.resolve(cmdConfig.idRoleWhiteWerewolf));
    roles.set("plg", guildRoles.resolve(cmdConfig.idRoleInfectWerewolf));
    roles.set("sor", guildRoles.resolve(cmdConfig.idRoleWitch));
    roles.set("voy", guildRoles.resolve(cmdConfig.idRoleSeer));
    roles.set("ass", guildRoles.resolve(cmdConfig.idRoleAssassin));
    roles.set("pyr", guildRoles.resolve(cmdConfig.idRolePyromaniac));
    roles.set("jdf", guildRoles.resolve(cmdConfig.idRoleFlutist));
    roles.set("ank", guildRoles.resolve(cmdConfig.idRoleReaper));
    roles.set("anc", guildRoles.resolve(cmdConfig.idRoleAncient));
    roles.set("ang", guildRoles.resolve(cmdConfig.idRoleAngel));
    roles.set("cham", guildRoles.resolve(cmdConfig.idRoleShaman));
    roles.set("chas", guildRoles.resolve(cmdConfig.idRoleHunter));
    return roles;
}
