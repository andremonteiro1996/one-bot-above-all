require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.blacklist = new Discord.Collection();
client.mutedUsers = new Discord.Collection();
client.usersOnUnmuteRoutine = new Discord.Collection();

['command_handler', 'event_handler'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
});

const token = process.env.DISCORD_TOKEN;
client.login(token);