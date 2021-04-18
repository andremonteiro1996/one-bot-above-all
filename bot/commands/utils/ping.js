const http = require('http');

module.exports = {
    name: 'ping',
    aliases: ['poke'],
    description: 'Verifica o tempo de resposta.',
    expectedArgs: '!ping <api:optional>',
    permissions: [],
    permissionsErr: '',
    requiredRoles: [],
    execute: async (client, message, args, Discord) => {
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

                response.on('end', async () => {
                    var end = new Date().getUTCMilliseconds();
                    await message.reply(`o tempo de resposta da api é de ${end - start}ms.`);
                });
            }
            const req = http.request(options, callback).on('error', async (err) => {
                await message.reply('não foi possivel estabelecer conexão!');
            });
            req.end();
            return;
        } else {
            await message.reply(`o tempo de resposta do bot é de ${Math.round(client.ws.ping)}ms.`);
        }
    }
}