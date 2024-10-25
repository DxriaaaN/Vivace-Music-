const { registerCommandsGuild } = require('../../functions/client/registerCommandsGuild');

module.exports = (client, commands) => {
    client.on('guildCreate', async (guild) => {
        try {
            console.log(`El bot ha sido añadido al servidor: ${guild.id}`);
            await registerCommandsGuild(guild.id, commands);
        } catch (error) {
            console.error(`Error al registrar comandos en el servidor ${guild.id}:`, error);
        }
    });
};