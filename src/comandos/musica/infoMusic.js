const { SlashCommandBuilder, EmbedBuilder, userMention } = require("@discordjs/builders");
const { useQueue, useHistory } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("info_music")
        .setDescription("Usalo para ver informacion de una cancion")
        .addSubcommand(subcommand =>
            subcommand
                .setName('anterior')
                .setDescription('Usalo para ver la cancion anterior a la actual.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('actual')
                .setDescription('Usalo para ver la cancion reproduciendose.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('siguiente')
                .setDescription('Usalo para ver la proxima cancion a la actual.')),

    run: async ({ client, interaction }) => {

        try {

            //Usuario y Mencion
            const { user: author } = interaction;
            const userMention = `<@${author.id}>`;

            //Canal de User y Client    
            const userChannel = interaction.member.voice.channel;
            const channelId = userChannel.id;

            const clientChannel = interaction.guild.members.me.voice.channel.id;

            //Uso Current y History Queue
            const currentQueue = useQueue(interaction.guildId);
            const oldQueue = useHistory(interaction.guildId);

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
            if (subcommand === 'anterior') {
                if (oldQueue.previousTrack) {
                    const previousSong = oldQueue.previousTrack;

                    const oldEmbed = new EmbedBuilder()
                        .setColor(parseInt('313850', 16))
                        .setTitle(`La canción es: **${previousSong.title}**`)
                        .addFields(
                            { name: '🎤 Artista: ', value: `${previousSong.author}`, inline: true },
                            { name: '⌛ Duración: ', value: `${previousSong.duration}`, inline: true },
                            { name: 'Pedido por: ', value: `${previousSong.requestedBy}`, inline: true }
                        )
                        .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                        .setTimestamp()

                    await interaction.editReply({ embeds: [oldEmbed] });
                } else {
                    await interaction.editReply({ content: `${userMention} No existe una cancion anterior`, ephemeral: true });
                    return;
                };
            } else if (subcommand === 'actual') {

                const actualSong = currentQueue.currentTrack

                const actualEmbed = new EmbedBuilder()
                    .setColor(parseInt('313850', 16))
                    .setTitle(`La canción es: **${actualSong.title}**`)
                    .addFields(
                        { name: '🎤 Artista: ', value: `${actualSong.author}`, inline: true },
                        { name: '⌛ Duración: ', value: `${actualSong.duration}`, inline: true },
                        { name: 'Pedido por: ', value: `${actualSong.requestedBy}`, inline: true }
                    )
                    .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                    .setTimestamp()

                await interaction.editReply({ embeds: [actualEmbed] });

            } else if (subcommand === 'siguiente') {

                if (oldQueue.nextTrack) {
                    const nextSong = oldQueue.nextTrack;

                    const nextEmbed = new EmbedBuilder()
                        .setColor(parseInt('0xd11775', 16))
                        .setTitle(`La canción es: **${nextSong.title}**`)
                        .addFields(
                            { name: '🎤 Artista: ', value: `${nextSong.author}`, inline: true },
                            { name: '⌛ Duración: ', value: `${nextSong.duration}`, inline: true },
                            { name: 'Pedido por: ', value: `${nextSong.requestedBy}`, inline: true }
                        )
                        .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                        .setTimestamp()

                    await interaction.editReply({ embeds: [nextEmbed] });
                } else {
                    await interaction.editReply({ content: `${userMention} No hay una proxima cancion`, ephemeral: true });
                    return;
                }
            };

        } catch (error) {
            console.log(`Hubo un error al ejecutar infoMusic.js`, error);
            await interaction.editReply({ content: `${userMention} No eh podido mostrar la informacion`, ephemeral: true });
            return;
        }
    },
};