const fs = require('fs');

const validatePermissions = (permissions) => {
    const validPermissions = [
        'ADMINISTRATOR',
		'CREATE_INSTANT_INVITE',
		'KICK_MEMBERS',
		'BAN_MEMBERS',
		'MANAGE_CHANNELS',
		'MANAGE_GUILD',
		'ADD_REACTIONS',
		'VIEW_AUDIT_LOG',
		'PRIORITY_SPEAKER',
		'STREAM',
		'VIEW_CHANNEL',
		'SEND_MESSAGES',
		'SEND_TTS_MESSAGES',
		'MANAGE_MESSAGES',
		'EMBED_LINKS',
		'ATTACH_FILES',
		'READ_MESSAGE_HISTORY',
		'MENTION_EVERYONE',
		'USE_EXTERNAL_EMOJIS',
		'VIEW_GUILD_INSIGHTS',
		'CONNECT',
		'SPEAK',
		'MUTE_MEMBERS',
		'DEAFEN_MEMBERS',
		'MOVE_MEMBERS',
		'USE_VAD',
		'CHANGE_NICKNAME',
		'MANAGE_NICKNAMES',
		'MANAGE_ROLES',
		'MANAGE_WEBHOOKS',
		'MANAGE_EMOJIS'
    ];

    for(const permission of permissions) {
        if (!validPermissions.includes(permission)) {
            throw new Error(`Invalid permission node ${permission}`);
        }
    }
}

module.exports = (client, Discord, command) => {
    const load_dir = (dirs) => {
        const command_files = fs.readdirSync(`./commands/${dirs}`).filter(file => file.endsWith('.js'));
        command_files.forEach(file => {
            command = require(`../commands/${dirs}/${file}`);
            console.log(`Comando ${command.name} registado!`);

            let {

            } = command;

            
        });
    }
}