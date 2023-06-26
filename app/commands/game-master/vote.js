const cmdConfig = require('../cmd_config.json');
const { getLogDate } = require('../../functions');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    requiredRoleId: cmdConfig.idRoleGameMaster,
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Affiche un formulaire de vote selon le cas précisé')
        .setDefaultMemberPermissions(2147502144)
        .addSubcommand(subcommand =>
            subcommand
                .setName('village')
                .setDescription('Affiche le formulaire de vote du village')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('sorciere')
                .setDescription('Affiche le formulaire des choix de la sorcière')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('pyromane')
                .setDescription('Affiche le formulaire des choix du pyromane')
        ),
    async execute(interaction) {
        // App is thinking
        await interaction.deferReply();

        // Retrieve players
        const vocalChannel = await interaction.guild.channels.fetch(cmdConfig.idVocalChannelMain);
        const playersInVocalChannel = vocalChannel.members.filter(user => !user.roles.resolve(cmdConfig.idRoleGameMaster));

        // Retrieve subcommand
        const _subcommand = interaction.options.getSubcommand();

        // Retrieve current channel
        const channelToSend = await interaction.guild.channels.fetch(interaction.channelId);

        // Other variables
        var voteCase = '';
        var voteDescription = '';
        var voteFieldsArray = [];
        var reactArray = [];
        var reactCount = 0;

        // Check which subcommand has been chosen to send the correct embed message to react to
        // If village, the message contains all alive players to choose who to eliminate
        // If sorciere, the message contains a choice of wether to use a life potion or a death one
        // If pyromane, the message contains a choice of wether to oil someone or light all already oiled players
        switch (_subcommand) {
            case 'village':
                voteCase = 'Village';
                voteDescription = 'Votez pour la personne à éliminer';
                reactArray = ['🇦', '🇧', '🇨', '🇩', '🇪', '🇫', '🇬', '🇭', '🇮', '🇯', '🇰', '🇱', '🇲', '🇳', '🇴', '🇵', '🇶', '🇷', '🇸', '🇹', '🇺', '🇻', '🇼', '🇽', '🇾', '🇿'];
                reactCount = playersInVocalChannel.size;
                let i = 0;
                for await (const [idPlayer, player] of playersInVocalChannel) {
                    voteFieldsArray.push({ name: 'Villageois', value: `${reactArray[i]} : ${player.nickname ?? player.user.username}`, inline: true });
                    i++;
                }
                break;
            case 'sorciere':
                voteCase = 'Sorcière';
                voteDescription = 'Choisissez la ou les potions que vous souhaitez utiliser';
                voteFieldsArray.push({ name: 'Potion 1', value: '❤️ : Potion de vie', inline: true });
                voteFieldsArray.push({ name: 'Potion 2', value: '💀 : Potion de mort', inline: true });
                voteFieldsArray.push({ name: 'Rien', value: '✖️ : Ne rien faire', inline: true });
                reactArray = ['❤️', '💀', '✖️'];
                reactCount = reactArray.length;
                break;
            case 'pyromane':
                voteCase = 'Pyromane';
                voteDescription = 'Choisissez l\'action que vous voulez faire';
                voteFieldsArray.push({ name: 'Action 1', value: '⛽ : Imbiber quelqu\'un d\'essence', inline: true });
                voteFieldsArray.push({ name: 'Action 2', value: '🔥 : Mettre le feu aux personnes déjà imbibées', inline: true });
                voteFieldsArray.push({ name: 'Rien', value: '✖️ : Ne rien faire', inline: true });
                reactArray = ['⛽', '🔥', '✖️'];
                reactCount = reactArray.length;
                break;
        }

        embedMessage = new EmbedBuilder()
            .setColor('#4A03C3')
            .setTitle(`Vote ${voteCase}`)
            .setDescription(`${voteDescription}`)
            .addFields(voteFieldsArray);

        sentMessage = await channelToSend.send({ embeds: [embedMessage] });
        for (let i = 0 ; i < reactCount ; i++) {
            sentMessage.react(reactArray[i]);
        }
        console.log(`${getLogDate()} [vote] INFO: Sent a vote for '${voteCase}' in the channel '${channelToSend.name}'`);
        await interaction.editReply('Vous pouvez voter !');
    }
}
