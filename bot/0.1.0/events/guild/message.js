const http = require('http');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { prefix, token } = require('../../config/config.json');
const privateKey = fs.readFileSync('./private.pem', 'utf8');

module.exports = (Discord, client, message) => {
    const { content, member, author } = message;
    if (!content.startsWith(prefix) || author.bot) {
        return;
    }

    const payload = {
        "userTag": author.tag,
        "userId": author.id,
    };

    const jwtToken = jwt.sign(payload, privateKey, token);
    if (process.env.MODE === 'Development') console.log(jwtToken);

    const channel_id = message.channel.id;

    const options = {
        server: 'http://localhost',
        port: 5000,
        path: `/api/v1/channels/${channel_id}`,
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': jwtToken
        }
    }

    const req = http.request(options, res => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            let res = JSON.parse(data);

            if (res.status === 1 && res.active === true) {
                return;
            } else {
                const args = content.slice(prefix.length).split(/ +/);
                const cmd = args.shift.toLowerCase();
                const command = client.command.get(cmd) || client.commands.find(command => command.aliases && command.aliases.includes(cmd));
                if (!command) {
                    return message.reply(`O comando <${command}> não existe ou não está disponível`);
                }

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
                    if (cmd.startsWith(`${name}` || `${alias}`)) {
                        execute(client, message, args, Discord);
                    }
                }
            }

        });

    }).on('error', (err) => {
        console.log(`Pedido falhou, ${err}`);
    });

    req.end();
}