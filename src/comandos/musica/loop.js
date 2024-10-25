const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');
const { useQueue, QueueRepeatMode } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Usalo para activar la repeticion de canciones')
        .addSubcommand(subcommand =>
            subcommand
                .setName('cancion')
                .setDescription(`Usalo para repetir la cancion actual`)
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('queue')
                .setDescription(`Usalo para repetir todas las canciones`)
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('autoplay')
                .setDescription(`Usalo para activar el autoplay`)
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName(`off`)
                .setDescription(`Detiene la repeticion de la cancion/es`)
        ),

    run: async ({ client, interaction }) => {

        try {
            //Queue
            const queue = useQueue(interaction.guildId);

            //Canal de User y Client    
            const userChannel = interaction.member.voice.channel;
            const channelId = userChannel.id;

            const clientChannel = interaction.guild.members.me.voice.channel.id;

            //Usuario y Mencion
            const { user: author } = interaction;
            const userMention = `<@${author.id}>`;

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


            //Creacion Embeds

            //track
            const trackEmbed = new EmbedBuilder()
                .setTitle(`Repitiendo la cancion actual`)
                .setDescription(`🔁 | Se ha activado la repetición de la **canción actual**.`)
                .addFields({ name: `Pedido por: `, value: `${userMention}`, inline: true })
                .setColor(parseInt('313850', 16))
                .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                .setTimestamp();
            //queue
            const queueEmbed = new EmbedBuilder()
                .setTitle(`Repitiendo la lista completa`)
                .setDescription(`🔁 | Se ha activado la repetición de **toda la lista de reproducción**.`)
                .addFields({ name: `Pedido por: `, value: `${userMention}`, inline: true })
                .setColor(parseInt('313850', 16))
                .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                .setTimestamp();
            //Autoplay
            const autoplayEmbed = new EmbedBuilder()
            .setTitle(`Se activo el autoplay`)
            .setDescription(`🔁 | Se ha activado el autoplay, comenzara una vez terminada la ultima cancion.`)
            .addFields({ name: `Pedido por: `, value: `${userMention}`, inline: true })
            .setColor(parseInt('313850', 16))
            .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
            .setTimestamp();
            //off
            const offEmbed = new EmbedBuilder()
                .setTitle(`Se ha detenido la reproduccion en bucle`)
                .setDescription(`🚫 | Se ha **desactivado** la repetición.`)
                .addFields({ name: `Pedido por: `, value: `${userMention}`, inline: true })
                .setColor(parseInt('313850', 16))
                .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                .setTimestamp();


            // Verificar el subcomando que elige el usuario
            const subcommand = interaction.options.getSubcommand();

            switch (subcommand) {
                case 'cancion':
                    queue.setRepeatMode(QueueRepeatMode.TRACK); // Repetir la canción actual
                    await interaction.editReply({ embeds: [trackEmbed] });
                    break;

                case 'queue':
                    queue.setRepeatMode(QueueRepeatMode.QUEUE); // Repetir toda la cola
                    await interaction.editReply({ embeds: [queueEmbed] });
                    break;

                case 'autoplay':
                    queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);// Activar Autoplay
                    await interaction.editReply({ embeds: [autoplayEmbed]});
                    break;

                case 'off':
                    queue.setRepeatMode(QueueRepeatMode.OFF); // Desactivar repetición
                    await interaction.editReply({ embeds: [offEmbed] });
                    break;

                default:
                    await interaction.editReply({ content: `Elige una opcion valida.`, ephemeral: true });
            };
        } catch (error) {
            console.log(`Hubo un error al ejecutar loop.js`, error);
            await interaction.editReply({ content: `No pude activar el loop`, ephemeral: true });
            return;
        }
    },
};