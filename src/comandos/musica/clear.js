const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Usalo para limpiar la lista de canciones actuales'),

    run: async ({ client, interaction }) => {

        try {
            //Usuario y Mencion
            const { user: author } = interaction;
            const userMention = `<@${author.id}>`;

            //Canal de voz y cliente
            const userChannel = interaction.member.voice.channel;
            const channelId = userChannel.id;

            const clientChannel = interaction.guild.members.me.voice.channel.id;
            const queue = useQueue(interaction.guildId);

            //Verificar Chat de Voz
            if (!userChannel) {
                await interaction.editReply({ content: `${userMention} Debes unirte a un canal de voz para usar este comando`, ephemeral: true });
                return;
            };

            //Verificar Queue
            if (!queue || !queue.currentTrack) {
                await interaction.editReply({ content: `${userMention} No hay una cancion reproduciendose actualmente`, ephemeral: true });
                return;
            };

            //Verificar mismo canal de voz 
            if (queue || queue.currentTrack) {
                if (clientChannel != channelId) {
                    await interaction.editReply({ content: `${userMention} Necesitas estar en el mismo canal de voz`, ephemeral: true });
                    return;
                };
            };


            //Creacion de Embed
            const queuemsg = new EmbedBuilder()
                .setTitle(`Cola limpiada exitosamente`)
                .addFields({ name: `Pedido por: `, value: `${userMention}` })
                .setColor(parseInt('313850', 16))
                .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                .setTimestamp();


            // Si hay una cola, limpiar las canciones
            if (queue.tracks.size) {
                queue.clear();
            }

            // Si hay una canción en reproducción, detenerla
            if (queue.currentTrack) {
                queue.node.stop();
            }
            await interaction.editReply({ embeds: [queuemsg] });

        } catch (error) {
            console.log(`Ocurrio un error al ejecutar clear.js`, error);
            await interaction.editReply({ content: `No pude limpiar la cola`, ephemeral: true });
            return;
        }
    },
};