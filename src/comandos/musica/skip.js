const { SlashCommandBuilder, EmbedBuilder, userMention } = require('@discordjs/builders');
const { useQueue, useHistory } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Usalo para saltar entre canciones')
        .addSubcommand(subcommand =>
            subcommand
                .setName('cancion')
                .setDescription(`Usalo para saltar la cancion actual`)
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('to')
                .setDescription(`Usalo para saltar hacia una cancion con su numero en la queue.`)
                .addIntegerOption(option =>
                    option
                        .setName('numero')
                        .setDescription('Numero de la cancion en la lista, para saltar a ella')
                        .setRequired(true)
                )
        ),

    run: async ({ client, interaction }) => {

        try {
            //Uso Current y History Queue
            const currentQueue = useQueue(interaction.guildId);
            const oldQueue = useHistory(interaction.guildId);

            //Canal user y client
            const userChannel = interaction.member.voice.channel;
            const channelId = userChannel.id;

            const clientChannel = interaction.guild.members.me.voice.channel.id;

            //Usuario y Mencion
            const { user: author } = interaction;
            const userMention = `<@${author.id}>`;

            //Verificar Voice Channel
            if (!userChannel) {
                await interaction.editReply({ content: `${userMention} Necesitas estar en un canal de voz`, ephemeral: true });
                return;
            };

            //Verificar si hay canciones
            if (!currentQueue || !currentQueue.currentTrack) {
                await interaction.editReply({ content: `${userMention} No hay canciones reproduciendose`, ephemeral: true });
                return;
            };

            //Verificar mismo canal de voz
            if (currentQueue || currentQueue.currentTrack) {
                if (clientChannel != channelId) {
                    await interaction.editReply({ content: `${userMention} Necesitas estar en mi canal de voz`, ephemeral: true });
                    return;
                };
            };


            const subcommand = interaction.options.getSubcommand();

            if (subcommand === 'cancion') {
                currentQueue.node.skip();
                if (oldQueue.nextTrack) {
                    const nextSong = oldQueue.nextTrack
                    const currentSong = currentQueue.currentTrack

                    const currentSongEmbed = new EmbedBuilder()
                    .setColor(parseInt('313850', 16))
                    .setTitle(`Se salto la canción: ${currentSong.title}`)
                    .addFields(
                        { name: 'Agregada por:', value: `${currentSong.requestedBy}`, inline: true },
                        { name: 'Autor/es:', value: `${currentSong.author}`, inline: true },
                        { name: 'Duración:', value: `${currentSong.duration}`, inline: true },
                    )
                    .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                    .setTimestamp();

                    const nextSongEmbed = new EmbedBuilder()
                    .setColor(parseInt('313850', 16))
                    .setTitle(`Próxima Canción: ${nextSong.title}`)
                    .addFields(
                        { name: 'Agregada por: ', value: `${nextSong.requestedBy}`, inline: true },
                        { name: 'Autor/es: ', value: `${nextSong.author}`, inline: true },
                        { name: 'Duración: ', value: `${nextSong.duration}`, inline: true },
                    )
                    .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                    .setTimestamp();

                    await interaction.editReply({ embeds: [currentSongEmbed, nextSongEmbed] });
                } else {
                    const currentSong = currentQueue.currentTrack

                    const currentSongEmbed = new EmbedBuilder()
                    .setColor(parseInt('313850', 16))
                    .setTitle(`Se salto la canción: ${currentSong.title}`)
                    .addFields(
                        { name: 'Agregada por:', value: `${currentSong.requestedBy}`, inline: true },
                        { name: 'Autor/es:', value: `${currentSong.author}`, inline: true },
                        { name: 'Duración:', value: `${currentSong.duration}`, inline: true },
                    )
                    .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                    .setTimestamp();

                    await interaction.editReply({ embeds: [currentSongEmbed] });
                };
                return;
            } else if (subcommand === 'to') {

                // Verificar que el número de canción es válido
                const tracks = currentQueue.tracks.toArray();
                const numberSong = interaction.options.getInteger('numero')

                //Numero ingresado mayor que 0
                if (numberSong < 1 || numberSong > tracks.length) {
                    await interaction.editReply({
                        content: `${userMention} El número de canción es inválido. Elige un número entre 1 y ${tracks.length}`,
                        ephemeral: true
                    });
                    return;
                }
                // Saltar a la canción seleccionada
                const selectedTrack = tracks[numberSong - 1];
                currentQueue.node.skipTo(numberSong - 1);
                //Embed Cancion.
                const skipToEmbed = new EmbedBuilder()
                    .setColor(parseInt('313850', 16))
                    .setTitle(`Se ha saltado a la canción: ${selectedTrack.title}`)
                    .addFields(
                        { name: 'Agregada por:', value: `${selectedTrack.requestedBy}`, inline: true },
                        { name: 'Autor/es:', value: `${selectedTrack.author}`, inline: true },
                        { name: 'Duración:', value: `${selectedTrack.duration}`, inline: true },
                        { name: 'Pedido por: ', value: `${userMention}`, inline: true }
                    )
                    .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                    .setTimestamp();
                await interaction.editReply({ embeds: [skipToEmbed] });
                return;
            };
        } catch (error) {
            console.log('Hubo un error al ejecutar skip.js', error); 
            await interaction.editReply({content: `${userMention} No eh podido saltar la cancion que pediste`, ephemeral: true});
            return;
        }
    },
};