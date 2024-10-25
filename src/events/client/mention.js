module.exports = (client) => {
    try {
        client.on('messageCreate', async (message) => {
            // Verificar si el bot fue mencionado
            if (message.mentions.has(client.user)) {
                const contenidoMensaje = message.content.toLowerCase();
                if (contenidoMensaje.includes('ayuda') || contenidoMensaje.includes('help')) {
                    try {
                        // Enviar el mensaje de ayuda
                        await message.channel.send(`Hola, ¿cómo estás? Mi comando de ayuda es /help.`);
                    } catch (error) {
                        console.error('Error al enviar el mensaje de ayuda: ', error);
                        await message.channel.send('Hubo un error al enviar el mensaje de ayuda.');
                    }
                }
            }
        });
    } catch (error) {
        console.error('No se pudo enviar el mensaje de ayuda', error);
    }
};
