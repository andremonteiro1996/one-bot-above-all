const { capitalize } = require('../../config/functions');

module.exports = {
	name: 'help',
	aliases: ['sos'],
	description: 'Retorna todos os comandos existentes.',
	expectedArgs: '',
	permissions: [],
	permissionsErr: '',
	requiredRoles: [],
	execute: async (client, message, args, Discord) => {
		if (args[0]) {
			await message.reply('este comando não tem argumentos.');
			return;
		} else {
			const commands = [];
			client.commands.forEach(command => {
				command = {
					'name': capitalize(command.name) + ' - ' + command.description,
					'value': `Aliases: \`\`\`[${command.aliases.join(', ')}]\`\`\``,
					'inline': true,
				};
				commands.push(command);
			});
			message.channel.send({
				'embed': {
					'title': '**OneBotAboveAll Ajuda**',
					'color': '#8996d2',
					'fields': commands,
					'timestamp': new Date(),
					'footer': {
						'text': `Pedido por: ${message.author.tag}`,
						'icon_url': message.author.avatarURL(),
					},
				}
			});
		}
	}
}