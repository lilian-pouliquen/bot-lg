const ms = require('ms');
const { createLog, userHasRole } = require('../../functions');
const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

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

        //Check if user has the required role
        const requiredRole = await interaction.guild.roles.fetch(serverConfig.roleGameMasterId);
        if (! await userHasRole(interaction, requiredRole.id)) {
            await interaction.editReply(`Vous n\'avez pas le rôle nécessaire pour exécuter cette commande : \`${requiredRole.name}\``);
            createLog(interaction.guild.id, interaction.commandName, 'error', `User '${interaction.member.user.username}' does not have the required role to execute '${interaction.commandName}': '${requiredRole.name}'`);
            return;
        }

        // Retrieve arguments
        const _time = interaction.options.getInteger('temps') ?? 3;
        const _units = interaction.options.getString('unite') ?? 'm';

        // Starting the timer
        const time = ms(`${_time}${_units}`);
        setTimeout(() => {
            interaction.channel.send("Le temps est écoulé !");
            createLog(interaction.guild.id, 'minuteur', 'info', 'The timer has finished');
        }, time);

        createLog(interaction.guild.id, 'minuteur', 'info', `Started timer for ${_time}${_units}`);
        await interaction.editReply(`Le minuteur est démarré pour ${_time} ${_units}`);
    }
}
