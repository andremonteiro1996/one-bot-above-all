require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

[''].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
});

const token = process.env.DISCORD_TOKEN;
client.login(token);