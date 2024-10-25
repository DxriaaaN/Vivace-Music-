const { SlashCommandBuilder, EmbedBuilder, userMention } = require('@discordjs/builders');
const { useQueue } = require('discord-player');

module.exports = {

    data: new SlashCommandBuilder()
        .setName('volumen')
        .setDescription('Usalo para establecer el volumen de la reproduccion de música para todos')
        .addIntegerOption(option =>
            option.setName('subir-bajar')
                .setDescription('El volumen a establecer de 0 a 100.')
                .setRequired(true)),


    run: async ({ client, interaction }) => {

        try {

            //Usuario y Mencion
            const { user: author } = interaction;
            const userMention = `<@${author.id}>`;

            //Voice Client y User
            const userChannel = interaction.member.voice.channel;
            const channelId = userChannel.id;
            const clientChannel = interaction.guild.members.me.voice.channel.id;

            //Queue 
            const queue = useQueue(interaction.guildId);

            //Verificar canal existente
            if (!userChannel) {
                await interaction.editReply({ content: `${userMention} Necesitas estar en un canal de voz`, ephemeral: true });
                return;
            };

            //Verificar si hay canciones
            if (!queue || !queue.currentTrack) {
                await interaction.editReply({ content: `${userMention} No hay canciones reproduciendose`, ephemeral: true });
                return;
            };

            //Verificar mismo canal de voz
            if (queue || queue.currentTrack) {
                if (clientChannel != channelId) {
                    await interaction.editReply({ content: `${userMention} Necesitas estar en mi canal de voz`, ephemeral: true });
                    return;
                };
            };

            //Volumen Asignacion 
            const volume = interaction.options.getInteger('subir-bajar');

            //Embeds
            const volEmbed = new EmbedBuilder()
                .setColor(parseInt('313850', 16))
                .setTitle('Se cambió el volumen exitosamente!')
                .setDescription(`${userMention} Se ha establecido el volumen al ${volume}%.`)
                .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                .setTimestamp();

            //Filtro Valor Incorrecto y Correcto
            if (volume < 0 || volume > 100) {
                await interaction.editReply({ content: `${userMention} Por favor elige un valor entre 0 y 100.`, ephemeral: true });
                return;
            } else {
                queue.node.setVolume(volume);
                await interaction.editReply({ embeds: [volEmbed] });
            };
            
        } catch (error) {
            console.log('Hubo un error al ejecutar volume.js', error);
            await interaction.editReply({content:`${userMention} No pude cambiar el volumen`, ephemeral: true});
            return;
        }
    },
};