const { request } = require('http');
const { sign } = require('jsonwebtoken');
const { readFileSync } = require('fs');
const { rand, server_options } = require('../../config/functions');
const privateKey = readFileSync('./private.pem', 'utf8');

const ticket = { 
	name: 'ticket',
	aliases: ['suporte'],
	description: 'Cria um pedido de ajuda para o utilizador.',
	expectedArgs: '<create|close: obrigatório> <id_ticket: obrigatório>',
	permissions: [],
	permissionsErr: '',
	requiredRoles: ['803050640002908221'],
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

		if (!args) {
			message.reply(`este comando necessita de argumentos para funcionar: ${ticket.expectedArgs}`);
			return;
		}

		if (args[0] === 'create') {
			const ticket_data = {
				ticket_id: rand(new Date(), 1000, 10000),
				user: message.author.tag,
				status: 'aberto'
			};

			const req = request(server_options('/api/tickets', 'POST', token), (response) => {
				let data = '';

				response.on('data', (chunk) => {
					data += chunk;
				});

				response.on('end', async () => { 
					const create = async () => {
						const channel = await message.guild.channels.create(`ticket-${ticket_data.ticket_id}`, {
							type: 'text',
							parent: '817084195330326570',
							PermissionOverwrites: [
								{
									id: message.author.id,
									allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
								}
							]
						});

						await message.reply(`o seu pedido foi aberto no canal <#${channel.id}>.`);
						console.log(`Canal #ticket-${ticket_data.ticket_id} criado por: ${message.author.tag}`);
						channel.send(`${message.author}, pedimos que aguarde. Um administrador/moderador responderá o mais breve possível.`);
					}

					if (!(response.statusCode === 200)) return;

					await create();
				});
			}).on('error', async (err) => {
				await message.reply('ups, algo correu mal! Tenta novamente mais tarde.');
				if (process.env.MODE === 'Development') console.log(err.message);
			});

			req.write(JSON.stringify(ticket_data));
			req.end();
		} else if (args[0] === 'close') {
			
			if (!args[1]) {
				message.reply('necessita de fornecer o nome do canal.');
				return;
			}

			if (message.channel.id !== args[1].replace('<#', '').replace('>', '')) {
				message.reply('o ticket não pode ser fechado neste canal.');
				return;
			};
			
			const ticket = message.guild.channels.cache.find(ch => ch.id === `${args[1].replace('<#', '').replace('>', '')}`);
			const ticket_id = ticket.name.replace('ticket-', '');

			const ticket_data = {
				ticket_id: ticket_id,
				status: 'fechado'
			}

			const req = request(server_options(`/api/tickets/${ticket_id}`, 'PUT', token), (response) => {
				let data = '';

				response.on('data', (chunk) => {
					data += chunk;
				});

				response.on('end', async () => {
					let resp = JSON.parse(data);

					const memberRoles = message.member.roles.cache.first();
					const channel = message.channel;
					
					channel.overwritePermissions([
						{
						  id: memberRoles.id,
						  deny: ["VIEW_CHANNEL", "SEND_MESSAGES"]
						}
					]);
					
					await message.reply(resp.msg);
				
				});
			}).on('error', async (err) => {
				await message.reply('ups, algo correu mal! Tenta novamente mais tarde.');
				if (process.env.MODE === 'Development') console.log(err.message);
			});

			req.write(JSON.stringify(ticket_data));
			req.end();
		}
	}
}

module.exports = (ticket);