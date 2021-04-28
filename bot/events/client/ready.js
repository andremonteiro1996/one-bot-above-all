const { request } = require('http');
const { sign } = require('jsonwebtoken');
const { readFileSync } = require('fs');
const { arrayRand, server_options } = require('../../config/functions.js');
const { prefix } = require('../../config/config.json');
const privateKey = readFileSync('./private.pem', 'utf8');

module.exports = (Discord, client) => {

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

    const blacklistRequest = request(server_options('/api/channels/blacklist', 'GET', token), (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {
            const channels = JSON.parse(data);
            if (channels.length !== 0) {
                for (var i = 0; i < channels.length; i++) {
                    client.blacklist.set(channels[i].channel_name, channels[i]);
                }
                console.log(`Canal ${channels.map(channel => channel.channel_name).join(', ')} na blacklist.`);
            }
        });
    });

    blacklistRequest.end();

    const usersArr = [];

    const guild = client.guilds.cache;
    guild.each(guild => {
        const users = guild.members.cache;
        users.each(member => {
            usersArr.push({
                user_id: member.id,
                user_tag: member.user.tag,
                guild_id: guild.id,
                guild_name: guild.name,
                bot: member.user.bot
            });
        });
    });    

    const users = request(server_options('/api/users', 'POST', token), (response) => {
        let data = '';

        response.on('data', (chunk) => {
            data += chunk;
        });

        response.on('end', () => {});
    });

    users.write(JSON.stringify(usersArr));
    users.end();

    // const mutedUsers = request(server_options('/api/users/muted', 'GET', token), (response) => {
    //     let data = '';

    //     response.on('data', (chunk) => {
    //         data += chunk;
    //     });

    //     response.on('end', () => {
    //         const resp = JSON.parse(data);
    //         console.log(resp.msg);
    //     });
    // });

    // mutedUsers.end();

    console.log(`${client.user.tag} está a usar o prefixo: ${prefix}`);
    console.log(`${client.user.tag} está agora online e a correr no modo de ${process.env.MODE}!`);
}
