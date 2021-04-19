const games = [
	{ name: 'League of Legends', abbr: ['lol', 'league'], channel: 'league-of-legends' },
	{ name: 'Sea of Thieves', abbr: ['sot'] },
];

module.exports = {
	name: 'lookingforplayers',
	aliases: ['lfp'],
	description: 'Permite procurar outros para jogar',
	expectedArgs: '',
	permissions: [],
	permissionsErr: '',
	requiredRoles: [],
	execute: (client, message, args, Discord) => {
		const role = message.guild.roles.cache.find(role => role.id === '803050640002908221');
        if (args[0]) {
            message.member.roles.add(role.id);
            const game = games.filter(games => games.abbr.includes(`${args[0]}`)).map(game => game.channel);
            const channel = message.channel.guild.channels.cache.find(ch => ch.name === `${game}`);
            if (game && channel) {
                channel.send(`@here, ${message.author} está  à procura de jogadores para **${game}**.`);
                return;
            }
            message.channel.send(`@here, ${message.author} está  à procura de jogadores para **${game}**.`);
            return;
        } else {
            message.member.roles.add(role.id);
            message.reply('@here, está  à procura de jogadores.');
        }
	}
}