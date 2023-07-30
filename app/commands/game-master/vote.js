const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require("discord.js");

const mongodb = require("../../models");
const { createLog, userHasRole } = require("../../functions");
const { getLocalisedString } = require("../../localisation");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vote")
        .setDescription("Affiche un formulaire de vote spécifié")
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages | PermissionFlagsBits.EmbedLinks | PermissionFlagsBits.AddReactions | PermissionFlagsBits.UseApplicationCommands)
        .addSubcommand(subcommand =>
            subcommand
                .setName("pyromane")
                .setDescription("Affiche le formulaire des choix du pyromane dans le salon pyromane")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("sorciere")
                .setDescription("affiche le formulaire des choix de la sorcière dans le salon sorcière")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("village")
                .setDescription("Affiche le formulaire de vote du village dans le salon courant")
        ),
    async execute(interaction) {
        // App is thinking
        await interaction.deferReply();

        // Get server config from database and get locale
        const serverConfig = await mongodb.findOne({ _id: interaction.guild.id });
        const locale = serverConfig.locale;

        //Check if user has the required role
        const requiredRole = await interaction.guild.roles.fetch(serverConfig.roleGameMasterId);
        if (!await userHasRole(interaction, requiredRole.id)) {
            await interaction.editReply(getLocalisedString(locale, "user_does_not_have_required_role", requiredRole.name));
            createLog(interaction.guild.id, interaction.commandName, "error", `User '${interaction.member.user.username}' does not have the required role to execute '${interaction.commandName}': '${requiredRole.name}'`);
            return;
        }

        // Retrieve players
        const voiceChannel = await interaction.guild.channels.fetch(serverConfig.voiceChannelGameId);
        const playersInVocalChannel = voiceChannel.members.filter(user => !user.roles.resolve(serverConfig.roleGameMasterId));

        // Retrieve subcommand
        const _subcommand = interaction.options.getSubcommand();

        // Retrieve channels
        const currentChannel = interaction.channel;
        const witchChannel = await interaction.guild.channels.fetch(serverConfig.textChannelWitchId);
        const pyromaniacChannel = await interaction.guild.channels.fetch(serverConfig.textChannelPyromaniacId);

        // Other variables
        var channelToSend = null;
        var voteCase = "";
        var voteDescription = "";
        var voteFieldsArray = [];
        var reactArray = [];
        var reactCount = 0;

        // Check which subcommand has been chosen to send the correct embed message to react to
        // If village, the message is sent to the current text channel ans contains all alive players to choose who to eliminate
        // If sorciere, the message is sent to witch text channel and contains a choice of wether to use a life potion or a death one
        // If pyromane, the message is sent to pyromaniac text channel and contains a choice of wether to oil someone or light all already oiled players
        switch (_subcommand) {
        case "village":
            channelToSend = currentChannel;
            voteCase = getLocalisedString(locale, "vote_case_village");
            voteDescription = getLocalisedString(locale, "vote_to_eliminate");
            reactArray = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯", "🇰", "🇱", "🇲", "🇳", "🇴", "🇵", "🇶", "🇷", "🇸", "🇹", "🇺", "🇻", "🇼", "🇽", "🇾", "🇿"];
            reactCount = playersInVocalChannel.size;
            let i = 0;
            for await (const [idPlayer, player] of playersInVocalChannel) {
                voteFieldsArray.push({ name: getLocalisedString(locale, "role_villager_name"), value: `${reactArray[i]} : ${player.nickname ?? player.user.username}`, inline: true });
                i++;
            }
            break;
        case "sorciere":
            channelToSend = witchChannel;
            voteCase = getLocalisedString(locale, "vote_case_witch");
            voteDescription = getLocalisedString(locale, "choose_potion_to_use");
            voteFieldsArray.push({ name: `${getLocalisedString(locale, "potion")} 1`, value: `❤️ : ${getLocalisedString(locale, "life_potion")}`, inline: true });
            voteFieldsArray.push({ name: `${getLocalisedString(locale, "potion")} 2`, value: `💀 : ${getLocalisedString(locale, "death_potion")}`, inline: true });
            voteFieldsArray.push({ name: getLocalisedString(locale, "nothing"), value: `✖️ : ${getLocalisedString(locale, "do_nothing")}`, inline: true });
            reactArray = ["❤️", "💀", "✖️"];
            reactCount = reactArray.length;
            break;
        case "pyromane":
            channelToSend = pyromaniacChannel;
            voteCase = getLocalisedString(locale, "vote_case_pyromaniac");
            voteDescription = getLocalisedString(locale, "choose_action_to_do");
            voteFieldsArray.push({ name: `${getLocalisedString(locale, "action")} 1`, value: `⛽ : ${getLocalisedString(locale, "oil_someone")}`, inline: true });
            voteFieldsArray.push({ name: `${getLocalisedString(locale, "action")} 2`, value: `🔥 : ${getLocalisedString(locale, "ignite_oiled_ones")}`, inline: true });
            voteFieldsArray.push({ name: getLocalisedString(locale, "nothing"), value: `✖️ : ${getLocalisedString(locale, "do_nothing")}`, inline: true });
            reactArray = ["⛽", "🔥", "✖️"];
            reactCount = reactArray.length;
            break;
        }

        const embedMessage = new EmbedBuilder()
            .setColor("#4A03C3")
            .setTitle(voteCase)
            .setDescription(voteDescription)
            .addFields(voteFieldsArray);

        const sentMessage = await channelToSend.send({ embeds: [embedMessage] });
        for (let i = 0; i < reactCount; i++) {
            sentMessage.react(reactArray[i]);
        }
        createLog(interaction.guild.id, interaction.commandName, "info", `Sent a vote for case '${voteCase}' in the channel '${channelToSend.name}'`);
        await interaction.editReply(getLocalisedString(locale, "vote_available"));
    }
};
