const {SlashCommandBuilder} = require('discord.js');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatarbot')
        .setDescription('Actualiza el avatar del bot')
        .addAttachmentOption(option =>
            option.setName('avatar')
                .setDescription('El nuevo avatar para el bot.')
                .setRequired(true)
        ),

    async run({ client, interaction }) {
        try {

            //Datos Usuario
            const { user: author } = interaction;
            const userMention = `<@${author.id}>`;

            //Verificar Rol Desarrollador
            const rolDeveloper = '432215088686956565';
            if (interaction.user.id !== rolDeveloper) {
                return interaction.editReply({ content: 'No tienes permisos para usar este comando, llama a un Developer', ephemeral: true });
            };

            //Cargar archivo del Avatar
            const avatarAttachment = interaction.options.getAttachment('avatar')
            if (!avatarAttachment.contentType.startsWith('image/')) {
                return interaction.editReply('Por favor, proporciona un archivo de imagen válido.');
            };

            //Convertir imagen a base64
            const response = await fetch(avatarAttachment.url);
            const buffer = await response.buffer();
            const base64Avatar = `data:${avatarAttachment.contentType};base64,${buffer.toString('base64')}`;

            //Errores Servidor
            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            //Actualizar el avatar
            await client.user.setAvatar(base64Avatar);
            await interaction.editReply(`${userMention} El avatar del bot ha sido actualizado con éxito.`);
        } catch (error) {
            await interaction.editReply({ content: 'Hubo un problema al actualizar el avatar del bot', ephemeral: true });
            console.log('Hubo un problema al cambiar el avatar', error);
            return;
        };
    },
};