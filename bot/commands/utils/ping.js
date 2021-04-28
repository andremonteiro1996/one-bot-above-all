const { request } = require('http');
const { server_options } = require('../../config/functions.js');

const ping = {
	name: 'ping',
	aliases: ['poke'],
	description: 'Verifica o tempo de resposta do entre o utilizador e o cliente.',
	expectedArgs: '<api:opcional>',
	permissions: [],
	permissionsErr: '',
	requiredRoles: [],
	execute: (client, message, args, Discord) => {
		if (args[0] === 'api') {
			var start = new Date().getUTCMilliseconds();

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

			const req = request(server_options('/', 'GET'), callback).on('error', async (err) => {
				await message.reply('não foi possivel estabelecer conexão!');
				if (process.env.MODE === 'Development') console.log(err);
			});

			req.end();
			return;
		} else {
			message.reply(`o tempo de resposta do bot é de ${Math.round(client.ws.ping)}ms.`);
			return;
		}
	}
}

module.exports = (ping);