const musicSchema = require('../../functions/database/schemas/musicSchema'); // Importar el esquema de Mongoose

module.exports = (client) => {
    // Función para chequear y limpiar mensajes periódicamente
    async function checkAndCleanMessages() {
        // Buscar todas las configuraciones de la base de datos
        const allSettings = await musicSchema.find();

        for (const guildSettings of allSettings) {
            const { guildId, musicSearchChannelId, musicSearchMessageId, nowPlayingMessageId } = guildSettings;

            // Asegurarse de que los IDs de los mensajes y del canal estén disponibles antes de continuar
            if (!musicSearchChannelId || !musicSearchMessageId || !nowPlayingMessageId) {
                console.log(`Saltando limpieza en guild ${guildId}: configuración incompleta`);
                continue;
            }

            try {
                const channel = await client.channels.fetch(musicSearchChannelId).catch(console.error);
                if (channel) {
                    const messages = await channel.messages.fetch({ limit: 100 }).catch(console.error);
                    messages.forEach(message => {
                        // Verificar que el mensaje no sea el de control ni el de Now Playing antes de borrarlo
                        if (message.id !== musicSearchMessageId && message.id !== nowPlayingMessageId) {
                            console.log(`Eliminando mensaje ${message.id} en canal ${musicSearchChannelId}`);
                            message.delete().catch(console.error);
                        }
                    });
                }
            } catch (error) {
                console.error(`Error al limpiar mensajes en la guild ${guildId}:`, error);
            }
        }
    }

    // Evento 'ready' para realizar la carga inicial y establecer el intervalo de limpieza
    client.on('ready', async () => {
        console.log('Bot preparado, iniciando limpieza de mensajes.');
        await checkAndCleanMessages(); // Limpieza inicial
        setInterval(checkAndCleanMessages, 30000); // Intervalo de limpieza cada 30 segundos
    });

    // Evento 'messageCreate' para manejar la creación de nuevos mensajes
    client.on('messageCreate', async message => {
        // Verificar si el mensaje se envió en un servidor
        if (!message.guild) return;

        // Cargar la configuración del servidor desde la base de datos
        const guildSettings = await musicSchema.findOne({ guildId: message.guild.id });

        // Asegurarse de que la configuración del servidor exista y sea válida
        if (!guildSettings || !guildSettings.musicSearchChannelId || !guildSettings.musicSearchMessageId || !guildSettings.nowPlayingMessageId) {
            //console.log(`No se encontró configuración válida para la guild ${message.guild.id}`);
            return; // Salir si no hay configuración válida
        }

        const { musicSearchChannelId, musicSearchMessageId, nowPlayingMessageId } = guildSettings;

        // Verificar si el mensaje se envió en el canal de música configurado
        if (message.channel.id === musicSearchChannelId) {
            console.log(`Mensaje recibido en canal de música configurado: ${message.id}`);

            // No borrar los mensajes de control ni de Now Playing
            if (message.id === musicSearchMessageId) {
                console.log(`Mensaje ${message.id} es el mensaje de control, no se eliminará.`);
                return;
            }

            if (message.id === nowPlayingMessageId) {
                console.log(`Mensaje ${message.id} es el mensaje de "Now Playing", no se eliminará.`);
                return;
            }

            // Verificar si el mensaje ya fue eliminado
            setTimeout(async () => {
                const fetchedMessage = await message.channel.messages.fetch(message.id).catch(() => null); 
                if (!fetchedMessage) {
                    console.log(`Mensaje ${message.id} ya fue eliminado.`);
                    return;
                }

                // Borrar el mensaje si aún existe
                try {
                    await fetchedMessage.delete();
                    console.log(`Mensaje ${message.id} eliminado correctamente.`);
                } catch (error) {
                    console.error(`Error al eliminar el mensaje ${message.id}:`, error);
                }
            }, 15000); // Eliminar mensajes después de 15 segundos
        }
    });
};
