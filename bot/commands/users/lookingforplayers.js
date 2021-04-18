const games = [
	{ name: 'League of Legends', abbr: ['lol', 'league'] },
	{ name: 'Sea of Thieves', abbr: ['sot'] },
];

const aliases = ['lfp', 'nlfp'];

module.exports = {
	name: 'lookingforplayers',
	aliases: aliases,
	description: 'Permite procurar outros para jogar',
	expectedArgs: '',
	permissions: [],
	permissionsErr: '',
	requiredRoles: [],
	execute: async (client, message, args, Discord) => {
		const role = message.guild.roles.cache.find(role => role.id === '803050640002908221');
		if (aliases.includes(/^(lfp)/)) {
			if (args[0]) {
				message.member.roles.add(role.id);
				const game = games.filter(games => games.abbr.includes(`${args[0]}`)).map(game => game.name);
				message.reply(`@here, está  à procura de jogadores para **${game}**`);
				return;
			} else {
				message.member.roles.add(role.id);
				message.reply('@here, está  à procura de jogadores.');
				return;
			}
		} else if (aliases.includes(/^(nlfp)/)) {
			if (message.member.roles.cache.has(role.id)) {
				message.member.roles.remove(role.id);
				message.reply('já não está  à procura de jogadores.');
				return;
			}
		}
	}
}