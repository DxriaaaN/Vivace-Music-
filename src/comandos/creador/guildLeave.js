const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaveguild')
        .setDescription('Hace que el bot abandone un servidor especifico.')
        .addStringOption(option =>
            option.setName('guildid')
                .setDescription('El ID del servidor a abandonar')
                .setRequired(true)),
    async run({ client, interaction }) {
        try {

            //Datos Usuario
            const { user: author } = interaction;
            const userMention = `<@${author.id}>`;

            //Verificacion Rol Owner/Developer
            const rolDeveloper = '432215088686956565';

            if (interaction.user.id !== rolDeveloper) {
                await interaction.editReply({ content: 'No tienes permiso para usar este comando, llama a un Developer', ephemeral: true });
                return;
            }

            // Obtener el ID del servidor desde el comando
            const guildId = interaction.options.getString('guildid');
            const guild = client.guilds.cache.get(guildId);

            // Verificar si el bot está en el servidor especificado
            if (!guild) {
                await interaction.editReply({ content: 'No estoy en el servidor especificado.', ephemeral: true });
                return;
            }

            // Intentar abandonar el servidor
            await guild.leave();
            await interaction.editReply({ content: `${userMention} He abandonado el servidor: ${guild.name} con exito!` });

        } catch (error) {
            console.error(`No pude abandonar el servidor: ${guild.name}`, error);
            await interaction.editReply({ content: 'Ocurrió un error al intentar abandonar el servidor.', ephemeral: true });
            return;
        }
    },
};
