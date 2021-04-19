const { prefix, token } = require('../../config/config.json');

module.exports = (Discord, client, message) => {
    const { content, member, author } = message;

    if (!content.startsWith(prefix) || author.bot) {
        return;
    }

    const args = content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();
    const command = client.commands.get(cmd) || client.commands.find(command => command.aliases && command.aliases.includes(cmd));
    
    if (!command) {
        return message.reply(`o comando !${cmd} não existe ou não está disponível`);
    }

    const { 
        name,
        aliases,
        description,
        expectedArgs,
        permissions,
        permissionsErr,
        requiredRoles,
        execute
    } = command;

    for (const permission of permissions) {
        if (!member.hasPermission(permission)) {
            return message.reply(permissionsErr);
        }
    }

    for (const alias of aliases) {
        if (cmd.includes(`${alias}`) || cmd.startsWith(`${name}`)) {
            execute(client, message, args, Discord);
            break;
        }
    }
}