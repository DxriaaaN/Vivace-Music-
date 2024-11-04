const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, VoiceChannel } = require('discord.js');
const { Track, QueryType, useMainPlayer, useQueue } = require('discord-player');
const ytsr = require('youtube-sr').default;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Reproduce una canción, playlist o álbum <3')
        .addStringOption(option =>
            option.setName('url')
                .setDescription('Busca tu canción favorita <3')
                .setRequired(true)),

    run: async ({ client, interaction }) => {

        try {
            // Variables iniciales
            const MAX_QUEUE_SIZE = 1000;
            const player = useMainPlayer();
            const userVoiceChannel = interaction.member.voice.channel;
            const queue = useQueue(interaction.guildId);
            const { user: author } = interaction;
            const guildId = interaction.guildId
            const userMention = `<@${author.id}>`;

            // Verificar que el usuario esté en un canal de voz
            if (!userVoiceChannel) {
                return interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setColor(parseInt('313850', 16))
                        .setDescription('Necesitas estar en un canal de voz para usar este comando :D')
                        .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                        .setTimestamp()]
                });
            }

            // Obtener la canción solicitada
            const song = interaction.options.getString('url');

            // Comprobar si se proporcionó una canción
            if (!song) {
                await interaction.editReply({
                    embeds: [new EmbedBuilder()
                        .setColor(parseInt('313850', 16))
                        .setDescription(`El enlace ingresado no es válido, por favor intenta de nuevo ${userMention}`)
                        .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                        .setTimestamp()]
                });
                return;
            }

            // Comprobar si el bot y el usuario están en el mismo canal de voz
            if (queue && queue.isPlaying()) {
                let interaccionuser = interaction.member.voice.channel.id;
                let interaccionclient = interaction.guild.members.me.voice.channel.id;
                if (interaccionclient != interaccionuser) {
                    await interaction.channel.send(`${userMention} Debes estar en el mismo canal que yo para usar play.`);
                    return;
                }
            }

            // Verificar si el bot está en un canal de voz diferente y si la cola está vacía
            const botVoiceChannel = interaction.guild.members.me.voice.channel;
            if (botVoiceChannel && botVoiceChannel.id !== userVoiceChannel.id) {
                if (!queue || !queue.isPlaying() || queue.tracks.size === 0) {
                    await interaction.guild.members.me.voice.disconnect();
                    await player.node.join(userVoiceChannel);
                } else {
                    return interaction.editReply({
                        embeds: [new EmbedBuilder()
                            .setColor(parseInt('313850', 16))
                            .setDescription(`${userMention} Ya estoy reproduciendo música en otro canal. Únete a mi canal de voz o espera a que termine.`)
                            .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                            .setTimestamp()]
                    });
                }
            }


            let embed = new EmbedBuilder()
                .setColor(parseInt('313850', 16))
                .setDescription('Estoy buscando lo que pediste >.<')
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` });

            const msg = await interaction.editReply({ embeds: [embed], fetchReply: true });

            try {
                //DEFINICION GLOBAL
                // Definir la expresión regular para enlaces
                const linkRegex = /^(http|https):\/\/[^ "]+$/;

                //YoutubeMix
                const youtubeMixRegex = /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[^&]+&list=RD[^&]+(&|$)/;

                //SoundCloud
                const soundcloudTrackRegex = /^https?:\/\/(www\.)?soundcloud\.com\/[^\/]+\/[^\/]+(?:\?.*)?$/i;
                const soundcloudPlaylistRegex = /^https?:\/\/(www\.)?soundcloud\.com\/[^\/]+\/sets\/[^\/]+(?:\?.*)?$/i;

                //Apple
                const appleSong = /^https?:\/\/(?:music|itunes)\.apple\.com\/(?:[a-zA-Z]{2,3}\/)?album\/[^\/]+\/\d+\?i=\d+.*$/i;
                const appleAlbum = /^https?:\/\/(?:music|itunes)\.apple\.com\/(?:[a-zA-Z]{2,3}\/)?album\/[^\/]+\/\d+.*$/i;
                const applePlaylist = /^https?:\/\/(?:music|itunes)\.apple\.com\/(?:[a-zA-Z]{2,3}\/)?playlist\/[^\/]+\/[a-zA-Z0-9.\-]+.*$/i;

                let research;

                //COMPRUEBA TEXTO
                if (!linkRegex.test(song)) {
                    // Si no es un enlace, se asume que es una búsqueda de texto
                    research = await player.search(song, {
                        requestedBy: interaction.member,
                        searchEngine: QueryType.AUTO_SEARCH,
                    });

                    if (!research.hasTracks()) {
                        return interaction.editReply({
                            embeds: [new EmbedBuilder()
                                .setColor(parseInt('313850', 16))
                                .setDescription('No he podido encontrar resultados 😔')
                                .setTimestamp()
                                .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                            ]
                        });
                    }

                    // Presentar opciones al usuario
                    embed = new EmbedBuilder()
                        .setColor(parseInt('313850', 16))
                        .setTitle('Escribe en el chat el número de la canción que quieres')
                        .setDescription('De no ingresar nada, se elegirá la primera opción.')
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` });

                    const choices = research.tracks.slice(0, 5);
                    choices.forEach((track, index) => {
                        embed.addFields(
                            { name: `Opción ${index + 1}: ${track.title}`, value: `Por: ${track.author}` },
                            { name: 'Duración:', value: `${track.duration}`, inline: true }
                        );
                    });

                    await msg.edit({ embeds: [embed] });

                    const filter = (m) => m.author.id === interaction.user.id;
                    try {
                        const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 10000, errors: ['time'] });
                        const responseMessage = collected.first();
                        const choice = parseInt(responseMessage.content);
                        if (isNaN(choice) || choice < 1 || choice > choices.length) {
                            research.tracks = [choices[0]];
                        } else {
                            research.tracks = [choices[choice - 1]];
                        }
                        responseMessage.delete();
                    } catch {
                        research.tracks = [choices[0]];
                    }
                } else { //MANEJADOR DE ENLACES UNICAMENTE.
                    try{

                    // Si es un enlace, determinar el 'searchEngine' POR DEFAULT.
                    let searchEngine = QueryType.AUTO;


                    //Soundcloud Music
                    try {
                        if (soundcloudTrackRegex.test(song)) {
                            searchEngine = QueryType.SOUNDCLOUD_TRACK;
                        } else if (soundcloudPlaylistRegex.test(song)) {
                            searchEngine = QueryType.SOUNDCLOUD_PLAYLIST;
                        }
                    } catch (error) {
                        return message.channel.send('Reproduce/Agrega una cancion antes de iniciar la reproduccion de Soundcloud.');
                    }

                    //Apple Music
                    if (appleSong.test(song)) {
                        searchEngine = QueryType.APPLE_MUSIC_SONG;
                    } else if (appleAlbum.test(song)) {
                        searchEngine = QueryType.APPLE_MUSIC_ALBUM;
                    } else if (applePlaylist.test(song)) {
                        searchEngine = QueryType.APPLE_MUSIC_PLAYLIST;
                    }

                    //Youtube Mix
                    if (youtubeMixRegex.test(song)) {

                        const playlist = await ytsr.getPlaylist(song);
                        //console.log(playlist)
                        if (!playlist) {
                            embed = new EmbedBuilder()
                                .setColor(parseInt('313850', 16))
                                .setDescription('No se pudo encontrar la lista de Mix en YouTube')
                                .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                                .setTimestamp();
                            await msg.edit({ embeds: [embed] });
                            return;
                        }

                        let trackCount = 0

                        // Crear y agregar cada pista individualmente
                            for (const video of playlist.videos) {
                                const track = new Track(player, {
                                    id: video.id,
                                    title: video.title,
                                    duration: video.durationFormatted,
                                    thumbnail: video.thumbnail.url,
                                    author: video.channel.name,
                                    requestedBy: interaction.user,
                                    source: 'youtube',
                                    url: `https://www.youtube.com/watch?v=${video.id}`
                                });
                                // Reproducir la canción o agregarla a la cola
                                if (!queue || !queue.isPlaying() || queue.tracks.size === 0){
                                const queue = player.queues.create(guildId)
                                await queue.connect(userVoiceChannel)
                                queue.addTrack(track);
                                trackCount++;
                                } else {
                                    queue.addTrack(track);
                                    trackCount++;
                                }
                            }

                        embed = new EmbedBuilder()
                            .setColor(parseInt('313850', 16))
                            .setDescription(`Se añadieron ${trackCount} canciones del Mix de YouTube a la cola.`)
                            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
                            .setTimestamp();
                        await msg.edit({ embeds: [embed] });
                    }

                    // Realizar la búsqueda con el 'searchEngine' DEFAULT EN CASO DE NO CUMPLIRSE LOS ANTERIORES.
                    research = await player.search(song, {
                        requestedBy: interaction.member,
                        searchEngine: searchEngine,
                    });
                    //Si no se pudo encontrar con ninguno de los dos metodos anteriores.
                    if (!research.hasTracks()) {
                        embed = new EmbedBuilder()
                            .setColor(parseInt('313850', 16))
                            .setDescription('No pude encontrar lo que me pediste')
                            .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                            .setTimestamp();
                        await msg.edit({ embeds: [embed] });
                        return;
                    }
                } catch (error){
                    console.log(error);
                }
            }

                // Verificar Tamaño de la Cola
                if (research?.tracks?.length + (queue?.size ?? 0) > MAX_QUEUE_SIZE) {
                    return await msg.edit({
                        embeds: [new EmbedBuilder()
                            .setColor(parseInt('313850', 16))
                            .setDescription(`No puedo reproducir algo superior a: ${MAX_QUEUE_SIZE} Canciones`)
                            .setTimestamp()
                            .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                        ]
                    });
                }
                // Reproducir la canción o agregarla a la cola
                const res = await player.play(interaction.member.voice.channel.id, research, {
                    nodeOptions: {
                        metadata: {
                            channel: interaction.channel,
                            client: interaction.guild.members.me,
                            requestedBy: interaction.user,
                            guild: interaction.guild,
                        },
                        volume: 50,
                        maxSize: MAX_QUEUE_SIZE,
                        bufferingTimeout: 15000,
                        leaveOnStop: true,
                        leaveOnStopCooldown: 0,
                        leaveOnEnd: false,
                        leaveOnEmpty: true,
                        leaveOnEmptyCooldown: 200000,
                        skipOnNoStream: true,
                    },

                })

                //Ver cancion actual en consola
                console.log(`Reproduciendo [${res.track.title}] en el canal [${interaction.member.voice.channel.name}]`);

                //Sistema de Radio URL
                const radioUrls = [
                    'https://live.truckers.fm/?1710903442447',
                    'https://secure.streaming01.dwservers.net/8100/'
                ];

                if (radioUrls.includes(song)) {
                    embed = new EmbedBuilder()
                        .setColor(parseInt('313850', 16))
                        .setTitle('Reproduciendo Radio')
                        .setDescription(`Reproduciendo desde: [${song === radioUrls[0] ? 'Truckers FM' : 'Trance FM'}]`)
                        .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                        .setTimestamp();
                } else {
                    embed = new EmbedBuilder()
                        .setColor(parseInt('313850', 16))
                        .setTitle(`${!queue?.currentTrack ? 'Ahora estoy reproduciendo' : 'Canción agregada a la lista'}`)
                        .setThumbnail(res.track.thumbnail)
                        .setDescription(`[${res.track.title}](${res.track.url})`)
                        .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                        .setTimestamp();
                }

                if (res.searchResult?.playlist) {
                    embed
                        .setTitle('Playlist/Álbum encontrado ❤️')
                        .setColor(parseInt('313850', 16))
                        .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                        .addFields({ name: 'Título:', value: `[${res.searchResult.playlist.title}](${res.searchResult.playlist.url})` });
                }

                await msg.edit({ embeds: [embed] });

            } catch (error) {
                console.error(error);
                return await msg.edit({
                    embeds: [new EmbedBuilder()
                        .setColor(parseInt('313850', 16))
                        .setDescription('No he podido encontrar lo que solicitaste :(')
                        .setTimestamp()
                        .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                    ]
                });
            }
        } catch (error) {
            console.error('Error al ejecutar el comando', error);
            await interaction.editReply({ content: 'No fue posible reproducir la canción', ephemeral: true });
            return;
        }
    },
};
