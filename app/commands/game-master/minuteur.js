const ms = require('ms');
const cmdConfig = require('../cmd_config.json');
const { createLog } = require('../../functions');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    requiredRoleId: cmdConfig.idRoleGameMaster,
    data: new SlashCommandBuilder()
        .setName('minuteur')
        .setDescription('Initialise un minuteur avec le temps spécifié (par défaut : 3 minutes)')
        .setDefaultMemberPermissions(2147485696)
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
