const tempmute = {
    name: 'tempmute',
    aliases: ['tmpm', 'tmute', 'chatmute'],
    description: 'Bloqueia o utilizador de mandar mensagens temporariamente no chat',
    expectedArgs: '<tempo: obrigatório> <utilizador: obrigatório>',
    permissions: ['ADMINISTRATOR'],
    permissionsErr: 'não tens permissão para executar esse comando!',
    requiredRoles: [],
    execute: (client, message, args, Discord) => {
        if (!args[1])  {
            message.reply(`este comando necessita dos seguintes argumentos: ${tempmute.expectedArgs}, para funcionar.`);
            return;
        }

        const user_id = args[0].replace('<@!', '').replace('>', '');
        const guild = client.guilds.cache.get(message.guild.id);
        const user = guild.members.cache.get(user_id);

        if (!user) {
            message.reply('esse utilizador não existe neste servidor');
            return;
        }

        const unit = args[1].substring(args[1].length - 1);
        var time = args[1].substring(0, args[1].length - 1)
        
        var timeMS = 0;

        switch (unit) {
            case 'm': timeMS = (time * 60) * 1000; break;
            case 'd': timeMS = (time * 3600 * 24) * 1000; break;
            case 's': timeMS = (time * 3600 * 24 * 7) * 1000; break;
            default: message.reply('por favor providencie a unidade de tempo.');
        }

        guild.channels.cache.map(channel => {
            channel.overwritePermissions([
                {
                  id: user.id,
                  deny: ["SEND_MESSAGES"]
                }
            ]);
        });

        setTimeout(() => {
            guild.channels.cache.map(channel => {
                channel.overwritePermissions([
                    {
                      id: user.id,
                      allow: ["SEND_MESSAGES"]
                    }
                ]);
            });
        }, timeMS);
    }
}

module.exports = (tempmute);