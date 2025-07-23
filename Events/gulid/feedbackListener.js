const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const path = require("path");

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (message.author.bot) return;

    const configPath = path.join(__dirname, "../../feedback-config.json");
    if (!fs.existsSync(configPath)) return;

    const config = JSON.parse(fs.readFileSync(configPath));
    const feedbackChannelId = config[message.guild?.id];

    if (!feedbackChannelId) return;
    if (message.channel.id !== feedbackChannelId) return;

    const embed = new EmbedBuilder()
      .setColor("#5865F2")
      .setTitle("New Feedback Received")
      .setDescription(message.content)
      .setFooter({ text: `From: ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
      .setTimestamp();

    await message.channel.send({
      content: `<@${message.author.id}>`,
      embeds: [embed],
    });

    await message.delete().catch(() => {});
  }
};
