const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const dotenv = require('dotenv');

dotenv.config({ path: '../../../config/.env' });

const registerCommandsGuild = async (guildId, commands) => {
    const token = process.env.tokenBot;
    if (!token) {
        console.error('No se encontró el token dentro de .env');
        return;
    }
    const rest = new REST({ version: '10' }).setToken(token);
    try {
        await rest.put(
            Routes.applicationGuildCommands(process.env.clientID, guildId),
            { body: commands }
        );
        console.log(`Comandos registrados en el servidor ${guildId}`);
    } catch (error) {
        console.error(`Error al registrar comandos en el servidor ${guildId}:`, error);
    }
};

module.exports = { registerCommandsGuild };
