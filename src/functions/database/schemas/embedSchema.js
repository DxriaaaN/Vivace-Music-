const mongoose = require('mongoose');

const embedSchema = new mongoose.Schema({
    guildId: {
        type: String,
    },
    channelId: {
        type: String,
    },
    messageId: {
        type: String,
    },
});

const EmbedModel = mongoose.model('Embed', embedSchema);

module.exports = EmbedModel;
