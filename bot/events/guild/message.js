const { prefix } = require('../../config/config.json');

module.exports = (Discord, client, message) => {

    const blacklist = client.blacklist.map(ch => ch.channel_name);
    console.log(blacklist);
    console.log(client.blacklist.find(ch => ch.channel_name.includes(`${message.channel.name}`)));

    if (client.blacklist.get(message.channel.name)) return;

    const { content, member, author } = message;

    if (!content.startsWith(prefix) || author.bot) return;

    const args = content.slice(prefix.length).split(/ +/);
    const cmd = args.shift().toLowerCase();
    const command = client.commands.get(cmd) || client.commands.find(command => command.aliases && command.aliases.includes(cmd));
    
    if (!command) {
        message.reply(`o comando ${cmd} não existe ou não está disponível!`);
        return;
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