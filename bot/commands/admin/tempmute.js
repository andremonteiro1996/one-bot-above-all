const { request } = require('http');
const { sign } = require('jsonwebtoken');
const { readFileSync } = require('fs');
const { server_options } = require('../../config/functions');
const privateKey = readFileSync('./private.pem', 'utf8');

const tempmute = {
    name: 'tempmute',
    aliases: ['tmpm', 'tmute', 'chatmute'],
    description: 'Bloqueia o utilizador de mandar mensagens temporariamente no chat',
    expectedArgs: '<tempo: obrigatório> <utilizador: obrigatório>',
    permissions: ['ADMINISTRATOR'],
    permissionsErr: 'não tens permissão para executar esse comando!',
    requiredRoles: [],
    execute: (client, message, args, Discord) => {

        const token = sign(
            {
                id: `${client.user.id}`,
                usertag: `${client.user.tag}`
            },
            privateKey,
            {
                expiresIn: 3600,
                algorithm: 'RS256'
            }
        );

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
        const time = args[1].substring(0, args[1].length - 1);
        
        var now = new Date().getTime();
        var timeMS = 0;
        
        switch (unit) {
            case 'm': timeMS = (time * 60) * 1000; break;
            case 'd': timeMS = (time * 3600 * 24) * 1000; break;
            case 's': timeMS = (time * 3600 * 24 * 7) * 1000; break;
            default: message.reply('por favor providencie a unidade de tempo.');
        }

        const unmuteDate = new Date(now + timeMS);
        
        const userData = {
            user_id: user.id,
            mute_date: now,
            unmute_date: unmuteDate,
        }

        const mutedUsers = request(server_options('/api/users/muted', 'POST', token), (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                const resp = JSON.parse(data);
                console.log(resp.msg);
            });
        });

        mutedUsers.write(JSON.stringify(userData));
        mutedUsers.end();
    }
}

module.exports = (tempmute);