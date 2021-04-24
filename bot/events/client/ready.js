const { request } = require('http');
const { sign } = require('jsonwebtoken');
const { readFileSync } = require('fs');
const { arrayRand, server_options } = require('../../config/functions.js');
const { prefix } = require('../../config/config.json');
const privateKey = readFileSync('./private.pem', 'utf8');

module.exports = async (Discord, client) => {

    const activities = [
        'Plague, Inc',
    ];

    const type = [
        'PLAYING'
    ];

    client.user.setActivity(
        activities[arrayRand(activities.length)],
        {
            type: type[arrayRand(type.length)],
        }
    );

    const token = sign(
        {
            id: `${client.user.id}`,
            usertag: `${client.user.tag}`
        },
        privateKey,
        {
            expiresIn: 3600,
            algorithm: 'RS256'
        }
    );

    const req = request(server_options('/api/channels/blacklist', 'GET', token), (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', async () => {
            const channels = JSON.parse(data);

            // console.log(channels); return;

            for (var i = 0; i < channels.length; i++) {
                client.blacklist.set(channels[i].channel_name, channels[i]);
            }

            console.log(`Canal ${channels.map(channel => channel.channel_name).join(', ')} na blacklist.`);
        });
    });

    req.end();
    
    await console.log(`${client.user.tag} está a usar o prefixo: ${prefix}`);
    await console.log(`${client.user.tag} está agora online e a correr no modo de ${process.env.MODE}!`);
}
