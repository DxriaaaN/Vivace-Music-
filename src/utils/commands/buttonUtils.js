const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

//Funcion para generar botones en setup_music
function generateMusicControlButtons() {
    
    const row1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder().setCustomId('stop_music').setLabel('Pausar').setStyle(ButtonStyle.Danger).setEmoji('⏸️'),
            new ButtonBuilder().setCustomId('resume_music').setLabel('Reanudar').setStyle(ButtonStyle.Primary).setEmoji('▶️'),
            new ButtonBuilder().setCustomId('skip_music').setLabel('Skipear').setStyle(ButtonStyle.Primary).setEmoji('⏭️')
        );

    const row2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder().setCustomId('shuffle_music').setLabel('Shuffle').setStyle(ButtonStyle.Primary).setEmoji('🔀'),
            new ButtonBuilder().setCustomId('repeat_music').setLabel('Repetición').setStyle(ButtonStyle.Success).setEmoji('🔁'),
            new ButtonBuilder().setCustomId('autoplay_music').setLabel('Autoplay').setStyle(ButtonStyle.Success).setEmoji('🔁'),
            new ButtonBuilder().setCustomId('queue_music').setLabel('Lista Actual').setStyle(ButtonStyle.Primary).setEmoji('🔤')
        );

    const row3 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder().setCustomId('clear_music').setLabel('Limpiar Queue').setStyle(ButtonStyle.Danger).setEmoji('🗑️'),
            new ButtonBuilder().setCustomId('leave_music').setLabel('Abandonar').setStyle(ButtonStyle.Danger).setEmoji('⏯️'),
            new ButtonBuilder().setCustomId('loopoff_music').setLabel('Loop Off').setStyle(ButtonStyle.Danger).setEmoji('🔁'),
        );

    return [row1, row2, row3];
}

module.exports = { generateMusicControlButtons };
