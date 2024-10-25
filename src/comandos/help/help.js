const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Muestra las diferentes secciones de ayuda para los comandos disponibles.'),

    run: async ({ client, interaction }) => {
        try {
            const embed = new EmbedBuilder()
                .setTitle("Bienvenido a mi panel de ayuda, aqui podras encontrar todos mis modulos disponibles.")
                .setDescription("Selecciona una sección debajo para ver")
                .setColor("313850");

            const menu = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('helpMenu')
                        .setPlaceholder('Selecciona una sección')
                        .addOptions([
                            {
                                label: 'Help Music',
                                description: 'Muestra los comandos de barra para la musica',
                                value: 'helpMusic',
                            },
                            {
                                label: 'Help Mention',
                                description: 'Muestra los comandos mediante mencion del bot.',
                                value: 'helpMention',
                            },
                            {
                                label: 'Help Search-Music',
                                description: 'Muestra como configurar tu canal de musica.',
                                value: 'helpSearchMusic',
                            },
                            {
                                label: 'Help Triggers Music',
                                description: 'Configura Palabras Personalizadas a Playlist/Canciones',
                                value: 'helpTriggerMusic'

                            }
                        ])
                );

            await interaction.editReply({
                embeds: [embed],
                components: [menu],
                ephemeral: true // Solo visible para el usuario
            });

            const filter = (i) => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async (i) => {
                if (i.customId === 'helpMenu') {
                    let selectedEmbed;
                    switch (i.values[0]) {
                        case 'helpMusic':
                            selectedEmbed = await getHelpMusicEmbed();
                            break;
                        case 'helpMention':
                            selectedEmbed = await getHelpMentionEmbed();
                            break;
                        case 'helpSearchMusic':
                            selectedEmbed = await getHelpSearchMusicEmbed();
                            break;
                        case 'helpTriggerMusic':
                            selectedEmbed = await getHelpTriggerMusicEmbed();
                            break;
                    }

                    // Actualizar el mensaje con el embed correspondiente y volver a mostrar el menú
                    await i.update({
                        embeds: [selectedEmbed],
                        components: [menu],
                    });
                }
            });

            collector.on('end', (collected) => {
                console.log(`Collected ${collected.size} interactions.`);
            });
        } catch (error) {
            await interaction.editReply({ content: `Hubo un error al mostrar las secciones de Ayuda`, ephemeral: true });
            console.log(`Hubo un problema en help.js`, error);
            return;
        }


        // Funciones similares para otros módulos de ayuda:
        async function getHelpMusicEmbed() {
            try {
                return new EmbedBuilder()
                    .setTitle("Comandos de Música")
                    .setDescription("Aquí tienes algunos comandos que puedes utilizar para gestionar la música:")
                    .addFields(
                        { name: "/play [url]", value: "Reproduce música desde una URL/Nombre valida." },
                        { name: "\u200B", value: "\u200B" }, 
                        { name: "/queue actual", value: "Usalo para ver la lista de reproduccion actual." },
                        { name: "/queue history", value: "Muestra las canciones que se reproducieron con anterioridad." },
                        { name: "\u200B", value: "\u200B" }, 
                        { name: "/skip cancion", value: "Salta la cancion actual hacia la siguiente" },                 
                        { name: "/pausar", value: "Pausa la música que está sonando." },  
                        { name: "/reanudar", value: "Reanuda la música pausada" },
                        { name: "\u200B", value: "\u200B" }, 
                        { name: "/shuffle", value: "Mezcla toda la lista de reproduccion" },
                        { name: "/loop cancion", value: "Usalo para repetir la cancion actual" },
                        { name: "/loop queue", value: "Usalo para repetir toda la lista de reproduccion" },
                        { name: "/loop autoplay", value: "Activa el modo autoplay despues de la cancion actual." },
                        { name: "/loop off", value: "Detiene todo tipo de repeticion." },
                        { name: "\u200B", value: "\u200B" }, 
                        { name: "/volumen", value: "Cambia el volumen de la musica para todos" },
                        { name: "/clear", value: "Limpia la lista de reproduccion actual" },
                        { name: "/disconnect", value: "Desconecta al bot del canal de voz" },
                    )
                    .setColor('313850')
                    .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                    .setTimestamp();
            } catch (error) {
                console.log(`No se pudo generar el modulo Help Music. Help.js`, error);
                return;
            }
        }

        async function getHelpMentionEmbed() {
            try {
                return new EmbedBuilder()
                    .setTitle("Comandos de Mencion")
                    .setDescription("Estos son los comandos que puedes usar al mencionar el bot.")
                    .addFields(
                        { name: "@MentionBot [link]", value: "Reproduce el link solicitado." },
                        { name: "@MentionBot busca [artista/cancion]", value: "Busca la cancion por nombre & artista." },
                        { name: "@MentionBot queue ", value: "Mustra la lista actual de reproduccion" },
                        { name: "@MentionBot info ", value: "Usalo para ver que se reproduce ahora mismo" },
                        { name: "\u200B", value: "\u200B" }, 
                        { name: "@MentionBot skip", value: "Salta a la siguiente cancion." },
                        { name: "@MentionBot loop", value: "Activa la repeticion de toda la lista actual." },
                        { name: "@MentionBot shuffle", value: "Mezcla toda la lista de reproduccion actual." },
                        { name: "\u200B", value: "\u200B" }, 
                        { name: "@MentionBot volumen [0-100]", value: "Cambia el volumen para todos." },
                        { name: "@MentionBot clear", value: "Limpia la lista actual de canciones." },
                        { name: "@MentionBot quit", value: "Desconecta al bot del canal de voz." },
                    )
                    .setColor('313850')
                    .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                    .setTimestamp();
            } catch (error) {
                console.log(`No se pudo generar el modulo Help Moderation. Help.js`, error);
                return;
            }
        }

        async function getHelpSearchMusicEmbed() {
            try {
                return new EmbedBuilder()
                    .setTitle("Configuracion y Uso Search Music")
                    .setDescription("Aca tienes paso a paso como configurar tu search-music")
                    .addFields(
                        { name: "/setup_music [thumbnail URL]", value: "Crea el canal music-search con una imagen personalizada." },
                        { name: "/setup_music", value: "Crea el canal music-search con una imagen default." },
                        { name: "\u200B", value: "\u200B" }, 
                        { name: "Metodo de Uso para Comandos", value: "Si necesitas comandos, puedes usar tanto mencion como slash, pero preferiblemente usa los Botones." },
                    )
                    .setColor('313850')
                    .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                    .setTimestamp();
            } catch (error) {
                console.log(`No se pudo generar el modulo Help Utilidades. Help.js`, error);
                return;
            }
        }



        async function getHelpTriggerMusicEmbed() {
            try {
                return new EmbedBuilder()
                    .setTitle("Comandos de Triggers para Playlist/Videos/Canciones")
                    .setDescription("Estos comandos te permiten registrar una palabra y un video. Para que al usar la palabra, reproduzca lo que vinculaste.")
                    .addFields(
                        { name: "/add_trigger ", value: "Te permite registrar una palabra y asociarla a una URL" },
                        { name: "/remove_trigger", value: "Te permite eliminar una palabra existente." },
                        { name: "/list_triggers ", value: "Usalo para ver las palabras existentes y su respectiva URL." },
                    )
                    .setColor('313850')
                    .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                    .setTimestamp();
            } catch (error) {
                console.log(`No se pudo generar el modulo Help Utilidades. Help.js`, error);
                return;
            }
        }
    },
};
