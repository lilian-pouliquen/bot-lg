const ms = require('ms');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

const { createLog, userHasRole } = require('../../functions');
const { getLocalisedString } = require('../../localisation');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('minuteur')
        .setDescription('Initialise un minuteur avec le temps spécifié (par défaut : 3 minutes)')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.UseApplicationCommands)
        .addIntegerOption(option =>
            option.setName('temps')
                .setDescription('(facultatif) Valeur numérique du temps qui va être décompté')
        )
        .addStringOption(option =>
            option.setName('unite')
                .setDescription('(facultatif) Unité du temps qui va être décompté')
                .setChoices(
                    { name: 'secondes', value: 's' },
                    { name: 'minutes', value: 'm' },
                    { name: 'heures', value: 'h' },
                )
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
        const _time = interaction.options.getInteger('temps') ?? 3;
        const _units = interaction.options.getString('unite') ?? 'm';

        // Starting the timer
        const time = ms(`${_time}${_units}`);
        setTimeout(() => {
            interaction.channel.send(getLocalisedString(locale, 'time_is_up'));
            createLog(interaction.guild.id, interaction.commandName, 'info', 'The timer has finished');
        }, time);

        createLog(interaction.guild.id, interaction.commandName, 'info', `Started timer for ${_time}${_units}`);
        await interaction.editReply(getLocalisedString(locale, 'timer_started', _time, _units));
    }
}
