
module.exports = (client) => {

    client.on('interactionCreate', async (interaction) => {

        try {

            //Comprobacion Seguridad
            if (!interaction.isButton()) {
                return;
            };
            //Canal Usuario
            const userChannel = interaction.member.voice.channel;

            //Canal Bot
            const clientChannel = interaction.guild.members.me.voice.channel;

            //Si no existe userChannel
            if (!userChannel) {
                return;
            };

            //Si no existe clientChannel
            if (!clientChannel) {
                return;
            };

            //Declaracion Interaccion.
            const { customId } = interaction;

            //Boton Leave
            if (customId === 'leave_music') {
                const leaveCommand = client.musicacommands.get('disconnect');

                if (leaveCommand) {
                    await interaction.deferReply();

                    const fakeInteraction = {
                        id: interaction.id,
                        guildId: interaction.guildId,
                        member: interaction.member,
                        guild: interaction.guild,
                        channel: interaction.channel,
                        user: interaction.user,
                        reply: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.followUp({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.followUp({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        },
                        followUp: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.followUp({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.followUp({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        },
                        deferReply: () => interaction.deferReply(),
                        editReply: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.editReply({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.editReply({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        }
                    };
                    // Ejecuta el comando 'resume' con la fake interaction
                    try {
                        await leaveCommand.run({ client, interaction: fakeInteraction });
                    } catch (error) {
                        console.log("Hubo un problema al usar el boton abandonar", error);
                        // await interaction.followUp({ content: "Hubo un error al intentar limpiar la cola.", ephemeral: true });
                    }
                };
            };


            //Boton Clear
            if (customId === 'clear_music') {
                const leaveCommand = client.musicacommands.get('clear');

                if (leaveCommand) {
                    await interaction.deferReply();

                    const fakeInteraction = {
                        id: interaction.id,
                        guildId: interaction.guildId,
                        member: interaction.member,
                        guild: interaction.guild,
                        channel: interaction.channel,
                        user: interaction.user,
                        reply: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.followUp({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.followUp({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        },
                        followUp: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.followUp({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.followUp({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        },
                        deferReply: () => interaction.deferReply(),
                        editReply: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.editReply({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.editReply({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        }
                    };

                    try {
                        await leaveCommand.run({ client, interaction: fakeInteraction });
                    } catch (error) {
                        console.log("Hubo un problema al usar el boton clear", error);
                        // await interaction.followUp({ content: "Hubo un error al intentar limpiar la cola.", ephemeral: true });
                    }
                };
            };


            //Boton Loop Cancion
            if (customId === 'repeat_music') {

                const loopCommand = client.musicacommands.get('loop');

                if (loopCommand) {
                    await interaction.deferReply();

                    const fakeInteraction = {
                        id: interaction.id,
                        guildId: interaction.guildId,
                        member: interaction.member,
                        guild: interaction.guild,
                        channel: interaction.channel,
                        user: interaction.user,
                        options: {
                            getSubcommand: () => 'queue'
                        },
                        reply: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.followUp({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.followUp({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        },
                        followUp: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.followUp({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.followUp({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        },
                        deferReply: () => interaction.deferReply(),
                        editReply: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.editReply({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.editReply({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        }
                    };
                    // Ejecuta el comando 'resume' con la fake interaction
                    try {
                        await loopCommand.run({ client, interaction: fakeInteraction });
                    } catch (error) {
                        console.log("Hubo un problema con loop cancion button", error);
                        //await interaction.followUp({ content: "Hubo un error al intentar repetir la cola." });
                    }
                };
            };


            //Boton Loop Autoplay
            if (customId === 'autoplay_music') {

                const loopCommand = client.musicacommands.get('loop');

                if (loopCommand) {
                    await interaction.deferReply();

                    const fakeInteraction = {
                        id: interaction.id,
                        guildId: interaction.guildId,
                        member: interaction.member,
                        guild: interaction.guild,
                        channel: interaction.channel,
                        user: interaction.user,
                        options: {
                            getSubcommand: () => 'autoplay'
                        },
                        reply: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.followUp({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.followUp({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        },
                        followUp: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.followUp({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.followUp({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        },
                        deferReply: () => interaction.deferReply(),
                        editReply: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.editReply({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.editReply({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        }
                    };
                    // Ejecuta el comando 'resume' con la fake interaction
                    try {
                        await loopCommand.run({ client, interaction: fakeInteraction });
                    } catch (error) {
                        console.log("Hubo un problema con autoplay Button", error);
                        //await interaction.followUp({ content: "Hubo un error al intentar repetir la cola." });
                    }
                };
            };


            //Proximo Pause
            if (customId === 'stop_music') {
                const leaveCommand = client.musicacommands.get('pausar');

                if (leaveCommand) {
                    await interaction.deferReply();

                    const fakeInteraction = {
                        id: interaction.id,
                        guildId: interaction.guildId,
                        member: interaction.member,
                        guild: interaction.guild,
                        channel: interaction.channel,
                        user: interaction.user,
                        reply: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.followUp({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.followUp({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        },
                        followUp: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.followUp({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.followUp({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        },
                        deferReply: () => interaction.deferReply(),
                        editReply: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.editReply({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.editReply({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        }
                    };

                    try {
                        await leaveCommand.run({ client, interaction: fakeInteraction });
                    } catch (error) {
                        console.log("Hubo un problema al usar el boton pausar", error);
                        // await interaction.followUp({ content: "Hubo un error al intentar limpiar la cola.", ephemeral: true });
                    }
                };
            };


            //Boton Reanudar
            if (customId === 'resume_music') {
                const leaveCommand = client.musicacommands.get('reanudar');

                if (leaveCommand) {
                    await interaction.deferReply();

                    const fakeInteraction = {
                        id: interaction.id,
                        guildId: interaction.guildId,
                        member: interaction.member,
                        guild: interaction.guild,
                        channel: interaction.channel,
                        user: interaction.user,
                        reply: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.followUp({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.followUp({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        },
                        followUp: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.followUp({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.followUp({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        },
                        deferReply: () => interaction.deferReply(),
                        editReply: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.editReply({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.editReply({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        }
                    };

                    try {
                        await leaveCommand.run({ client, interaction: fakeInteraction });
                    } catch (error) {
                        console.log("Hubo un problema al usar el boton reanudar", error);
                        // await interaction.followUp({ content: "Hubo un error al intentar limpiar la cola.", ephemeral: true });
                    }
                };
            };


            //Boton Shuffle
            if (customId === 'shuffle_music') {
                const leaveCommand = client.musicacommands.get('shuffle');

                if (leaveCommand) {
                    await interaction.deferReply();

                    const fakeInteraction = {
                        id: interaction.id,
                        guildId: interaction.guildId,
                        member: interaction.member,
                        guild: interaction.guild,
                        channel: interaction.channel,
                        user: interaction.user,
                        reply: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.followUp({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.followUp({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        },
                        followUp: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.followUp({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.followUp({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        },
                        deferReply: () => interaction.deferReply(),
                        editReply: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.editReply({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.editReply({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        }
                    };

                    try {
                        await leaveCommand.run({ client, interaction: fakeInteraction });
                    } catch (error) {
                        console.log("Hubo un problema al usar el boton shuffle", error);
                        // await interaction.followUp({ content: "Hubo un error al intentar limpiar la cola.", ephemeral: true });
                    }
                };
            };


            //Boton Skip
            if (customId === 'skip_music') {
                const leaveCommand = client.musicacommands.get('skip');

                if (leaveCommand) {
                    await interaction.deferReply();

                    const fakeInteraction = {
                        id: interaction.id,
                        guildId: interaction.guildId,
                        member: interaction.member,
                        guild: interaction.guild,
                        channel: interaction.channel,
                        user: interaction.user,
                        options: {
                            getSubcommand: () => 'cancion'
                        },
                        reply: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.followUp({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.followUp({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        },
                        followUp: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.followUp({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.followUp({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        },
                        deferReply: () => interaction.deferReply(),
                        editReply: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.editReply({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.editReply({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        }
                    };

                    try {
                        await leaveCommand.run({ client, interaction: fakeInteraction });
                    } catch (error) {
                        console.log("Hubo un problema al usar el boton skip", error);
                        // await interaction.followUp({ content: "Hubo un error al intentar limpiar la cola.", ephemeral: true });
                    }
                };
            };

            //Boton Queue
            if (customId === 'queue_music') {
                const leaveCommand = client.musicacommands.get('queue');

                if (leaveCommand) {
                    await interaction.deferReply();

                    const fakeInteraction = {
                        id: interaction.id,
                        guildId: interaction.guildId,
                        member: interaction.member,
                        guild: interaction.guild,
                        channel: interaction.channel,
                        user: interaction.user,
                        options: {
                            getSubcommand: () => 'actual'
                        },
                        reply: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.followUp({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.followUp({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        },
                        followUp: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.followUp({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.followUp({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        },
                        deferReply: () => interaction.deferReply(),
                        editReply: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.editReply({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.editReply({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        }
                    };

                    try {
                        await leaveCommand.run({ client, interaction: fakeInteraction });
                    } catch (error) {
                        console.log("Hubo un problema al usar el boton queue", error);
                        // await interaction.followUp({ content: "Hubo un error al intentar limpiar la cola.", ephemeral: true });
                    }
                };
            };


            //Boton Loop OFF 
            if (customId === 'loopoff_music') {

                const loopCommand = client.musicacommands.get('loop');

                if (loopCommand) {
                    await interaction.deferReply();

                    const fakeInteraction = {
                        id: interaction.id,
                        guildId: interaction.guildId,
                        member: interaction.member,
                        guild: interaction.guild,
                        channel: interaction.channel,
                        user: interaction.user,
                        options: {
                            getSubcommand: () => 'off'
                        },
                        reply: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.followUp({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.followUp({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        },
                        followUp: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.followUp({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.followUp({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        },
                        deferReply: () => interaction.deferReply(),
                        editReply: async ({ content, embeds }) => {
                            if (content) {
                                await interaction.editReply({ content, embeds });
                            } else if (embeds && embeds.length > 0) {
                                await interaction.editReply({ embeds });
                            } else {
                                console.error("Intento de enviar un mensaje vacío.");
                            }
                        }
                    };
                    // Ejecuta el comando 'resume' con la fake interaction
                    try {
                        await loopCommand.run({ client, interaction: fakeInteraction });
                    } catch (error) {
                        console.log("Hubo un problema con loop cancion button", error);
                        //await interaction.followUp({ content: "Hubo un error al intentar repetir la cola." });
                    }
                };
            };

        } catch (error) {
            console.error("Hubo un problema con uno de los botones", error);
            return;
        }
    });
};