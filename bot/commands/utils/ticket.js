const { request } = require('http');
const { sign } = require('jsonwebtoken');
const { readFileSync } = require('fs');
const { rand } = require('../../config/functions');
const { api } = require('../../config/config.json');
const privateKey = readFileSync('./private.pem', 'utf8');

const ticket = { 
    name: 'ticket',
    aliases: [],
    description: 'Cria um pedido de ajuda para o utilizador.',
    expectedArgs: '<criar|fechar: obrigatório> <id_ticket: obrigatório>',
    permissions: [],
    permissionsErr: '',
    requiredRoles: [],
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

        console.log(token);
        return

        if (!args) {
            message.reply(`este comando necessita de argumentos para funcionar: ${ticket.expectedArgs}`);
            return;
        }

        if (args[0] === 'criar') {

            console.log(args[0]);

            const data = {
                ticket_id: rand(1000, 10000),
                user: message.author.tag
            }

            const options = {
                server: api.server,
                port: api.port,
                path: 'api/tickets',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-access': token,
                }
            }

            const req = request(options, (response) => {
                let data = '';

                response.on('data', (chunk) => {
                    data += chunk;
                });

                response.on('end', () => { 
                    async () => {
                        const channel = await message.guild.channels.create(`ticket-${data.ticket_id}`, {
                            type: 'text',
                            parent: '817084195330326570',
                            PermissionOverwrites: [
                                {
                                    id: message.author.id,
                                    allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'READ_MESSAGE_HISTORY']
                                }
                            ]
                        });
                        message.reply(`o seu pedido foi aberto no canal <#${channel.id}>.`);
                        console.log(`Canal #${data.ticket_id} criado por: ${message.author.tag}`);
                        channel.send(`${message.author}, pedimos que aguarde. Um moderador responderá o mais breve possível.`);
                    }
                });
            }).on('error', async (err) => {
                await message.reply('ups, algo correu mal! Tenta novamente mais tarde.');
                if (process.env.MODE === 'Development') console.log(err.message);
            });

            req.write(data);
            req.end();
        }
    }
}

module.exports = (ticket);