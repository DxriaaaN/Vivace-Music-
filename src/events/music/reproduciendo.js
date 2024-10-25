const { EmbedBuilder } = require('discord.js');
const { useQueue, useHistory } = require('discord-player');
const musicSchema = require('../../functions/database/schemas/musicSchema');
module.exports = (client) => {

    //Cuando se reinicia el bot
    client.on('ready', async () => {
        console.log('Bot ha reiniciado, actualizando los mensajes de "Now Playing"...');

        // Obtener todas las configuraciones de música de la base de datos
        const allSettings = await musicSchema.find();

        for (const settings of allSettings) {
            const { guildId, musicSearchChannelId, nowPlayingMessageId } = settings;

            try {
                // Buscar el canal de música y el mensaje "Now Playing"
                const channel = await client.channels.fetch(musicSearchChannelId).catch(console.error);
                if (!channel) {
                    console.log(`Canal de música no encontrado en guild: ${guildId}`);
                    continue;
                }

                const message = await channel.messages.fetch(nowPlayingMessageId).catch(console.error);
                if (!message) {
                    console.log(`Mensaje "Now Playing" no encontrado en guild: ${guildId}`);
                    continue;
                }

                // Crear embed de "Nada se está reproduciendo en este momento"
                const nowPlayingEmbed = new EmbedBuilder()
                    .setColor(parseInt('313850', 16))
                    .setTitle('Nada se está reproduciendo en este momento.')
                    .setDescription('La música se detuvo o la cola está vacía.')
                    .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` });

                // Actualizar el mensaje "Now Playing"
                await message.edit({ embeds: [nowPlayingEmbed] });
                console.log(`Actualizado el mensaje "Now Playing" en guild: ${guildId}`);

            } catch (error) {
                console.error(`Error al actualizar el mensaje en guild ${guildId}:`, error);
            }
        }
    });

    //Evento Track Start
    client.player.events.on('playerStart', async (queue) => {

        //GuldId Y Cancion Actual
        const guildId = queue.guild.id;
        const track = queue.currentTrack;

        //Cargar Configuracion Schema Music
        const settings = await musicSchema.findOne({ guildId });

        //Verifica ajustes y id de canales.
        if (settings && settings.musicSearchChannelId && settings.nowPlayingMessageId) {

            //Busca el canal en base al id existente.
            const channel = await client.channels.fetch(settings.musicSearchChannelId);

            if (!channel) return;

            try {
                //Busca el mensaje por ID
                const message = await channel.messages.fetch(settings.nowPlayingMessageId);

                //Asigna el proximo tema
                const nextTrack = useHistory(guildId)?.nextTrack?.title || 'Ninguno'; // Verificar si `nextTrack` existe
                const songsData = queue.tracks.data;

                const nowPlayingEmbed = new EmbedBuilder()
                    .setColor(parseInt('313850', 16))
                    .setTitle(`Reproduciendo ahora: ${track.title}`)
                    .addFields(
                        { name: `🎤 Artista:`, value: `${track.author}`, inline: true },
                        { name: `⌛ Duración:`, value: `${track.duration}`, inline: true },
                        { name: `🔤 En cola:`, value: `${songsData.length}`, inline: true },
                        { name: `Pedido por:`, value: `${track.requestedBy}`, inline: true },
                        { name: `Siguiente:`, value: `${nextTrack}`, inline: true }
                    )
                    .setThumbnail(track.thumbnail)
                    .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                    .setTimestamp();

                await message.edit({ embeds: [nowPlayingEmbed] });

            } catch (error) {
                console.log('Error al editar el mensaje de inicio', error);
            }
        };
    });


    //Evento Tracks End
    client.player.events.on('playerFinish', async (queue) => {
        const guildId = queue.guild.id;
        const settings = await musicSchema.findOne({ guildId });

        if (settings && settings.musicSearchChannelId && settings.nowPlayingMessageId) {
            const channel = await client.channels.fetch(settings.musicSearchChannelId);
            if (!channel) return;

            try {
                const message = await channel.messages.fetch(settings.nowPlayingMessageId);

                const nowPlayingEmbed = new EmbedBuilder()
                    .setColor(parseInt('313850', 16))
                    .setTitle('Nada se está reproduciendo en este momento.')
                    .setDescription('La música se detuvo o la cola está vacía.')
                    //.setThumbnail('https://example.com/default_thumbnail.png')
                    .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })

                await message.edit({ embeds: [nowPlayingEmbed] });
            } catch (error) {
                console.error('Error al editar el mensaje de finalización:', error);
            }
        }
    });


    //Evento Kick o Disconect
    client.player.events.on('disconnect', async (queue) => {
        const guildId = queue.guild.id;
        const settings = await musicSchema.findOne({ guildId });

        if (settings && settings.musicSearchChannelId && settings.nowPlayingMessageId) {
            const channel = await client.channels.fetch(settings.musicSearchChannelId);
            if (!channel) return;

            try {
                const message = await channel.messages.fetch(settings.nowPlayingMessageId);

                const disconnectEmbed = new EmbedBuilder()
                    .setColor(parseInt('313850', 16))
                    .setTitle('Nada se está reproduciendo en este momento.')
                    .setDescription('El bot fue desconectado del canal de voz.')
                    //.setThumbnail('https://example.com/default_thumbnail.png')
                    .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })

                await message.edit({ embeds: [disconnectEmbed] });
            } catch (error) {
                console.error('Error al editar el mensaje tras desconexión:', error);
            }
        }
    });
}
