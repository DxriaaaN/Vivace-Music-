const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const stations = require('../../utils/commands/stations');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('radio')
        .setDescription('Selecciona una estación y una subestación de radio para reproducir.')
        .addSubcommand(subcommand => 
            subcommand
            .setName('sunshine')
            .setDescription('Selecciona la estación principal')
            .addStringOption(option => 
                option.setName('subestacion')
                    .setDescription('Selecciona una subestación')
                    .setRequired(true)
                    .addChoices(
                        {name:'Techno' , value: 'techno'},
                        {name:'Hardcore' , value: 'hardcore'},
                        {name:'DNB' , value: 'dnb'},
                        {name:'2010s' , value: '2010s'},
                        {name:'House' , value: 'house'}
                    ))),

    async run({ client, interaction }) {
        //Obtener las opciones.
        const estacion = interaction.options.getSubcommand();
        const subestacion = interaction.options.getString('subestacion')

        //Buscar la URL en el objeto literal.
        const url = stations[estacion]?.[subestacion];

        if (!url) {
            await interaction.editReply(`No se encontro una URL para la estacion ${estacion} - ${subestacion}.`);
            return;
        };

        //Crear interaccion falsa.
        const fakeInteraction = {
            options: {
                getString: () => url
            },
            id: interaction.id,
            guildId: interaction.guild.id,
            member: interaction.member,
            guild: interaction.guild,
            channel: interaction.channel,
            user: interaction.user,
            reply: ({ content }) => interaction.channel.send(content),
            followUp: ({ content }) => interaction.channel.send(content),
            deferReply: () => Promise.resolve(),
            editReply: ({ embeds }) => interaction.channel.send({ embeds }),
        };

        //Inicializar el comando Play.
        const playCommand = client.musicacommands.get('play');
        if (playCommand) {
            try {
                await playCommand.run({ client, interaction: fakeInteraction });
            } catch(error){
                console.error(error);
                await interaction.editReply('Hubo un error al intentar reproducir la estacion.');
                return; 
            };
        };

        //Enviar Confirmacion 
        const embed = new EmbedBuilder()
            .setColor(parseInt('313850', 16))
            .setTitle('Reproduciendo estacion')
            .setDescription(`Reproduciendo la estacion **${estacion} - ${subestacion}**`)
            .setFooter({ text: client.user.username, iconURL: `${client.user.displayAvatarURL()}` })
            .setThumbnail();
        await interaction.editReply({ embeds: [embed] });
    },
};

