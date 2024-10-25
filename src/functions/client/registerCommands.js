const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const path = require('node:path');
const dotenv = require('dotenv');


const registerCommands = async (client, commands) => {
    dotenv.config({path: '../../../config/.env'});
    const token = process.env.tokenBot;
    if (!token) {
        console.error('No se encontro el token dentro de .env');
        return;
    }
    
    const rest = new REST({ version: '10' }).setToken(token);
    const guild_ids = client.guilds.cache.map(guild => guild.id);

    for (const guildId of guild_ids) {
        try {
            await rest.put(
                Routes.applicationGuildCommands(process.env.clientID, guildId), 
                { body: commands }
            );
            console.log(`Comandos preparados para el servidor ${guildId}`);
        } catch (error) {
            console.error('Error al registrar comandos:', error);
        }
    }
};

module.exports = { registerCommands };
