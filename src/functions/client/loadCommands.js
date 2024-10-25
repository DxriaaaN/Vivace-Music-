const fs = require('node:fs');
const path = require('node:path'); 

const loadCommands = (client, commands) => {
    try {
    const commandFolders = ['musica', 'creador', 'settings', 'help', 'triggers']; 
    
    commandFolders.forEach(folder => {
        const commandFolderPath = path.join(__dirname, '../../comandos', folder);
        const commandFiles = fs.readdirSync(commandFolderPath).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const commandPath = path.join(commandFolderPath, file);
            const command = require(commandPath);

            client[`${folder}commands`].set(command.data.name, command);
            commands.push(command.data.toJSON());
        }
    });
    } catch(error) {
        console.error('No se pudieron cargar los comandos', error);
    }
};

module.exports = { loadCommands };
