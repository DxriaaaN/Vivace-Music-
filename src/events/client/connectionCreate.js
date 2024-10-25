//Ajuste Conexiones Inestables

module.exports = (client) => {
    try {
    client.player.on("connectionCreate", (queue) => {
        queue.connection.voiceConnection.on("stateChange", (oldState, newState) => {
            const oldNetworking = Reflect.get(oldState, "networking");
            const newNetworking = Reflect.get(newState, "networking");
    
            const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
                const newUdp = Reflect.get(newNetworkState, "udp");
                clearInterval(newUdp?.keepAliveInterval);
            };
            oldNetworking?.off("stateChange", networkStateChangeHandler);
            newNetworking?.on("stateChange", networkStateChangeHandler);
        });
    });
    } catch(error) {
        console.error('No se pudo mantener la conexion estable', error);
    }
}