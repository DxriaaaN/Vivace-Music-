// commands/list_triggers.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const Trigger = require('../../functions/database/schemas/triggerSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list_triggers')
        .setDescription('Muestra todas las palabras clave disponibles'),
    async run({ client, interaction }) {
        const guildId = interaction.guild.id;

        // Buscar el documento para la guild
        let triggerDoc = await Trigger.findOne({ guildId });

        if (!triggerDoc || triggerDoc.triggers.length === 0) {
            return interaction.editReply({
                content: 'No hay palabras clave configuradas en este servidor.',
                ephemeral: true,
            });
        }

        // Crear una lista de triggers para mostrar
        const triggerDescriptions = triggerDoc.triggers.map(t => `\`${t.trigger}\`: ${t.url}`);

        const embed = new EmbedBuilder()
            .setColor(parseInt('313850', 16))
            .setTitle('Palabras clave disponibles')
            .setDescription(triggerDescriptions.join('\n'))
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};
