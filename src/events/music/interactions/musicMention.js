const { useQueue } = require('discord-player');
const musicSchema = require('../../../functions/database/schemas/musicSchema');
const dotenv = require('dotenv');

module.exports = (client) => {

    client.on('messageCreate', async (message) => {

        //Prefix del Bot
        dotenv.config({ path: './config/.env' });
        const prefix = process.env.prefix

        //Ajustes Usuario y Cliente
        const botMention = message.mentions.users.has(client.user.id);

        //Ajustes para las Guild
        const allSettings = await musicSchema.find();
        const guildSettings = allSettings.find(guild => guild.guildId === message.guild.id);
        const musicSearchChannelId = guildSettings?.musicSearchChannelId; 

        //Verificacion Bot o No Mencion
        if (message.author.bot || !message.content) return;

        if (!(botMention || message.content.startsWith(prefix))) return;

        //Verificacion Undefined Channel
        if (!musicSearchChannelId) {
            console.log('No hay una configuracion establecida de canal.')
            return;
        }

        //Ignorar music-search
        if (message.channel.id === musicSearchChannelId) return;


        //Proxima Expansion Radio System


        //Logica Enlaces de Musica y Activar Eventos (No Music-Search)

        //Canciones y Playlist MusicYT && Youtube. Incluido Telefono y Shorts.
        const urlPatternsYT = [
            { regex: /https?:\/\/(?:www\.)?youtube\.com\/watch\?(?!.*music\.youtube\.com)\S+/, type: 'youtube', subcommand: 'cancion' }, //YT Song
            { regex: /https?:\/\/(?:www\.)?youtube\.com\/playlist\?(?!.*music\.youtube\.com)list=\S+/, type: 'youtube', subcommand: 'playlist' }, //YT Playlist
            { regex: /https?:\/\/music\.youtube\.com\/watch\?v=\S+/, type: 'youtube-music', subcommand: 'musiccancion' }, //YT Music Song
            { regex: /https?:\/\/(?:www\.)?(?:music\.)?youtube\.com\/playlist\?list=\S+/, type: 'youtube-music', subcommand: 'musicplaylist' }, //YT Music Playlist
            { regex: /https?:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/, type: 'youtube', subcommand: 'youtube-corto' },   //YT Enlaces Telefono
            { regex: /https?:\/\/(www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/, type: 'youtube-shorts', subcommand: 'shorts' } //YT Enlaces Shorts
        ];

        //Comprobacion Links y Ejecucion Acorde
        const urlMatchYT = urlPatternsYT.find(pattern => pattern.regex.test(message.content));

        if (urlMatchYT) {
            let url = message.content.match(urlMatchYT.regex)[0];
            const subcommandName = urlMatchYT.subcommand;
            const type = urlMatchYT.type;

            if (type === 'youtube-corto') {
                const videoId = message.content.match(urlMatchYT.regex)[1]; // Obtener ID del video
                url = `https://www.youtube.com/watch?v=${videoId}`; // Convertirlo a URL completa
            };

            //Ejecucion Play.js
            const playCommand = client.musicacommands.get('play');
            if (playCommand) {
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
                    console.error('Hubo un problema con YT musicMention.js', error);
                }
                return;
            };
        };



        //Busqueda Canciones && Playlist Spotify
        const urlPatternsSpotify = [
            { regex: /https?:\/\/(?:www\.)?open\.spotify\.com\/intl-es\/track\/\S+/, type: 'spotify-song', subcommand: 'cancion' }, //Spotify Song
            { regex: /https?:\/\/(?:open\.)?spotify\.com\/track\/\S+/, type: 'spotify-track', subcommand: 'cancion' }, //Spotify Song-Track
            { regex: /https?:\/\/open\.spotify\.com\/intl-\w{2}\/track\/\S+/, type: 'spotify-Int', subcommand: 'cancion' }, //Spotify Song-Intl-Track
            { regex: /https?:\/\/(?:open\.)?spotify\.com\/playlist\/\S+/, type: 'spotify-playlist', subcommand: 'cancion' }, //Spotify Playlist
            { regex: /https?:\/\/(?:open\.spotify\.com|open\.spotify\.com\/intl-\w{2})\/album\/\S+/, type: 'spotify-album', subcommand: 'cancion' }//Spotify Album
        ];

        //Comprobacion Links y Ejecucion Acorde
        const urlMatchSpotify = urlPatternsSpotify.find(pattern => pattern.regex.test(message.content));


        if (urlMatchSpotify) {
            let url = message.content.match(urlMatchSpotify.regex)[0];
            url = url.replace(/\/intl-\w{2}\//, '/');

            // Ejecutar el comando 'play'
            const playCommand = client.musicacommands.get('play');
            if (playCommand) {
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
                    console.error('Ocurrio un error al ejecutar el evento de play', error);
                    return;
                }
                return;
            };
        };

        //Busqueda Canciones, Playlist y Album Apple
        const urlPatternsAppleSoundcloud = [
            { regex: /^https?:\/\/(?:music|itunes)\.apple\.com\/(?:[a-zA-Z]{2,3}\/)?album\/[^\/]+\/\d+\?i=\d+.*$/i , type: 'apple-song', subcommand: 'cancion' }, //Apple Song
            { regex: /^https?:\/\/(?:music|itunes)\.apple\.com\/(?:[a-zA-Z]{2,3}\/)?album\/[^\/]+\/\d+.*$/i, type: 'apple-album', subcommand: 'cancion' }, //Apple Album
            { regex: /^https?:\/\/(?:music|itunes)\.apple\.com\/(?:[a-zA-Z]{2,3}\/)?playlist\/[^\/]+\/[a-zA-Z0-9.\-]+.*$/i , type: 'apple-playlist', subcommand: 'cancion' }, //Apple Playlist
           
            { regex: /^https?:\/\/(www\.)?soundcloud\.com\/[^\/]+\/[^\/]+(?:\?.*)?$/i, type: 'soundcloud-song', subcommand: 'cancion' }, //SoundCloud Song
            { regex: /^https?:\/\/(www\.)?soundcloud\.com\/[^\/]+\/sets\/[^\/]+(?:\?.*)?$/i, type: 'soundcloud-playlist-album', subcommand: 'cancion' }//SoundCloud Playlist/Album
        ];

        //Comprobacion Links y Ejecucion Acorde
        const urlMatchAppleSoundcloud = urlPatternsAppleSoundcloud.find(pattern => pattern.regex.test(message.content));


        if (urlMatchAppleSoundcloud) {
            let url = message.content.match(urlMatchAppleSoundcloud.regex)[0];
            url = url.replace(/\/intl-\w{2}\//, '/');

            // Ejecutar el comando 'play'
            const playCommand = client.musicacommands.get('play');
            if (playCommand) {
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
                    console.error('Ocurrio un error al ejecutar el evento de play', error);
                    return;
                }
                return;
            };
        };

        //Busqueda Por Terminos
        const searchCommandPattern = /busca\s+(.+)$/i;
        const searchMatches = message.content.match(searchCommandPattern);
        if (searchMatches) {
            const searchQuery = searchMatches[1];
            const playCommand = client.musicacommands.get('play');

            if (playCommand && searchQuery) {
                const fakeInteraction = {
                    options: {
                        // getSubcommand: () => subcommandName,
                        getString: () => searchQuery
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
                    editReply: ({ content, embeds }) => message.channel.send({ content, embeds })
                };

                try {
                    await playCommand.run({ client, interaction: fakeInteraction });
                } catch (error) {
                    console.error('Error al ejecutar el evento de búsqueda:', error);
                    return;
                }
                return;
            };
        };

        //Logica para manejar los diferentes comandos de musica. Loop, Autoplay, Skip, Shuffle, Queue, Stop, Resume, Disconnect && Clear.

        //Abandonar Canal
        const quitCommandPattern = new RegExp(`<@!?${client.user.id}>\\s*(quitar|abandonar|limpiar|desconectar)`, 'i');

        if (quitCommandPattern.test(message.content)) {
            const quitCommand = client.musicacommands.get('disconnect');
            if (quitCommand) {
                const fakeInteraction = {
                    id: message.id,
                    guildId: message.guild.id,
                    member: message.member,
                    guild: message.guild,
                    channel: message.channel,
                    user: message.author,
                    reply: ({ content }) => {
                        return content ? message.channel.send(content) : message.channel.send(`${message.author.toString()}Se limpio la lista de reproduccion... Nos vemos :(`);
                    },
                    editReply: ({ content }) => {
                        return content ? message.channel.send(content) : message.channel.send(`${message.author.toString()}Se limpio la lista de reproduccion... Nos vemos :(`);
                    },
                    deferReply: () => Promise.resolve(),
                };
                try {
                    await quitCommand.run({ client, interaction: fakeInteraction });
                } catch (error) {
                    console.error('Error al ejecutar el evento de abandonar: musicMention', error);
                    return;
                }
                return;
            };
        };

        //Mostrar Informacion de la Reproduccion Actual
        const infoCommandPattern = new RegExp(`<@!?${client.user.id}>\\s*(info|informacion|reproduciendo)`, 'i');

        if (infoCommandPattern.test(message.content)) {
            const infoCommand = client.musicacommands.get('info_music');
            if (infoCommand) {
                const fakeInteraction = {
                    options: {
                        getSubcommand: () => 'actual',
                        getString: () => { }
                    },
                    id: message.id,
                    guildId: message.guild.id,
                    member: message.member,
                    guild: message.guild,
                    channel: message.channel,
                    user: message.author,
                    reply: ({ content, embeds }) => message.channel.send({ content, embeds }),
                    editReply: ({ embeds }) => message.channel.send({ embeds }),
                    deferReply: () => Promise.resolve()
                };
                try {
                    await infoCommand.run({ client, interaction: fakeInteraction });
                } catch (error) {
                    console.error('Error al ejecutar el evento info:', error);
                    return;
                }
                return;
            };
        };

        //Funcion de Pausa
        const pauseCommandPattern = new RegExp(`<@!?${client.user.id}>\\s*(pause|pausar|detener|pausa)`, 'i');

        if (pauseCommandPattern.test(message.content)) {
            const pauseCommand = client.musicacommands.get('pausar');
            if (pauseCommand) {
                const fakeInteraction = {
                    id: message.id,
                    guildId: message.guild.id,
                    member: message.member,
                    guild: message.guild,
                    channel: message.channel,
                    user: message.author,
                    reply: ({ content }) => content ? message.channel.send(content) : null,
                    deferReply: () => Promise.resolve(),
                    editReply: ({ embeds }) => embeds ? message.channel.send({ embeds }) : null
                };
                try {
                    await pauseCommand.run({ client, interaction: fakeInteraction });
                } catch (error) {
                    console.error('Error al ejecutar el evento de pausa:', error);
                    return;
                }
                return;
            };
        };

        //Funcion de Reanudar
        const resumeCommandPattern = new RegExp(`<@!?${client.user.id}>\\s*(reanudar|reproducir|resume)`, 'i');

        if (resumeCommandPattern.test(message.content)) {
            const resumeCommand = client.musicacommands.get('reanudar');
            if (resumeCommand) {
                const fakeInteraction = {
                    id: message.id,
                    guildId: message.guild.id,
                    member: message.member,
                    guild: message.guild,
                    channel: message.channel,
                    user: message.author,
                    reply: ({ content }) => content ? message.channel.send(content) : null,
                    deferReply: () => Promise.resolve(),
                    editReply: ({ embeds }) => embeds ? message.channel.send({ embeds }) : null
                };
                try {
                    await resumeCommand.run({ client, interaction: fakeInteraction });
                } catch (error) {
                    console.error('Error al ejecutar el evento de reanudar:', error);
                    return;
                }
                return;
            };
        };

        // Activar el Shuffle
        const shuffleCommandPattern = new RegExp(`<@!?${client.user.id}>\\s*(shuffle|mezclar|mezcla)`, 'i');

        if (shuffleCommandPattern.test(message.content)) {
            const shuffleCommand = client.musicacommands.get('shuffle');
            if (shuffleCommand) {
                const fakeInteraction = {
                    id: message.id,
                    guildId: message.guild.id,
                    member: message.member,
                    guild: message.guild,
                    channel: message.channel,
                    user: message.author,
                    reply: ({ content, embeds }) => content ? message.channel.send(content) : embeds ? message.channel.send({ embeds }) : null,
                    followUp: ({ content, embeds }) => content ? message.channel.send(content) : embeds ? message.channel.send({ embeds }) : null,
                    deferReply: () => Promise.resolve(),
                    editReply: ({ content, embeds }) => content ? message.channel.send({ content, embeds }) : null
                };
                try {
                    await shuffleCommand.run({ client, interaction: fakeInteraction });
                } catch (error) {
                    //await message.channel.send("Se mezclo la lista exitosamente");
                    console.log('Hubo un problema con el evento shuffle mention', error);
                    return;
                }
                return;
            };
        };

        //Funcion de Skipear
        const skipCommandPattern = new RegExp(`<@!?${client.user.id}>\\s*(skip)`, 'i');

        if (skipCommandPattern.test(message.content)) {
            const skipCommand = client.musicacommands.get('skip');
            if (skipCommand) {
                const fakeInteraction = {
                    id: message.id,
                    guildId: message.guild.id,
                    member: message.member,
                    guild: message.guild,
                    channel: message.channel,
                    user: message.author,
                    options: {
                        getSubcommand: () => 'cancion'
                    },
                    reply: ({ content, embeds }) => message.channel.send({ content, embeds }),
                    editReply: ({ embeds }) => message.channel.send({ embeds }),
                    deferReply: () => Promise.resolve()
                };
                try {
                    await skipCommand.run({ client, interaction: fakeInteraction });
                } catch (error) {
                    console.error('Error al ejecutar el evento skip:', error);
                    return;
                }
                return;
            };
        };

        //Funcion Repeticion
        const loopCommandPattern = new RegExp(`<@!?${client.user.id}>\\s*(loop|bucle)`, 'i');

        if (loopCommandPattern.test(message.content)) {
            const loopCommand = client.musicacommands.get('loop');
            if (loopCommand) {
                const fakeInteraction = {
                    options: {
                        getSubcommand: () => 'queue',
                        getString: () => { }
                    },
                    id: message.id,
                    guildId: message.guild.id,
                    member: message.member,
                    guild: message.guild,
                    channel: message.channel,
                    user: message.author,
                    reply: ({ content }) => content ? message.channel.send(content) : null,
                    followUp: ({ content }) => content ? message.channel.send(content) : null,
                    deferReply: () => Promise.resolve(),
                    editReply: ({ embeds }) => embeds ? message.channel.send({ embeds }) : null
                };
                try {
                    await loopCommand.run({ client, interaction: fakeInteraction });
                    if (isLoopEnabled) {
                        console.log(`${message.author.toString()}Modo Bucle Desactivado.<3`);
                    } else {
                        console.log(`${message.author.toString()}, Modo Bucle Activado.<3`);
                    }
                    isLoopEnabled = !isLoopEnabled
                } catch (error) {
                    console.error('Error al ejecutar el comando bucle:', error);
                }
            };
        };

        //Funcion Autoplay
        const autoplayCommandPattern = new RegExp(`<@!?${client.user.id}>\\s*(autoplay)`, 'i');

        if (autoplayCommandPattern.test(message.content)) {
            const autoplayCommand = client.musicacommands.get('loop');
            if (autoplayCommand) {
                const fakeInteraction = {
                    options: {
                        getSubcommand: () => 'autoplay',
                        getString: () => { }
                    },
                    id: message.id,
                    guildId: message.guild.id,
                    member: message.member,
                    guild: message.guild,
                    channel: message.channel,
                    user: message.author,
                    reply: ({ content }) => content ? message.channel.send(content) : null,
                    followUp: ({ content }) => content ? message.channel.send(content) : null,
                    deferReply: () => Promise.resolve(),
                    editReply: ({ embeds }) => embeds ? message.channel.send({ embeds }) : null
                };
                try {
                    await autoplayCommand.run({ client, interaction: fakeInteraction });
                } catch (error) {
                    console.error('Error al ejecutar el comando bucle:', error);
                }
            };
        };

        //Funcion Loop Off
        const offCommandPattern = new RegExp(`<@!?${client.user.id}>\\s*(autoplay)`, 'i');

        if (offCommandPattern.test(message.content)) {
            const offCommand = client.musicacommands.get('loop');
            if (offCommand) {
                const fakeInteraction = {
                    options: {
                        getSubcommand: () => 'off',
                        getString: () => { }
                    },
                    id: message.id,
                    guildId: message.guild.id,
                    member: message.member,
                    guild: message.guild,
                    channel: message.channel,
                    user: message.author,
                    reply: ({ content }) => content ? message.channel.send(content) : null,
                    followUp: ({ content }) => content ? message.channel.send(content) : null,
                    deferReply: () => Promise.resolve(),
                    editReply: ({ embeds }) => embeds ? message.channel.send({ embeds }) : null
                };
                try {
                    await autoplayCommand.run({ client, interaction: fakeInteraction });
                } catch (error) {
                    console.error('Error al ejecutar el comando bucle:', error);
                }
            };
        };

        // Función de SetVolume 
        const volumeCommandPattern = new RegExp(`<@!?${client.user.id}>\\s*volumen\\s*(\\d+)`, 'i');

        if (volumeCommandPattern.test(message.content)) {
            const volumeMatch = volumeCommandPattern.exec(message.content);
            const volume = parseInt(volumeMatch[1], 10);

            // Verificar si el valor de volumen es válido
            if (isNaN(volume) || volume < 0 || volume > 100) {
                message.channel.send("Por favor, proporciona un valor de volumen válido entre 0 y 100.");
                return;
            };

            const volumeCommand = client.musicacommands.get('volumen');
            if (volumeCommand) {
                const fakeInteraction = {
                    options: {
                        getInteger: () => volume
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
                    editReply: ({ content, embeds }) => message.channel.send({ content, embeds })
                };
                try {
                    await volumeCommand.run({ client, interaction: fakeInteraction });
                } catch (error) {
                    console.error('Error al ejecutar el evento volumen:', error);
                }
            }
        };

        // Mostrar Queue usando el evento de mensajes
        const queueCommandPattern = new RegExp(`<@!?${client.user.id}>\\s*(queue|cola|lista)`, 'i');

        if (queueCommandPattern.test(message.content)) {
            const queueCommand = client.musicacommands.get('queue');

            if (queueCommand) {
                const queue = useQueue(message.guildId);
                if (!queue || !queue.tracks.size) {
                    message.channel.send(`${message.author.toString()} No hay canciones en la lista <3`);
                    return;
                }
                const fakeInteraction = {
                    options: {
                        getSubcommand: () => 'actual',
                        getString: () => { }
                    },
                    guildId: message.guild.id,
                    member: message.member,
                    guild: message.guild,
                    channel: message.channel,
                    user: message.author,
                    reply: ({ content, embeds }) => message.channel.send({ content, embeds }),
                    followUp: ({ content }) => message.channel.send(content),
                    deferReply: () => Promise.resolve(),
                    editReply: ({ embeds }) => message.channel.send({ embeds })
                };
                try {
                    await queueCommand.run({ client, interaction: fakeInteraction });
                } catch (error) {
                    console.error('Error al ejecutar el evento queue:', error);
                }
            };
        };
    });
};