const musicSchema = require('../../functions/database/schemas/musicSchema'); // Esquema de configuración de música
const { ChannelType } = require('discord.js');

module.exports = (client) => {
    client.on('channelDelete', async (channel) => {

        // Verificar si el canal es de tipo GUILD_TEXT
        if (channel.type !== ChannelType.GuildText) return;

        try {
            // Buscar la configuración guardada en la base de datos para la guild
            const serverConfig = await musicSchema.findOne({ musicSearchChannelId: channel.id });

            // Si se encuentra una configuración asociada al canal eliminado, eliminarla
            if (serverConfig) {
                await musicSchema.findOneAndDelete({ guildId: serverConfig.guildId });
                console.log(`Configuración de música eliminada de la guild: ${serverConfig.guildId}`);
            } else {
                console.log(`No se encontraron configuraciones asociadas al canal eliminado: ${channel.id}`);
            }
        } catch (error) {
            console.error(`Error al eliminar la configuración de música de la base de datos: ${error}`);
        }
    });
};