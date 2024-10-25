const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const validUrl = require('valid-url');
const Trigger = require('../../functions/database/schemas/triggerSchema');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('add_trigger')
        .setDescription('Agrega una nueva palabra clave y un enlace asociado')
        .addStringOption(option =>
            option.setName('trigger')
                .setDescription('La palabra clave que activará la reproducción')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('url')
                .setDescription('El enlace de la canción o playlist')
                .setRequired(true)),
    async run({ client, interaction }) {
        const trigger = interaction.options.getString('trigger').toLowerCase();
        const url = interaction.options.getString('url');
        const guildId = interaction.guild.id;
        
        //Verificar URL Valida
        if (!validUrl.isUri(url)) {
            return interaction.editReply({
                content: 'El enlace proporcionado no es válido.',
                ephemeral: true,
            });
        }


        // Buscar si ya existe un documento para la guild
        let triggerDoc = await Trigger.findOne({ guildId });

        if (!triggerDoc) {
            // Si no existe, crear uno nuevo
            triggerDoc = new Trigger({
                guildId,
                triggers: [],
            });
        }   

        // Verificar si el trigger ya existe
        const existingTrigger = triggerDoc.triggers.find(t => t.trigger === trigger);

        if (existingTrigger) {
            return interaction.editReply({
                content: `La palabra clave \`${trigger}\` ya existe.`,
                ephemeral: true,
            });
        }

        // Agregar el nuevo trigger
        triggerDoc.triggers.push({ trigger, url });
        await triggerDoc.save();

        // Enviar confirmación al usuario
        const embed = new EmbedBuilder()
            .setColor(parseInt('313850', 16))
            .setTitle('Nuevo trigger agregado')
            .setDescription(`La palabra clave \`${trigger}\` activará el enlace:\n${url}`)
            .setFooter({ text: client.user.username, iconURL: client.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};
