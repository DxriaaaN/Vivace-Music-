const { SlashCommandBuilder, EmbedBuilder, userMention } = require(`@discordjs/builders`);
const { useQueue } = require(`discord-player`);

module.exports = {
    data: new SlashCommandBuilder()
        .setName(`disconnect`)
        .setDescription(`Usalo para que el bot se desconecte del canal`),

    run: async ({ client, interaction }) => {

        try {

            //Queue
            const queue = useQueue(interaction.guildId);

            //Usuario y Mencion
            const { user: author } = interaction;
            const userMention = `<@${author.id}>`;

            //Canal de Voz
            const userChannel = interaction.member.voice.channel;
            const channelId = userChannel.id;

            //Canal de Voz Cliente
            const clientChannel = interaction.guild.members.me.voice.channel.id;

            //Verificar si existe un canal de voz
            if (!userChannel) {
                await interaction.editReply({ content: `${userMention} Necesitas estar en un canal de voz`, ephemeral: true });
                return;
            };

            //Verificar mismo canal de voz
            if (queue || queue.currentTrack) {
                if (clientChannel != channelId) {
                    await interaction.editReply({ content: `${userMention} Debes estar en el mismo canal de voz`, ephemeral: true });
                    return;
                };
            };

            //Creacion Embed
            const disconnectmsg = new EmbedBuilder()
                .setTitle(`Bot desconectado exitosamente. Nos Vemos 👋`)
                .addFields(
                    { name: `Pedido por: `, value: `${userMention}` }
                )
                .setColor(parseInt('313850', 16))
                .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                .setTimestamp();

            //Destruccion y Desconeccion.
            // Si hay una cola, limpiar las canciones
            if (queue.tracks.size) {
                queue.clear();
            }

            // Si hay una canción en reproducción, detenerla
            if (queue.currentTrack) {
                queue.node.stop();
            }
            queue.connection.disconnect();

            //Envio Respuesta
            await interaction.editReply({ embeds: [disconnectmsg] });

        } catch (error) {
            console.log(`Hubo un error al ejecutar disconnect.js`, error);
            await interaction.editReply({ content: `No pude abandonar el canal de voz`, ephemeral: true });
            return;
        }
    },
};