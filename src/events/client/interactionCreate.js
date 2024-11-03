module.exports = (client) => {
    client.on('interactionCreate', async (interaction) => {
        if (!interaction.isCommand()) return;

        // Crear la coleccion de comandos
        const command = client.musicacommands.get(interaction.commandName) ||
                        client.settingscommands.get(interaction.commandName) ||
                        client.helpcommands.get(interaction.commandName) ||
                        client.triggerscommands.get(interaction.commandName) ||
                        client.creadorcommands.get(interaction.commandName) ||
                        client.radiocommands.get(interaction.commandName);

        if (!command) {
            await interaction.reply({ content: "Lo siento, no es un comando válido", ephemeral: true });
            return;
        }

        try {
            await interaction.deferReply();
            await command.run({ interaction, client });
        } catch (error) {
            console.error('Error al ejecutar comando:', error);
            await interaction.followUp({ content: "Hubo un error al ejecutar este comando.", ephemeral: true });
        }
    });
};
