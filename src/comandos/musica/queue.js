const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { useHistory, useQueue } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('Muestra canciones de la lista o el historial')
        .addSubcommand(subcommand =>
            subcommand
                .setName('actual')
                .setDescription('Muestra canciones de la lista actual'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('history')
                .setDescription('Muestra canciones que se reproducieron')),
    category: 'music',
    queueOnly: true,
    validateVC: true,

run: async ({ client, interaction }) => {
        try {
            const type = interaction.options.getSubcommand();
            const userVoiceChannel = interaction.member.voice.channel;

            if (!userVoiceChannel) {
                const noVoiceEmbed = new EmbedBuilder()
                    .setColor(parseInt('313850', 16))
                    .setDescription('Debes estar en un canal de voz ❤️');
                return interaction.editReply({ ephemeral: true, embeds: [noVoiceEmbed] });
            };

            let songsData = [];

            if (type === 'actual') {
                const queue = useQueue(interaction.guildId);
                if (!queue || !queue.tracks || !queue.tracks.size) {
                    return interaction.editReply({ content: 'No hay una lista de reproducción actualmente.', ephemeral: true });
                }
                songsData = queue.tracks.toArray();
            }

            // Si el subcomando es 'history'
            if (type === 'history') {
                const history = useHistory(interaction.guildId);
                if (!history || !history.tracks || !history.tracks.size) {
                    return interaction.editReply({ content: 'No encontré canciones que se hayan reproducido con anterioridad.', ephemeral: true });
                }
                songsData = history.tracks.toArray();
            }

            
            if (!songsData.length) {
                const noSongsEmbed = new EmbedBuilder()
                    .setColor(parseInt('313850', 16))
                    .setDescription(`No hay canciones en la lista para mostrar.`);
                return interaction.editReply({ ephemeral: true, embeds: [noSongsEmbed] });
            };
            

            const itemsPerPage = 10;
            const maxPage = Math.ceil(songsData.length / itemsPerPage);
            let currentPage = 0;

            const embeds = [];
            for (let page = 0; page < maxPage; page++) {
                const start = page * itemsPerPage;
                const end = Math.min(start + itemsPerPage, songsData.length);
                const tracks = songsData.slice(start, end);

                const embed = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTitle(`Lista de Canciónes`)
                    .setDescription(
                        tracks
                            .map((track, index) => `**${start + index + 1}**. [${track.title}](${track.url}) ~ [${track.requestedBy.toString()}]`)
                            .join('\n')
                    )
                    .setColor(parseInt('313850', 16))
                    .setFooter({ text: `Pagina ${page + 1} de ${maxPage} | Mostrando canciones ${start + 1} al ${end} de ${songsData.length}\n LSA Technology\`s` })
                    .setTimestamp();
                embeds.push(embed);
            }

            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('firstBtn')
                    .setEmoji('⏪')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('previousBtn')
                    .setEmoji('◀️')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true),
                new ButtonBuilder()
                    .setCustomId('nextBtn')
                    .setEmoji('▶️')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(maxPage <= 1),
                new ButtonBuilder()
                    .setCustomId('lastBtn')
                    .setEmoji('⏩')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(maxPage <= 1)
            );

            const message = await interaction.editReply({
                ephemeral: true,
                embeds: [embeds[currentPage]],
                components: [row]
            });

            const collector = message.createMessageComponentCollector({
                filter: (ctx) => ctx.user.id === interaction.user.id,
                time: 60_000
            });

            collector.on('collect', async (ctx) => {
                switch (ctx.customId) {
                    case 'firstBtn':
                        currentPage = 0;
                        break;
                    case 'previousBtn':
                        if (currentPage > 0) currentPage--;
                        break;
                    case 'nextBtn':
                        if (currentPage < embeds.length - 1) currentPage++;
                        break;
                    case 'lastBtn':
                        currentPage = embeds.length - 1;
                        break;
                    default:
                        break;
                }

                row.components[0].setDisabled(currentPage === 0);
                row.components[1].setDisabled(currentPage === 0);
                row.components[2].setDisabled(currentPage === embeds.length - 1);
                row.components[3].setDisabled(currentPage === embeds.length - 1);

                await ctx.update({
                    embeds: [embeds[currentPage]],
                    components: [row]
                });
            });

            collector.on('end', () => {
                row.components.forEach(component => component.setDisabled(true));
                message.edit({ components: [row] });
            });
        } catch (error) {
            console.error('Error al ejecutar el comando queue.js', error);
            await interaction.editReply( {content: 'Hubo un problema al mostrar la queue', ephemeral: true});
            return;
        };
    },
};
