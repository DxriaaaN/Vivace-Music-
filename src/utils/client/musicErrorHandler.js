module.exports = (client) => {
    // Evento playerError
    client.player.events.on('playerError', (queue, error) => {
        console.error(`Error en la reproducción en ${queue.guild.name}: ${error.message}`);
    });

    // Evento error
    client.player.events.on('error', (queue, error) => {
        console.error(`Error general en ${queue.guild.name}: ${error.message}`);
    });

};