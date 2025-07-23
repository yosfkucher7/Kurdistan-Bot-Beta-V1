// ===== Express Server to Keep Bot Alive (for hosting platforms like Replit) =====
const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('Developer code on top!');
});

app.listen(port, () => {
  console.log(`🟢 | Web server running on port ${port}`);
});

// ===== Discord Client Setup =====
const { Client, GatewayIntentBits, Partials, WebhookClient, EmbedBuilder } = require('discord.js');
const { TOKEN, ERROR_WEBHOOK_URL, OWNER_ID } = require('./JSON/Config.json'); // ✅ أضف المتغيرات الجديدة هنا
const { readdirSync } = require('node:fs');
const path = require('node:path');

const client = new Client({
  intents: Object.values(GatewayIntentBits),
  partials: Object.values(Partials)
});

// ===== Load Handlers Automatically (must export a function) =====
const handlersPath = path.join(__dirname, 'Handlers');
readdirSync(handlersPath).forEach(file => {
  const handler = require(path.join(handlersPath, file));
  if (typeof handler === 'function') {
    handler(client);
  } else {
    console.warn(`[⚠️] Handler "${file}" does not export a function!`);
  }
});

// ===== Error Webhook Setup =====
const webhook = new WebhookClient({ url: ERROR_WEBHOOK_URL });

async function sendError(error) {
  console.error('❌ | Error caught:', error);

  const embed = new EmbedBuilder()
    .setTitle("Thailand Codes || Syno Uptime")
    .setURL("https://discord.gg/J6p6Anx2zu")
    .setDescription(`\`\`\`${error.stack || error}\`\`\``)
    .setColor("#2f3136")
    .setTimestamp();

  await webhook.send({
    content: `<@!${OWNER_ID}> Your project encountered an error.`,
    embeds: [embed]
  });
}

// ===== Global Error Handlers =====
process.on("unhandledRejection", sendError);
process.on("rejectionHandled", sendError);
process.on("uncaughtException", sendError);

// ===== Login the bot =====
client.login(TOKEN).then(() => {
  console.log("✅ | Bot is logged in successfully!");
}).catch(async (err) => {
  await sendError(err);
  process.exit(1); // Exit with failure
});
