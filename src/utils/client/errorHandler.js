module.exports = (client) => {
    try{
    client.on('error', (error) => {
        console.error('Discord client error:', error);
    });

    client.on('warn', (warning) => {
        console.warn('Discord client warning:', warning);
    });

    } catch(error) {
    console.error('Hubo un problema en atrapar el error', error);
    }
};
