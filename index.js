const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./config.json');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

// تحميل جميع الأوامر من ملف واحد
const allCommands = require('./commands/جميع_الاوامر.js');

client.on('ready', () => {
    console.log(`تم تسجيل الدخول كبوت: ${client.user.tag}`);
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    if (args.length === 0) return;

    // استدعاء جميع الأوامر من الملف الواحد
    await allCommands.execute(message, args, client);
});

client.login(config.token);
