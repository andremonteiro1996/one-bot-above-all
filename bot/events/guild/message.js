const { readFileSync } = require('fs');
const { request } = require('http');
const { sign } = require('jsonwebtoken');
const { prefix } = require('../../config/config.json');
const privateKey = readFileSync('./private.pem', 'utf8');

module.exports = (Discord, client, message) => {

    
    const token = sign(
        {
            id: `${message.author.id}`,
            usertag: `${message.author.tag}`
        },
        privateKey,
        {
            expiresIn: 3600,
            algorithm: 'RS256'
        }
    );

    const options = {
        server: 'http://localhost',
        port: 5000,
        path: `/api/channels/blacklist/${message.channel.id}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-access': token
        }
    }

    const req = request(options, (response) =>{ 
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
            data = JSON.parse(data);
        });

        response.on('end', () => {
            
            if (!(response.statusCode === 404)) return;

            const { content, member, author } = message;
    
            if (!content.startsWith(prefix) || author.bot) return;

            const args = content.slice(prefix.length).split(/ +/);
            const cmd = args.shift().toLowerCase();
            const command = client.commands.get(cmd) || client.commands.find(command => command.aliases && command.aliases.includes(cmd));
            
            if (!command) return message.reply(`o comando !${cmd} não existe ou não está disponível`);

            const { 
                name,
                aliases,
                description,
                expectedArgs,
                permissions,
                permissionsErr,
                requiredRoles,
                execute
            } = command;

            for (const permission of permissions) {
                if (!member.hasPermission(permission)) {
                    return message.reply(permissionsErr);
                }
            }

            for (const alias of aliases) {
                if (cmd.includes(`${alias}`) || cmd.startsWith(`${name}`)) {
                    execute(client, message, args, Discord);
                    break;
                }
            }
        });

    }).on('error', async (err) => {
        await message.reply('ups, algo correu mal! Tenta novamente mais tarde.');
		if (process.env.MODE === 'Development') console.log(err.message);
    });

    req.end();
}