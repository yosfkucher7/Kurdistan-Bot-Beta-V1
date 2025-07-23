const { readdirSync } = require('node:fs');
const ascii = require('ascii-table');
const table = new ascii('Events').setJustify();

module.exports = (client) => {
    readdirSync('./Events').forEach(folder => {
        const eventFiles = readdirSync(`./Events/${folder}`).filter(file => file.endsWith('.js'));
        for (const file of eventFiles) {
            const event = require(`../Events/${folder}/${file}`);
            if (event.name) {
                if (event.once) {
                    client.once(event.name, (...args) => event.execute(...args, client));
                } else {
                    client.on(event.name, (...args) => event.execute(...args, client));
                }
                table.addRow(event.name, '🟢 Working');
            } else {
                table.addRow(file, '🔴 Not working');
            }
        }
    });
    console.log(table.toString());
};
