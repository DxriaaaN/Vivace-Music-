// events/messageCreate.js
const Trigger = require('../../../functions/database/schemas/triggerSchema');

module.exports = (client) => {
    client.on('messageCreate', async (message) => {
        if (message.author.bot) return; // Ignorar mensajes de bots

        const content = message.content.toLowerCase();
        const guildId = message.guild.id;

        // Verificar si el usuario está en un canal de voz
        if (!message.member.voice.channel) {
            // Puedes enviar un mensaje al usuario si lo deseas
            return;
        }

        // Obtener los triggers del servidor
        let triggerDoc = await Trigger.findOne({ guildId });

        if (!triggerDoc || triggerDoc.triggers.length === 0) return;

        // Buscar si el mensaje contiene algún trigger
        for (const { trigger, url } of triggerDoc.triggers) {
            if (content.includes(trigger)) {
                // Obtener el comando 'play'
                const playCommand = client.musicacommands.get('play');
                if (playCommand) {
                    // Crear una interacción falsa
                    const fakeInteraction = {
                        options: {
                            getString: () => url
                        },
                        id: message.id,
                        guildId: message.guild.id,
                        member: message.member,
                        guild: message.guild,
                        channel: message.channel,
                        user: message.author,
                        reply: ({ content }) => message.channel.send(content),
                        followUp: ({ content }) => message.channel.send(content),
                        deferReply: () => Promise.resolve(),
                        editReply: ({ embeds }) => message.channel.send({ embeds })
                    };

                    try {
                        await playCommand.run({ client, interaction: fakeInteraction });
                    } catch (error) {
                        console.error(error);
                    }
                }

                break; // Salir del bucle después de encontrar el primer trigger
            }
        }
    });
};