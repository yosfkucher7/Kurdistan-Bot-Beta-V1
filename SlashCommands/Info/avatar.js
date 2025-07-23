const discord = require("discord.js");

// Cooldown map
const cooldowns = new Map();

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Shows The Avatar Of A User")
    .addUserOption((option) =>
      option.setName("user").setDescription("Select a user")
    ),
  /**
   * @param {discord.Client} client
   * @param {discord.CommandInteraction} interaction
   */
  async execute(interaction, client) {
    const userId = interaction.user.id;
    const now = Date.now();
    const cooldownAmount = 15 * 1000;

    if (cooldowns.has(userId)) {
      const expirationTime = cooldowns.get(userId);
      if (now < expirationTime) {
        const timeLeft = Math.ceil((expirationTime - now) / 1000);
        return interaction.reply({
          content: `⏳ Please wait ${timeLeft} seconds before using this command again.`,
          ephemeral: true,
        });
      }
    }

    cooldowns.set(userId, now + cooldownAmount);
    setTimeout(() => cooldowns.delete(userId), cooldownAmount);

    let user = interaction.options.getUser("user");

    if (!user) {
      user = interaction.user;
    }

    const avatarEmbed = new discord.EmbedBuilder()
      .setColor("#0155b6")
      .setTitle(`**${user.username}**'s Avatar`)
      .setImage(
        `${user.displayAvatarURL({
          size: 256,
        })}`
      )
      .setFooter({
        text: "All Right Reversed To Yosf Kucher | هەموو کوبی رایت دزڤریت بو یوسف کوجەر",
      });

    const avatarRow = new discord.ActionRowBuilder().addComponents(
      new discord.ButtonBuilder()
        .setLabel("Avatar Link")
        .setStyle(discord.ButtonStyle.Link)
        .setURL(
          `${user.avatarURL({
            size: 256,
          })}`
        )
    );

    await interaction.reply({
      embeds: [avatarEmbed],
      components: [avatarRow],
    });
  },
};
