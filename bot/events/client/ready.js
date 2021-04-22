const { arrayRand } = require('../../config/functions.js');
const { prefix } = require('../../config/config.json');


module.exports = (Discord, client) => {
    console.log(`${client.user.tag} está a usar o prefixo: ${prefix}`);
    console.log(`${client.user.tag} está agora online e a correr no modo de ${process.env.MODE}!`);

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

}