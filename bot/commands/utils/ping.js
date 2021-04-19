const { request } = require('http');

module.exports = {
    name: 'ping',
    aliases: ['poke'],
    description: 'Verifica o tempo de resposta.',
    expectedArgs: '!ping <api:optional>',
    permissions: [],
    permissionsErr: '',
    requiredRoles: [],
    execute: (client, message, args, Discord) => {
        if (args[0] === 'api') {
            var start = new Date().getUTCMilliseconds();
            const options = {
                server: 'http://localhost',
                port: 5000,
                path: '/',
                method: 'GET'
            }
            const callback = (response) => {
                let data = '';

                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => {
                    var end = new Date().getUTCMilliseconds();
                    message.reply(`o tempo de resposta da api é de ${end - start}ms.`);
                });
            }
            const req = request(options, callback).on('error', async (err) => {
                message.reply('não foi possivel estabelecer conexão!');
            });
            req.end();
        } else {
            message.reply(`o tempo de resposta do bot é de ${Math.round(client.ws.ping)}ms.`);
        }
    }
}