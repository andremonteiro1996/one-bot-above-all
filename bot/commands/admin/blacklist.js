const { request } = require('http');
const { sign } = require('jsonwebtoken');
const { readFileSync } = require('fs');
const privateKey = readFileSync('./private.pem', 'utf8');
const { server_options } = require('../../config/functions.js');

module.exports = {
	name: 'blacklist',
	aliases: ['nonolist', 'block'],
	description: 'Bloqueia comandos em certos canais',
	expectedArgs: '',
	permissions: [],
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

		if (!args[0]) {
			message.reply(`este comando necessita de argumentos para funcionar: ${this.expectedArgs}`);
			return;
		} else {
			const channelid = message.mentions.channels.first().id;
			const channelname = message.mentions.channels.first().name;

			const channelId = args[0] !== undefined ? args[0].replace('<#', '').replace('>', '') : channelid;
			
			const callback = (response) => {
				let data = '';

				response.on('data', (chunk) => {
					data += chunk;
				});

				response.on('end', () => {
					let resp = JSON.parse(data);

					if (response.statusCode === 404) {
						const insert = {
							channelid: channelId,
							channelname: channelname,
							guildId: message.guild.cache.map(guild => guild.id),
							usertag: message.author.tag
						}

						const callback = (response) => {
							let data = '';

							response.on('data', (chunk) => {
								data += chunk;
							});

							response.on('end', async () => {
								let resp = JSON.parse(data);
								await message.reply(resp.msg);
							});
						}

						const req = request(server_options('/api/channels/', 'GET', token), callback).on('error', async (err) => {
							await message.reply('ups, algo correu mal! Tenta novamente mais tarde.');
							if (process.env.MODE === 'Development') console.log(err);
						});

						req.write(insert);
						req.end();
						return;
					} else if (resp.status === 1 && resp.active === true) {
						const update = {
							status: 0
						}
						
						const callback = (response) => {
							let data = '';

							response.on('data', (chunk) => {
								data += chunk;
							});

							response.on('end', async () => {
								let resp = JSON.parse(data);
								await message.reply(resp.msg);
							});
						}

						const req = request(server_options(`/api/channels/${channelId}`, 'PUT', token), callback).on('error', async (err) => {
							await message.reply('ups, algo correu mal! Tenta novamente mais tarde.')
							if (process.env.MODE === 'Development') console.log(err);
						});

						req.write(update);
						req.end();
						return;
					} else if (resp.status === 0 && resp.active === false) {
						const update = {
							status: 1
						}
						
						const callback = (response) => {
							let data = '';
							response.on('data', (chunk) => {
								data += chunk;
							});
							response.on('end', async () => {
								let resp = JSON.parse(data);
								await message.reply(resp.msg);
							});
						}

						const req = request(server_options(`/api/channels/${channelId}`, 'PUT', token), callback).on('error', async (err) => {
							await message.reply('ups, algo correu mal! Tenta novamente mais tarde.');
							if (process.env.MODE === 'Development') console.log(err);
						});

						req.write(update);
						req.end();
						return;
					}
				});
			}

			const req = request(options, callback).on('error', async (err) => {
				await message.reply('ups, algo correu mal! Tenta novamente mais tarde.');
				if (process.env.MODE === 'Development') console.log(err);
			});
			req.end();
		}
	}
}  