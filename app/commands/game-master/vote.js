const { createLog } = require('../../functions');
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('vote')
        .setDescription('Affiche un formulaire de vote selon le cas précisé')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.EmbedLinks | PermissionFlagsBits.AddReactions | PermissionFlagsBits.UseApplicationCommands)
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

        // Import server config
        const serverConfig = require(`../../config/${interaction.guild.id}/server_config.json`);

        //Check if user has the required role
        const requiredRole = await interaction.guild.roles.fetch(serverConfig.roleGameMasterId);
        if (!userHasRole(interaction, requiredRole.id)) {
            await interaction.editReply(`Vous n\'avez pas le rôle nécessaire pour exécuter cette commande : ${requiredRole.name}`);
            return;
        }

        // Retrieve players
        const vocalChannel = await interaction.guild.channels.fetch(serverConfig.vocalChannelGameId);
        const playersInVocalChannel = vocalChannel.members.filter(user => !user.roles.resolve(serverConfig.roleGameMasterId));

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
        for (let i = 0; i < reactCount; i++) {
            sentMessage.react(reactArray[i]);
        }
        createLog(interaction.guild.id, 'vote', 'info', `Sent a vote for '${voteCase}' in the channel '${channelToSend.name}'`);
        await interaction.editReply('Vous pouvez voter !');
    }
}
