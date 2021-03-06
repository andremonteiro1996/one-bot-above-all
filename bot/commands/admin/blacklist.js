const { request } = require('http');
const { sign } = require('jsonwebtoken');
const { readFileSync } = require('fs');
const { api } = require('../../config/config.json');
const privateKey = readFileSync('./private.pem', 'utf8');

const blacklist = {
	name: 'blacklist',
	aliases: ['nonolist', 'block'],
	description: 'Bloqueia comandos em certos canais',
	expectedArgs: '<enable|disable:obrigatorio> <canal:obrigatorio>',
	permissions: ['ADMINISTRATOR', 'MANAGE_CHANNELS'],
	permissionsErr: '',
	requiredRoles: ['796467134280237106'],
	execute: (client, message, args, Discord) => {

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

		if (!args[1]) return message.reply(`este comando necessita de argumentos para funcionar: ${blacklist.expectedArgs}`);
		if (!(args[0].toLowerCase() === 'enable' || args[0].toLowerCase() === 'disable')) return;

		const channel = message.guild.channels.cache.find(ch => ch.id === `${args[1].replace('<#', '').replace('>', '')}`);
		const guild = client.guilds.cache.find(guild => guild.id);
		
		const post = {
			channel_id: args[1].replace('<#', '').replace('>', ''),
			channel_name: channel.name,
			guild_id: guild.id,
			added_by: message.author.tag,
			status: args[0],
		}

		const options = {
			server: api.server,
			port: api.port,
			path: '/api/channels/blacklist',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-auth-access': token
			}
		}

		const req = request(options, (response) => {
			let data = '';

			response.on('data', (chunk) => {
				data += chunk;
			});

			response.on('end', async () => {
				let resp = JSON.parse(data);

                if (!data.success) {

                }

				await message.reply(resp.msg);
			});
		}).on('error', async (err) => {
			await message.reply('ups, algo correu mal! Tenta novamente mais tarde.');
			if (process.env.MODE === 'Development') console.log(err.message);
		});
		req.write(JSON.stringify(post));
		req.end();
	}
}

module.exports = (blacklist);