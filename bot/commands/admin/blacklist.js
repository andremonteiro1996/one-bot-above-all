const { request } = require('http');
const { sign } = require('jsonwebtoken');
const { readFileSync } = require('fs');
const { api } = require('../../config/config.json');
const privateKey = readFileSync('./private.pem', 'utf8');

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
			
			const get_callback = (response) => {
				let data = '';

				response.on('data', (chunk) => {
					data += chunk;
				});

				response.on('end', () => {
					let get_resp = JSON.parse(data);

					if (response.statusCode === 404) {
						const insert = {
							channelid: channelId,
							channelname: channelname,
							guildId: message.guild.cache.map(guild => guild.id),
							usertag: message.author.tag
						};

						const post_callback = (response) => {
							let data = '';

							response.on('data', (chunk) => {
								data += chunk;
							});

							response.on('end', async () => {
								let post_resp = JSON.parse(data);
                                console.log(post_resp);
								await message.reply(post_resp.msg);
							});
						};

                        const post_options = {
                            server: api.server,
                            port: api.port,
                            path: `/api/channels/`,
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-auth-access': token
                            }
                        };

						const req = request(post_options, post_callback).on('error', async (err) => {
							await message.reply('ups, algo correu mal! Tenta novamente mais tarde.');
							if (process.env.MODE === 'Development') console.log(err);
						});

						req.write(insert);
						req.end();
						return;
					} else {
						const update = {
							status: get_resp.active === true ? 0 : 1
						}
						
						const update_callback = (response) => {
							let data = '';

							response.on('data', (chunk) => {
								data += chunk;
							});

							response.on('end', async () => {
								let update_resp = JSON.parse(data);
								await message.reply(update_resp.msg);
							});
						};

                        const update_options = {
                            server: api.server,
                            port: api.port,
                            path: `/api/channels/${channelId}`,
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'x-auth-access': token
                            }
                        };

						const req = request(update_options, update_callback).on('error', async (err) => {
							await message.reply('ups, algo correu mal! Tenta novamente mais tarde.');
							if (process.env.MODE === 'Development') console.log(err);
						});

						req.write(update);
						req.end();
						return;
					}
				});
			}

            const options = {
                server: api.server,
                port: api.port,
                path: `/api/channels/${channelId}`,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-access': token
                }
            };

			const req = request(options, get_callback).on('error', async (err) => {
				await message.reply('ups, algo correu mal! Tenta novamente mais tarde.');
				if (process.env.MODE === 'Development') console.log(err);
			});
			req.end();
		}
	}
}  