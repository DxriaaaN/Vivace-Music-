// Importacion Modulos y Librerias

const dotenv = require('dotenv');
const {Client, GatewayIntentBits } = require('discord.js');
const { Player, useMainPlayer} = require('discord-player');
const { YoutubeiExtractor } = require('discord-player-youtubei');
const { Log } = require ('youtubei.js');

//Base de Datos
const { initializeMongoose } = require('./src/functions/database/mongoose'); // Importa Mongoose


//Carga y Registro de Comandos
const { registerCommands } = require('./src/functions/client/registerCommands.js');
const { loadCommands } = require('./src/functions/client/loadCommands.js');

//Eventos Error
const errorHandler = require ('./src/utils/client/errorHandler');
const globalErrorHandler = require('./src/utils/client/globalErrorHandler');
const musicErrorHandler = require('./src/utils/client/musicErrorHandler.js');
const guildAddHandler = require('./src/utils/commands/guildAdd.js');

//Eventos
const interactionCreateHandler = require('./src/events/client/interactionCreate');
const connectionCreateHandler = require('./src/events/client/connectionCreate');
const inviteHandler = require('./src/events/client/invite.js');
const mentionHandler = require('./src/events/client/mention.js');

//Eventos Musica

const musicEventHandler = require('./src/events/music/musicManager.js');

//Cargar las Variables
dotenv.config({path: './config/.env'});
const TOKEN = process.env.tokenBot;

//Creacion y Asignacion Cliente Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent,
    ],
});

//Reproductor Música y Extractor
client.player = new Player(client);
const player = useMainPlayer();

//Auth YT APP. Mirar Ejemplo en npm Youtubei
const youtubeAuth = process.env.youtubeAuth;

//Youtubei
player.extractors.register(YoutubeiExtractor, {
    authentication: youtubeAuth,
    streamOptions: {
        useClient: undefined,
        highWaterMark: 4 * 1024 * 1024,
    },
});

player.extractors.loadDefault((ext) => !['YouTubeExtractor'].includes(ext));

Log.setLevel(Log.Level.NONE);

//Cargar Mapas
client.musicacommands = new Map();
client.creadorcommands = new Map();
client.settingscommands = new Map();
client.helpcommands = new Map();
client.triggerscommands = new Map();

let commands = [];
loadCommands(client, commands);
registerCommands(client, commands);
guildAddHandler(client, commands);


//Manejador de Eventos
interactionCreateHandler(client);
connectionCreateHandler(client);
globalErrorHandler(client);
errorHandler(client);
musicErrorHandler(client);
musicEventHandler(client);
inviteHandler(client);
mentionHandler(client);


//Arrancar bot
initializeMongoose()
    .then(() => {
        console.log("Conexión a MongoDB exitosa");
        
        // Arrancar bot
        client.on("ready", () => {
            console.log(`Entrando como ${client.user.tag}`);
            registerCommands(client, commands);
        });

        client.login(TOKEN);
    })
    .catch((err) => {
        console.error("No se pudo establecer conexión a MongoDB", err);
    });
