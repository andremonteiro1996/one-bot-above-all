module.exports = {
    name:'notlookingforplayers',
    aliases: ['nlfp'],
    description: 'Remove o estado de procura de jogadores',
    permissions: [],
    permissionsErr: '',
    requiredRoles:['803050640002908221'],
    execute: (client, message, args, Discord) => {
        const role = message.guild.roles.cache.find(role => role.id === '803050640002908221');

        if (role) {
            message.member.roles.remove(role.id);
            message.reply('já não está à procura de jogadores');
            return;
        }
    }
}