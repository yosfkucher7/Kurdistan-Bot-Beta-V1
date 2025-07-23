const { EmbedBuilder } = require('discord.js');
const db = require('pro.db');

module.exports = {
  name: 'messageCreate',

  async execute(message) {
    if (message.author.bot) return;

    const channels = db.get('autoLineChannels') || [];
    const image = db.get('autoLineImage');

    if (!channels.includes(message.channel.id)) return;

    if (image) {
      await message.channel.send({
        embeds: [
          new EmbedBuilder()
            .setImage(image)
            .setColor('Blue')
        ]
      });
    }
  }
};
