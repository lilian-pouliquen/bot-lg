const cmdConfig = require("./cmd_config.json");
const { SlashCommandBuilder, Collection, InviteTargetType } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('commencer')
        .setDescription('Assigne les rôles spécifiés aux joueurs')
        .addStringOption( option =>
            option.setName('assignations')
            .setDescription('Liste des assignations (ex : 2lg 3vil 1sor 1voy')
            .setRequired(true)
        ),
    async execute(interaction) {
        // App is thinking
        await interaction.deferReply();

        // Retrieve arguments
        const _assignationsString = await interaction.options.getString('assignations');
        const assignationsArray = _assignationsString.split(' ');

        // Retrieve players
        const vocalChannel = await interaction.guild.channels.resolve(cmdConfig.idVocalChannelMain);
        const playersInVocalChannel = vocalChannel.members.filter(user => !user.roles.resolve(cmdConfig.idRoleGameMaster));

        // Other variables
        const roleCollection = getRoleCollection(interaction.guild.roles);

        // Process assignations
        for await (const assignation of assignationsArray) {
            const quota = assignation.substr(0, 1);
            const codeRole = assignation.substr(1);
            const roleToAssign = await roleCollection.get(codeRole);

            for (let i = 0 ; i < quota ; i++) {
                const user = playersInVocalChannel.random(1)[0];
                user.roles.add(roleToAssign);
                playersInVocalChannel.delete(user.id);
                console.log(`Assigned role ${roleToAssign.name} to user ${user.user.username}`);
            }
        }
        console.log('All roles have been assigned');
        await interaction.editReply({content: 'Tous les rôles ont été attribués', ephemeral: true });
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