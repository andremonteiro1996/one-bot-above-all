const http = require('http');

module.exports = {
    name: 'ping',
    aliases: [],
    description: 'Pinga o utilizador ou a API',
    expectedArgs: '!ping <api:optional>',
    permissions: [],
    permissionsErr: '',
    requiredRoles: [],
    execute: (client, message, args, Discord) => {
        if (!args[0]) {
            return message.reply(`O tempo de resposta do bot é de ${Math.round(client.ws.ping)}ms.`);
        } else if (args[0] === 'api') {
            var start = new Date().getUTCMilliseconds();

            const options = {
                server: 'http://localhost',
                port: 5000,
                path: '/',
                method: 'GET'
            }

            const req = http.request(options, res => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                req.on('end', () => {
                    var end = new Date().getUTCMilliseconds();
                    message.reply(`O tempo de resposta da api é de ${end - start}ms.`);
                })
            });

            req.end();
        }
    }
}