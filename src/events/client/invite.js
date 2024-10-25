module.exports = (client) => {
    try {
        client.on('messageCreate', async (message) => {
            // Verifica si el mensaje menciona al bot
            if (message.mentions.has(client.user)) {
                // Verifica si el mensaje contiene la palabra 'invitacion'
                if (message.content.toLowerCase().includes('invitacion')) {
                    try {
                        const inviteLink = "https://discord.com/oauth2/authorize?client_id=1292066121679372290&permissions=8&integration_type=0&scope=bot";
                        return message.channel.send(`Aquí tienes el enlace de invitación del bot: ${inviteLink}`);
                    } catch (error) {
                        console.error('Error al generar la invitación: ', error);
                        return message.channel.send('Hubo un error al generar el enlace de invitación.');
                    }
                }
            }
        });
    } catch (error) {
        console.error('No se pudo enviar la invitación', error);
    }
};