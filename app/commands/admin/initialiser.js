const fs = require('node:fs');
const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, ChannelType } = require('discord.js');

const mongodb = require('../../models');
const { createLog } = require('../../functions');
const { getLocalisedString } = require('../../localisation');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('initialiser')
        .setDescription('Initialise le serveur pour pouvoir jouer aux Loups-garous')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        // App is thinking
        await interaction.deferReply();

        // Check initialisation state and get locale
        const serverConfig = await mongodb.findOne({_id: interaction.guild.id});
        isInitialised = serverConfig.isInitialised;
        locale = serverConfig.locale;

        // Install the server if it is not installed yet
        if (true === isInitialised) {
            createLog(interaction.guild.id, interaction.commandName, 'info', 'Server is already prepared to play Werewolf');
            await interaction.editReply(getLocalisedString(locale, 'server_already_prepared'));
        } else {
            createLog(interaction.guild.id, interaction.commandName, 'info', 'Started to prepare the server to play Werewolf');

            // Retrieve role Manager and channel manager
            const roleManager = interaction.guild.roles;
            const channelManager = interaction.guild.channels;

            // Retrieve everyone and bot-lg roles
            const roleEveryone = await roleManager.fetch(interaction.guild.id);
            const existingRoles = await roleManager.fetch();
            const roleBotlg = existingRoles.find(role => role.name === 'bot-lg');

            // Excluded roles are existing ones
            const excludedRoleIds = [];
            for await (const [roleId, role] of existingRoles) {
                excludedRoleIds.push(roleId);
            }

            // Server configs map
            const serverConfigsMap = new Map();
            serverConfigsMap.set('_id', interaction.guild.id);
            serverConfigsMap.set('locale', locale);

            // Variables
            let permissions = [];
            let permissionOverwrites = [];
            let role = null;
            let channel = null;

            // Create
            const categoryChannel = await channelManager.create({
                name: getLocalisedString(locale, 'category_channel_name'),
                type: ChannelType.GuildCategory
            });

            // Create text channel village and add it to server config map
            permissions = [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages
            ];
            permissionOverwrites = [
                { id: roleBotlg.id, allow: permissions },
                { id: roleEveryone.id, deny: permissions }
            ];
            const channelVillage = await createChannel(interaction.guild.id, channelManager, getLocalisedString(locale, 'text_channel_village_name'), permissionOverwrites, categoryChannel);

            serverConfigsMap.set('textChannelVillageId', channelVillage.id);

            // Create role Game master and its channel and add them to server config map
            permissions = [
                PermissionsBitField.Flags.ManageRoles,
                PermissionsBitField.Flags.MuteMembers,
                PermissionsBitField.Flags.PrioritySpeaker
            ];
            const roleGameMaster = await createRole(interaction.guild.id, roleManager, getLocalisedString(locale, 'role_game_master_name'), permissions);
            excludedRoleIds.push(roleGameMaster.id);

            channelVillage.permissionOverwrites.edit(roleGameMaster, { ViewChannel: true, SendMessages: true });
            createLog(interaction.guild.id, interaction.commandName, 'info', `Added permissions to role '${roleGameMaster.name}' on channel '${channelVillage.name}'`);

            permissions = [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages
            ];
            permissionOverwrites = [
                { id: roleGameMaster.id, allow: permissions },
                { id: roleBotlg.id, allow: permissions },
                { id: roleEveryone.id, deny: permissions }
            ];
            channel = await createChannel(interaction.guild.id, channelManager, roleGameMaster.name, permissionOverwrites, categoryChannel);

            serverConfigsMap.set('roleGameMasterId', roleGameMaster.id);
            serverConfigsMap.set('textChannelGameMasterId', channel.id);

            // Create role Muted and voice channel loups-garous and add them to server config map
            const roleMuted = await createRole(interaction.guild.id, roleManager, getLocalisedString(locale, 'role_muted_name'));
            roleMuted.setColor('Red');

            channelVillage.permissionOverwrites.edit(roleMuted, { ViewChannel: true, SendMessages: false });
            createLog(interaction.guild.id, interaction.commandName, 'info', `Added permissions to role '${roleMuted.name}' on channel '${channelVillage.name}'`);

            permissions = [PermissionsBitField.Flags.Speak];
            permissionOverwrites = [{ id: roleMuted.id, deny: permissions }];
            channel = await channelManager.create({
                name: getLocalisedString(locale, 'voice_channel_game_name'),
                type: ChannelType.GuildVoice,
                parent: categoryChannel,
                permissionOverwrites: permissionOverwrites
            });

            serverConfigsMap.set('roleMutedId', roleMuted.id);
            serverConfigsMap.set('voiceChannelGameId', channel.id);
            excludedRoleIds.push(roleMuted.id);

            // Create role Dead and its text channel and add them to server config map
            const roleDead = await createRole(interaction.guild.id, roleManager, 'Mort');

            channelVillage.permissionOverwrites.edit(roleDead, { ViewChannel: true, SendMessages: false });
            createLog(interaction.guild.id, interaction.commandName, 'info', `Added permissions to role '${roleDead.name}' on channel '${channelVillage.name}'`);

            permissions = [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages
            ];
            permissionOverwrites = [
                { id: roleDead.id, allow: permissions },
                { id: roleGameMaster.id, allow: permissions },
                { id: roleBotlg.id, allow: permissions },
                { id: roleEveryone.id, deny: permissions }
            ];
            channel = await createChannel(interaction.guild.id, channelManager, roleDead.name, permissionOverwrites, categoryChannel);

            serverConfigsMap.set('roleDeadId', roleDead.id);
            serverConfigsMap.set('textChannelDeadId', channel.id);

            // Create other game roles and their text channel and add them to server config map
            const otherRolesMap = new Map([
                ['Villager', getLocalisedString(locale, 'role_villager_name')],
                ['Cupid', getLocalisedString(locale, 'role_cupid_name')],
                ['Lovers', getLocalisedString(locale, 'role_lovers_name')],
                ['Guard', getLocalisedString(locale, 'role_guard_name')],
                ['Werewolf', getLocalisedString(locale, 'role_werewolf_name')],
                ['WhiteWerewolf', getLocalisedString(locale, 'role_white_werewolf_name')],
                ['InfectedWerewolf', getLocalisedString(locale, 'role_infected_werewolf_name')],
                ['Infected', getLocalisedString(locale, 'role_infected_name')],
                ['Witch', getLocalisedString(locale, 'role_witch_name')],
                ['Seer', getLocalisedString(locale, 'role_seer_name')],
                ['Assassin', getLocalisedString(locale, 'role_assassin_name')],
                ['Pyromaniac', getLocalisedString(locale, 'role_pyromaniac_name')],
                ['Oiled', getLocalisedString(locale, 'role_oiled_name')],
                ['Flutist', getLocalisedString(locale, 'role_flutist_name')],
                ['Enchanted', getLocalisedString(locale, 'role_enchanted_name')],
                ['Reaper', getLocalisedString(locale, 'role_reaper_name')],
                ['Elder', getLocalisedString(locale, 'role_elder_name')],
                ['Angel', getLocalisedString(locale, 'role_angel_name')],
                ['Shaman', getLocalisedString(locale, 'role_shaman_name')],
                ['Hunter', getLocalisedString(locale, 'role_hunter_name')]
            ]);

            for await (const [roleKey, roleName] of otherRolesMap) {
                role = await createRole(interaction.guild.id, roleManager, roleName);

                channelVillage.permissionOverwrites.edit(role, { ViewChannel: true, SendMessages: true });
                createLog(interaction.guild.id, interaction.commandName, 'info', `Added permissions to role '${role.name}' on channel '${channelVillage.name}'`);

                permissionOverwrites = [
                    { id: role.id, allow: permissions },
                    { id: roleGameMaster.id, allow: permissions },
                    { id: roleBotlg.id, allow: permissions },
                    { id: roleEveryone.id, deny: permissions }
                ]
                channel = await createChannel(interaction.guild.id, channelManager, role.name, permissionOverwrites, categoryChannel);

                serverConfigsMap.set(`role${roleKey}Id`, role.id);
                serverConfigsMap.set(`textChannel${roleKey}Id`, channel.id);
            }

            // Apply specific channel permissions
            const channels = await interaction.guild.channels.fetch();
            const channelDead = channels.get(serverConfigsMap.get('textChannelDeadId'));
            const channelWereWolf = channels.get(serverConfigsMap.get('textChannelWerewolfId'));

            await channelDead.permissionOverwrites.edit(serverConfigsMap.get('roleShamanId'), { ViewChannel: true });
            createLog(interaction.guild.id, interaction.commandName, 'info', `Set specific permissions on channel '${channelDead.name}'`);

            await channelWereWolf.permissionOverwrites.edit(serverConfigsMap.get('roleWhiteWerewolfId'), { ViewChannel: true, SendMessages: true });
            await channelWereWolf.permissionOverwrites.edit(serverConfigsMap.get('roleInfectedWerewolfId'), { ViewChannel: true, SendMessages: true });
            await channelWereWolf.permissionOverwrites.edit(serverConfigsMap.get('roleInfectedId'), { ViewChannel: true, SendMessages: true });
            createLog(interaction.guild.id, interaction.commandName, 'info', `Set specific permissions on channel '${channelWereWolf.name}'`);

            // Add excluded role ids to the config
            serverConfigsMap.set('excludedRoleIds', excludedRoleIds);

            // Change initialisation state
            serverConfigsMap.set('isInitialised', true);
            createLog(interaction.guild.id, interaction.commandName, 'info', 'Changed \'isInitialised\' key to \'true\'')

            // Write new server configuration to database
            await mongodb.deleteOne({_id: interaction.guild.id});
            const serverConfigJSON = JSON.stringify(Object.fromEntries(serverConfigsMap));
            await mongodb.insertOne(serverConfigJSON);

            // Reply to user
            await interaction.editReply(getLocalisedString(locale, 'roles_and_channels_created'));
            createLog(interaction.guild.id, interaction.commandName, 'info', `Successfuly prepared the server to play Werewolf`);
        }
    }
}

async function createRole(_guildId, _roleManager, _roleName, _permissions = []) {
    let role = null;
    if (0 === _permissions.length) {
        role = await _roleManager.create({
            name: _roleName,
            mentionable: false
        });
    } else {
        role = await _roleManager.create({
            name: _roleName,
            permissions: _permissions,
            mentionable: false
        });
    }
    createLog(_guildId, 'initialiser', 'info', `Created role '${role.name}'`);
    return role;
}

async function createChannel(_guildId, _channelManager, _channelName, _permissionOverwrites, _parent) {
    const channel = await _channelManager.create({
        name: _channelName,
        type: ChannelType.GuildText,
        parent: _parent,
        permissionOverwrites: _permissionOverwrites
    });
    createLog(_guildId, 'initialiser', 'info', `Created channel '${channel.name}'`);
    return channel;
}
