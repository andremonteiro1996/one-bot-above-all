const http = require('http');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { token, api } = require('../../config/config.json');
const privateKey = fs.readFileSync('./private.pem', 'utf8');

module.exports = (Discord, client, member) => {
    const guild = member.guild;
    const newUsers = [];

    if (!newUsers[guild.id]) {
        newUsers[guild.id] = new Discord.Collection();
    }
    newUsers[guild.id].set(member.id, member.user);

    payload = {
        userId: member.id,
        userTag: member.user.username + '#' + member.user.discriminator,
        guildId: guild.id,
        guildName: guild.name
    };

    const jwtToken = jwt.sign(payload, privateKey, token);
    if (process.env.MODE === 'Development') console.log(jwtToken);

    const options = {
        server: api.server,
        port: api.port,
        path: 'api/v1/users',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Auth-Token': jwtToken
        }
    }

    const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            console.log(`Utilizador ${payload.userTag} registado na base de dados!`);
        });
    }).on('error', (err) => {
        console.log(`Pedido falhou, ${err}`);
    });

    req.write(payload);
    req.end();
}