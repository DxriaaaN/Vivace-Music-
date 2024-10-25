const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
    },
    musicSearchChannelId: {
        type: String,
        required: true,
    },
    musicSearchMessageId: {
        type: String,
        default: null, // Inicialmente puede estar vacío hasta que se cree el mensaje
    },
    nowPlayingMessageId: {
        type: String,
        default: null, // Inicialmente puede estar vacío hasta que se cree el mensaje
    },
    thumbnailUrl: {
        type: String,
        default: '../../../../config/images/defaultMusicSearch.png', // Coloca un URL válido por defecto
    },
}, { timestamps: true });

module.exports = mongoose.model('MusicSettings', musicSchema);
