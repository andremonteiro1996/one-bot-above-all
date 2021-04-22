const clear = {
    name: 'clear',
    aliases: ['cls', 'wipe', 'purge'],
    description: 'Limpa um numero definido de mensagens.',
    expectedArgs: '<numero:opcional>',
    permissions: ['ADMINISTRATOR', 'MANAGE_MESSAGES'],
    permissionsErr: '',
    requiredRoles: ['796467134280237106'],
    execute: (client, message, args, Discord) => {
        if (!args[0]) {
            message.channel.messages.fetch().then(messages => {
                message.channel.bulkDelete(messages);
                if (process.env.MODE === 'Development') console.log(`Foram apagadas todas as mensagens do canal #${message.channel.name}!`);
            });
        } else {
            if (isNaN(args[0])) {
                message.reply('Por favor utilize um número real.');
                return;
            } else if (args[0] > 99) {
                message.reply('Não podem ser apagadas mais de 99 mensagens de cada vez.');
                return;
            } else {
                message.channel.messages.fetch({ limit: args[0] }).then(messages => {
                    message.channel.bulkDelete(messages);
                    if (process.env.MODE === 'Development') console.log(`Foram apagadas ${args[0]} mensagens do canal #${message.channel.name}!`);
                });
            }
        }
    }
}

module.exports = (clear);