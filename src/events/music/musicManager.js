const musicPlayHandler = require('./reproduciendo');
const musicDeleteHandler = require('./musicDelete');
const musicDeleteMessageHandler = require('./musicDeleteMessage');
const musicButtonsHandler = require('./buttons/musicButtons');
const guildDelete = require('./guildDelete');

const interactionMessageHandler = require('./interactions/musicMention');
const interactionMusicSearchHandler = require('./interactions/musicSearch');
const interactionMusicTrigger = require('./interactions/musicTrigger');

module.exports = (client) => {
    musicPlayHandler(client);
    musicDeleteHandler(client);
    musicDeleteMessageHandler(client);
    musicButtonsHandler(client);
    interactionMessageHandler(client);
    interactionMusicSearchHandler(client);
    interactionMusicTrigger(client);
    guildDelete(client);
};