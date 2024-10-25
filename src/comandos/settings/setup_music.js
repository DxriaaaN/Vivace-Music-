const { SlashCommandBuilder } = require('@discordjs/builders');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ChannelType } = require('discord.js');
const musicSchema = require('../../functions/database/schemas/musicSchema'); // Importar el esquema de música de Mongoose
const { generateMusicControlButtons } = require('../../utils/commands/buttonUtils');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup_music')
        .setDescription('Configura el canal de búsqueda de música y sus controles.')
        .addStringOption(option =>
            option.setName('thumbnail')
                .setDescription('URL del thumbnail personalizado para este servidor')
                .setRequired(false)), // Permitir que el usuario personalice el thumbnail

    async run({ interaction, client }) {
        // Verificar permisos de usuario
        if (!interaction.member.permissions.has('MANAGE_CHANNELS')) {
            return interaction.editReply({ content: 'No tienes permisos para ejecutar este comando.', ephemeral: true });
        }

        const guild = interaction.guild;

        // Cargar o crear la configuración de la guild en la base de datos
        let settings = await musicSchema.findOne({ guildId: guild.id });

        const defaultThumbnail = 'https://media.discordapp.net/attachments/1280185788751151126/1292442176302747768/OIG1.png?ex=6703c013&is=67026e93&hm=b089efff0f0e0f6c2cefcfdad15b0c48e7cd22b0cfd29105b5e4b2aec40c0bc1&=&format=webp&quality=lossless&width=671&height=671';

        const thumbnailUrl = interaction.options.getString('thumbnail') ? interaction.options.getString('thumbnail') : defaultThumbnail; // Si hay thumbnail, se guarda

        // Si no existe la configuración, creamos un nuevo documento
        if (!settings) {
            settings = new musicSchema({
                guildId: guild.id,
                musicSearchChannelId: null, // Se rellenará luego
                musicSearchMessageId: null,  // Se rellenará luego
                nowPlayingMessageId: null,   // Se rellenará luego
                thumbnailUrl: thumbnailUrl
            });
        }

        // Buscar o crear el canal de música
        let musicSearchChannel = guild.channels.cache.get(settings.musicSearchChannelId);
        if (!musicSearchChannel) {
            try {
                musicSearchChannel = await guild.channels.create({
                    name: 'music-search',
                    type: ChannelType.GuildText,
                    topic: 'Suelta tu link de Spotify o YouTube aquí.'
                });

                // Actualizar el canal en la base de datos
                settings.musicSearchChannelId = musicSearchChannel.id;
                await settings.save();
            } catch (error) {
                console.error('Error al crear el canal de música:', error);
                return interaction.editReply({ content: 'Hubo un problema al crear el canal de música.', ephemeral: true });
            }
        }

        // Crear el embed principal
        const embed = new EmbedBuilder()
            .setColor(parseInt('313850', 16))
            .setTitle(`Bienvenido a Music-Search de ${guild.name}`)
            .setDescription('Usa los botones de abajo para controlar la música. Todos los enlaces que escribas aquí serán tomados automáticamente.\n\n\n 🟢 Spotify |  🔴 Youtube |  🟡 Apple Music |  🟠 SoundCloud')
            .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
            .setImage(thumbnailUrl);

        const nowPlayingEmbed = new EmbedBuilder()
            .setColor(parseInt('313850', 16))
            .setTitle('Nada se está reproduciendo en este momento.')
            .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
            .setDescription('Cuando una canción comience, la información aparecerá aquí.');

        // Crear los botones de control
        const [row1, row2, row3] = generateMusicControlButtons();

        // Enviar el mensaje de búsqueda y control de música
        const nowPlayingMessage = await musicSearchChannel.send({ embeds: [nowPlayingEmbed] });

        const sentMessage = await musicSearchChannel.send({ embeds: [embed], components: [row1, row2, row3] }); //Invertido, osea abajo embed, arriba nowPlayingEmbed TEST 27/09

        // Guardar los IDs de los mensajes en la base de datos
        settings.musicSearchMessageId = sentMessage.id;
        settings.nowPlayingMessageId = nowPlayingMessage.id;
        await settings.save();
        
        await interaction.editReply({ content: 'El canal de búsqueda de música ha sido configurado.', ephemeral: true });
    }
};
