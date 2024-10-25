const MusicSettings = require('../../functions/database/schemas/musicSchema');
const Trigger = require('../../functions/database/schemas/triggerSchema'); 

module.exports = (client) => {
    client.on('guildDelete', async (guild) => {
        const guildId = guild.id;
        try {
            // Eliminar configuración de MusicSettings para este servidor
            const musicConfigDeleteResult = await MusicSettings.findOneAndDelete({ guildId });
            if (musicConfigDeleteResult) {
                console.log(`Configuración de música eliminada para el servidor ${guildId}.`);
            } else {
                console.log(`No se encontró configuración de música para el servidor ${guildId}.`);
            }

            // Eliminar configuración de Trigger para este servidor
            const triggerConfigDeleteResult = await Trigger.findOneAndDelete({ guildId });
            if (triggerConfigDeleteResult) {
                console.log(`Configuración de triggers eliminada para el servidor ${guildId}.`);
            } else {
                console.log(`No se encontró configuración de triggers para el servidor ${guildId}.`);
            }
        } catch (error) {
            console.error(`Error al eliminar la configuración del servidor ${guildId}:`, error);
        }
    });
};
