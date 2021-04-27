const unmute = {
    name: 'unmute',
    aliases: ['nomute'],
    description: '',
    expectedArgs: '',
    permissions: [],
    permissionsErr: '',
    requiredRoles: [],
    execute: (client, message, args, Discord) => {
        if (!args[0]) {
            message.reply('por favor providencie o nome do utilizador.');
            return;
        }

        const user_id = args[0].replace('<@!', '').replace('>', '');
        const guild = client.guilds.cache.get(message.guild.id);
        const user = guild.members.cache.get(user_id);

        guild.channels.cache.map(channel => {
            channel.overwritePermissions([
                {
                  id: user.id,
                  allow: ["SEND_MESSAGES"]
                }
            ]);
        });
    }
}

module.exports = (unmute);