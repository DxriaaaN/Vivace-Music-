const { SlashCommandBuilder } = require("@discordjs/builders")
const { EmbedBuilder } = require("discord.js")
const { useQueue } = require("discord-player");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("pausar")
        .setDescription("Usalo para pausar la música"),

    run: async ({ client, interaction }) => {
        try {
            //Constantes Queue y Usuario
            const queue = useQueue(interaction.guild);
            const userVoiceChannel = interaction.member.voice.channel;
            const clientVoiceChannel = interaction.guild.members.me.voice.channel.id;
            const userVoiceChannelID = interaction.member.voice.channel;

            //Usuario y Mencion
            const { user: author } = interaction;
            const userMention = `<@${author.id}>`;

            //Comprobaciones de Seguridad.

            //Esta en un canal de voz
            if (!userVoiceChannel) {
                await interaction.editReply({ content: ` ${userMention}No puedes usar este comando, primero ingresa en un canal de voz y asegurate de que hay una queue activa.`, ephemeral: true });
                return;
            };

            //Verifica si existe una queue
            if (!queue || !queue.currentTrack) {
                await interaction.editReply({ content: `${userMention} No hay una cancion o lista actual reproduciendose.`, ephemeral: true });
                return;
            };

            //Verifica si estan en el mismo canal de voz.
            if (queue || queue.currentTrack) {
                if (clientVoiceChannel != userVoiceChannelID) {
                    await interaction.editReply({ content: `${userMention} No estas en el mismo canal que yo.` })
                    return;
                };
            };

            //Declaracion de Pausa
            const isPaused = queue.node.isPaused();

            //Comprobacion del estado de Pausa.
            if (!isPaused) {
                queue.node.setPaused(true) //Cambio a Pausado

                //Mensaje Pausa
                const embedPaused = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTitle(`La musica fue pausada`)
                    .setColor(parseInt('313850', 16))
                    .addFields(
                        { name: `Estado Actual:`, value: `Pausada`, inline: true },
                        { name: `Pedido por: `, value: `${userMention}`, inline: true }
                    )
                    .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                    .setTimestamp();

                //Envio de Respuesta
                await interaction.editReply({ embeds: [embedPaused] });
                return;
            } else {
                const embedAlreadyPaused = new EmbedBuilder()
                    .setAuthor({ name: `${interaction.guild.name}`, iconURL: interaction.guild.iconURL({ dynamic: true }) })
                    .setTitle(`La musica ya esta pausada`)
                    .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
                    .setTimestamp();
                await interaction.editReply({ embeds: [embedAlreadyPaused] });
                return;
            };
        } catch (error) {
            console.log(`Hubo un error en el comando pause.js`, error);
            await interaction.editReply({ content: `No eh podido pausar la musica`, ephemeral: true });
            return;
        }
    },
};
