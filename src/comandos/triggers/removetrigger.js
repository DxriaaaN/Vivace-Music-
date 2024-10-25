// commands/remove_trigger.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const Trigger = require('../../functions/database/schemas/triggerSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove_trigger')
        .setDescription('Elimina una palabra clave existente')
        .addStringOption(option =>
            option.setName('trigger')
                .setDescription('La palabra clave que deseas eliminar')
                .setRequired(true)),
    async run({ client, interaction }) {
        const trigger = interaction.options.getString('trigger').toLowerCase();
        const guildId = interaction.guild.id;

        // Buscar el documento para la guild
        let triggerDoc = await Trigger.findOne({ guildId });

        if (!triggerDoc) {
            return interaction.editReply({
                content: `No hay triggers configurados en este servidor.`,
                ephemeral: true,
            });
        }

        // Buscar y eliminar el trigger
        const index = triggerDoc.triggers.findIndex(t => t.trigger === trigger);

        if (index === -1) {
            return interaction.editReply({
                content: `La palabra clave \`${trigger}\` no existe.`,
                ephemeral: true,
            });
        }

        triggerDoc.triggers.splice(index, 1);
        await triggerDoc.save();

        // Enviar confirmación al usuario
        const embed = new EmbedBuilder()
            .setColor(parseInt('313850', 16))
            .setTitle('Trigger eliminado')
            .setDescription(`La palabra clave \`${trigger}\` ha sido eliminada.`)
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};
