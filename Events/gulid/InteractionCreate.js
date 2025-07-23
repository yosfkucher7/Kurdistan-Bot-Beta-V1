const { Events, ChannelType } = require('discord.js');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        // منع تنفيذ الأوامر في الخاص
        if (interaction.channel.type === ChannelType.DM) {
            return interaction.reply({
                content: "❌ This command cannot be used in DMs.",
                ephemeral: true
            });
        }

        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
            return interaction.reply({
                content: `❌ No command matching \`${interaction.commandName}\` was found.`,
                ephemeral: true
            });
        }

        try {
            await command.execute(interaction, client);
        } catch (error) {
            console.error(error);
            interaction.reply({
                content: `❌ Error executing \`${interaction.commandName}\`.`,
                ephemeral: true
            });
        }
    },
};
