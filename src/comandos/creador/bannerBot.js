const { SlashCommandBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bannerbot')
        .setDescription('Actualiza el banner del bot.')
        .addAttachmentOption(option =>
            option.setName('banner')
                .setDescription('La imagen o gif del banner para el bot.')
                .setRequired(true)),

    async run({ client, interaction }) {
        try {

            //Datos Usuario
            const { user: author } = interaction;
            const userMention = `<@${author.id}>`;

            //Verificacion ID Developer
            const rolDeveloper = '432215088686956565';
            if (interaction.user.id !== rolDeveloper) {
                await interaction.editReply({ content: 'No tienes permisos para usar este comando', ephemeral: true });
                return;
            };

            //Verificacion carga archivo
            const bannerAttachment = interaction.options.getAttachment('banner');
            if (!bannerAttachment || !bannerAttachment.contentType.startsWith("image/")) {
                await interaction.editReply({ content: 'Por favor, introduce un archivo valido (JPG, PNG, GIF)', ephemeral: true });
                return;
            };

            //Constantes
            const response = await fetch(bannerAttachment.url);
            const buffer = await response.buffer();
            const base64 = await buffer.toString('base64');
            const imageData = `data:${bannerAttachment.contentType};base64,${base64}`;

            //Errores Servidor
            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`HTTP Error! Status: ${response.status}`);
            };

            //Actualizar Banner Bot
            const patchResponse = await fetch(`https://discord.com/api/v9/users/@me`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bot ${client.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ banner: imageData })
            });

            //Errores Servidor
            if (!patchResponse.ok) {
                const errorData = await patchResponse.json();
                throw new Error(errorData.message);
            };

            await interaction.editReply({ content: `${userMention} El banner del bot ha sido actualizado con exito.` });
        } catch (error) {
            await interaction.editReply({ content: 'Hubo un problema al actualizar el banner del bot', ephemeral: true });
            console.log('Hubo un error al cambiar el banner', error);
            return;
        };
    },
};
