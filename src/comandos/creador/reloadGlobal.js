const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reloadglobal')
        .setDescription('Recarga todos los comandos disponibles en todas las carpetas.'),
    run: async ({ interaction }) => {
        try {

            //Comprobacion Owner
            if (interaction.user.id !== '432215088686956565') {
                return interaction.editReply('No tienes permisos para usar este comando.');
            }

            //Datos Usuario
            const { user: author } = interaction;
            const userMention = `<@${author.id}>`;

            //Carga de Carpetas
            const commandFolders = [
                { name: 'musica', collection: interaction.client.musicacommands },
                { name: 'creador', collection: interaction.client.creadorcommands },
                { name: 'settings', collection: interaction.client.settingscommands },
                { name: 'help', collection: interaction.client.helpcommands },
                { name: 'triggers', collection: interaction.client.triggerscommands},
            ];
            //Para cada Carpeta X
            for (const folder of commandFolders) {
                const commandFiles = fs.readdirSync(path.resolve(__dirname, `../${folder.name}`)).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const commandPath = path.resolve(__dirname, `../${folder.name}/${file}`);
                    delete require.cache[require.resolve(commandPath)];
                    const newCommand = require(commandPath);
                    folder.collection.set(newCommand.data.name, newCommand);
                }
            }
            await interaction.editReply(`Todos los comandos han sido recargados ${userMention}` );
        } catch (error) {
            console.error('Error al recargar comandos:', error);
            await interaction.editReply({ content: 'Ocurrió un error al recargar los comandos.', ephemeral: true });
            return;
        };
    },
};
