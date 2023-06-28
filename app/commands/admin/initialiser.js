const fs = require('node:fs');
const { SlashCommandBuilder, PermissionFlagsBits, PermissionsBitField, ChannelType } = require('discord.js');

const { createLog } = require('../../functions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('initialiser')
        .setDescription('Inistialise le serveur pour pouvoir jouer aux Loups-garous')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(interaction) {
        // App is thinking
        await interaction.deferReply();

        // Checking initialisation state
        let isInitialised = false;
        let serverConfig = null
        const serverConfigPath = `/app/config/${interaction.guild.id}/server_config.json`;
        if (fs.existsSync(serverConfigPath)) {
            serverConfig = require(serverConfigPath);
            isInitialised = serverConfig.isInitialised;
        } else {
            fs.writeFileSync(serverConfigPath, '{"isInitialised": false}');
            createLog(interaction.guild.id, 'initialiser', 'info', 'Created server config file and set \'IsInitialised\' key to \'false\'');
        }

        // Install the server if it is not installed yet
        if (true === isInitialised) {
            createLog(interaction.guild.id, 'initialiser', 'info', 'Server is already prepared to play Werewolf');
            await interaction.editReply('Le serveur est déjà prêt !');
        } else {
            createLog(interaction.guild.id, 'initialiser', 'info', 'Started to prepare the server to play Werewolf');

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

            // Variables
            let permissions = [];
            let permissionOverwrites = [];
            let role = null;
            let channel = null;

            // Create
            const categoryChannel = await channelManager.create({
                name: 'Loups-garous',
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
            const channelVillage = await createChannel(interaction.guild.id, channelManager, 'Village', permissionOverwrites, categoryChannel);

            serverConfigsMap.set('textChannelVillageId', channelVillage.id);

            // Create role Game master and its channel and add them to server config map
            permissions = [
                PermissionsBitField.Flags.ManageRoles,
                PermissionsBitField.Flags.MuteMembers,
                PermissionsBitField.Flags.PrioritySpeaker
            ];
            const roleGameMaster = await createRole(interaction.guild.id, roleManager, 'Maître du jeu', permissions);
            excludedRoleIds.push(roleGameMaster.id);

            channelVillage.permissionOverwrites.edit(roleGameMaster, { ViewChannel: true, SendMessages: true });
            createLog(interaction.guild.id, 'initialiser', 'info', `Added permissions to role '${roleGameMaster.name}' on channel '${channelVillage.name}'`);

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
            const roleMuted = await createRole(interaction.guild.id, roleManager, 'Muet');
            roleMuted.setColor('Red');

            channelVillage.permissionOverwrites.edit(roleMuted, { ViewChannel: true, SendMessages: false });
            createLog(interaction.guild.id, 'initialiser', 'info', `Added permissions to role '${roleMuted.name}' on channel '${channelVillage.name}'`);

            permissions = [PermissionsBitField.Flags.Speak];
            permissionOverwrites = [{ id: roleMuted.id, deny: permissions }];
            channel = await channelManager.create({
                name: 'Place du village',
                type: ChannelType.GuildVoice,
                parent: categoryChannel,
                permissionOverwrites: permissionOverwrites
            });

            serverConfigsMap.set('roleMutedId', roleMuted.id);
            serverConfigsMap.set('vocalChannelGameId', channel.id);
            excludedRoleIds.push(roleMuted.id);

            // Create role Dead and its text channel and add them to server config map
            const roleDead = await createRole(interaction.guild.id, roleManager, 'Mort');

            channelVillage.permissionOverwrites.edit(roleDead, { ViewChannel: true, SendMessages: false });
            createLog(interaction.guild.id, 'initialiser', 'info', `Added permissions to role '${roleDead.name}' on channel '${channelVillage.name}'`);

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
                ['Villager', 'Villageois'],
                ['Cupid', 'Cupidon'],
                ['Lovers', 'Amoureux'],
                ['Guardian', 'Gardien'],
                ['Werewolf', 'Loup-garou'],
                ['WhiteWerewolf', 'Loup blanc'],
                ['InfectedWerewolf', 'Père des loups'],
                ['Infected', 'Infecté'],
                ['Witch', 'Sorcière'],
                ['Seer', 'Voyante'],
                ['Assassin', 'Assassin'],
                ['Pyromaniac', 'Pyromane'],
                ['Oiled', 'Imbibé d\'essence'],
                ['Flutist', 'Joueur de flûte'],
                ['Enchanted', 'Envouté'],
                ['Reaper', 'Ankou'],
                ['Elder', 'Ancien'],
                ['Angel', 'Ange'],
                ['Shaman', 'Chaman'],
                ['Hunter', 'Chasseur']
            ]);

            for await (const [roleKey, roleName] of otherRolesMap) {
                role = await createRole(interaction.guild.id, roleManager, roleName);

                channelVillage.permissionOverwrites.edit(role, { ViewChannel: true, SendMessages: true });
                createLog(interaction.guild.id, 'initialiser', 'info', `Added permissions to role '${role.name}' on channel '${channelVillage.name}'`);

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
            createLog(interaction.guild.id, 'initialiser', 'info', `Set specific permissions on channel '${channelDead.name}'`);

            await channelWereWolf.permissionOverwrites.edit(serverConfigsMap.get('roleWhiteWerewolfId'), { ViewChannel: true, SendMessages: true });
            await channelWereWolf.permissionOverwrites.edit(serverConfigsMap.get('roleInfectedWerewolfId'), { ViewChannel: true, SendMessages: true });
            await channelWereWolf.permissionOverwrites.edit(serverConfigsMap.get('roleInfectedId'), { ViewChannel: true, SendMessages: true });
            createLog(interaction.guild.id, 'initialiser', 'info', `Set specific permissions on channel '${channelWereWolf.name}'`);

            // Add excluded role ids to the config
            serverConfigsMap.set('excludedRoleIds', excludedRoleIds);

            // Change initialisation state
            serverConfigsMap.set('isInitialised', true);
            createLog(interaction.guild.id, 'initialiser', 'info', 'Changed \'isInitialised\' key to \'true\'')

            // Writing role and channel ids to the server config
            const serverConfigJSON = JSON.stringify(Object.fromEntries(serverConfigsMap), null, 4);
            fs.writeFileSync(`/app/config/${interaction.guild.id}/server_config.json`, serverConfigJSON);

            // Reply to user
            await interaction.editReply('Les rôles et salons ont été créés');
            createLog(interaction.guild.id, 'initialiser', 'info', `Successfuly prepared the server to play Werewolf`);
        }
    }
}

async function createRole(_guildId,_roleManager, _roleName, _permissions = []) {
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
