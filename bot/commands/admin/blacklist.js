const { request } = require('http');
const { sign } = require('jsonwebtoken');
const { readFileSync } = require('fs');
const privateKey = readFileSync('./private.pem', 'utf8');
const { api } = require('../../config/config.json');
const { server, port, path } = api;

module.exports = {
    name: 'blacklist',
    aliases: ['nonolist', 'block'],
    description: 'Bloqueia comandos em certos canais',
    expectedArgs: '',
    permissions: [],
    permissionsErr: '',
    requiredRoles: [],
    execute: (client, message, args, Discord) => {

        const dat = [];

        if (!args[0]) {
            message.reply(`este comando necessita de argumentos para funcionar: ${this.expectedArgs}`);
            return;
        } else {
            const channelid = message.mentions.channels.first().id;
            const channelname = message.mentions.channels.first().name;

            args[0] = args[0].replace('<#', '').replace('>', '');
            
            if (args[0] === channelid) {
                const channelId = args[0] || channelid;

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

                const options = {
                    server: server,
                    port: port,
                    path: `/api/channels/${channelId}`,
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/JSON',
                        'x-auth-access': token
                    }
                }

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

                            const insert_opt = {
                                server: server,
                                port: port,
                                path: '/api/channels',
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'x-auth-access': token
                                }
                            }

                            const insert_callback = (response) => {
                                let data = '';

                                response.on('data', (chunk) => {
                                    data += chunk;
                                });

                                response.on('end', async () => {
                                    let resp = JSON.parse(data);
                                    await message.reply(resp.msg);
                                });
                            }

                            const insert_req = request(insert_opt, insert_callback).on('error', async (err) => {
                                await message.reply('ups, algo correu mal! Tenta novamente mais tarde.');
                                if (process.env.MODE === 'Development') console.log(err);
                            });

                            insert_req.write(insert);
                            insert_req.end();
                            return;
                        } else if (resp.status === 1 && resp.active === true) {
                            
                        } else if (resp.status === 0 && resp.active === false) {

                        }
                    });
                }

                const req = request(options, callback).on('error', async (err) => {
                    await message.reply('ups, algo correu mal! Tenta novamente mais tarde.')
                    if (process.env.MODE === 'Development') console.log(err);
                });
                req.end();
            }
        }
    }
}  