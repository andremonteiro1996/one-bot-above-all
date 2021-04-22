const { capitalize } = require('../../config/functions');
const { readdirSync } = require('fs');

const help = {
	name: 'help',
	aliases: ['sos'],
	description: 'Retorna todos os comandos existentes.',
	expectedArgs: '',
	permissions: [],
	permissionsErr: '',
	requiredRoles: [],
	execute: (client, message, args, Discord) => {
		if (args[0]) {
			message.reply('este comando não aceita argumentos.');
			return;
		} else {
			let cmd = [];

			const load_dir = (dirs) => {
				const commands = readdirSync(`./commands/${dirs}`).filter(file => file.endsWith('.js'));
				const memberRoles = message.member.roles.cache;
				
				commands.forEach(file => {
					command = require(`../${dirs}/${file}`);
					if (memberRoles.find(role => command.requiredRoles.includes(role.id)) || command.requiredRoles.length === 0) {
						cmd.push({
							name: `**${command.name}**\n${command.description}`,
							value: `\`\`\`${command.aliases.join (', ')}\`\`\``,
							inline: true
						});
					}
				});
			}
			
			['admin', 'users', 'utils'].forEach(e => load_dir(e));

			const embed = new Discord.MessageEmbed()
				.setColor('#8996d2')
				.setTitle('Menu de ajuda')
                .setDescription('Aqui são apresentados os comandos a que tens acesso. Para usar estes comandos prefixa-se sempre um "!".')
                .addFields(cmd)
                .setTimestamp()
                .setFooter( `${message.author.tag}`, `${message.author.avatarURL()}`);

			message.channel.send(embed);
		}
	}
}

module.exports = (help);