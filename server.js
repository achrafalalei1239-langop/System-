const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, ChannelType } = require('discord.js');

const app = express();
const PORT = process.env.PORT || 3000;

if (!fs.existsSync('./data')) fs.mkdirSync('./data');
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');
if (!fs.existsSync('./data/users.json')) fs.writeFileSync('./data/users.json', '[]');

app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: 'nexus_inferno_secret_2099',
    resave: false,
    saveUninitialized: true
}));

async function buildRealServer(botToken, targetGuildId, mockupData, deleteFirst) {
    let client = null;
    try {
        client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
        await client.login(botToken);
        await new Promise(resolve => client.once('ready', resolve));

        const guild = client.guilds.cache.get(targetGuildId);
        if (!guild) return { error: 'البوت مو موجود بهالسيرفر' };

        if (deleteFirst) {
            const channels = guild.channels.cache;
            const deletePromises = [];
            for (const [id, ch] of channels) {
                if (ch.deletable) deletePromises.push(ch.delete().catch(() => null));
            }
            await Promise.all(deletePromises);
        }

        const categoryMap = new Map();
        const categoryPromises = [];
        for (const cat of mockupData.categories) {
            categoryPromises.push(guild.channels.create({
                name: cat.name,
                type: ChannelType.GuildCategory,
                reason: 'NEXUS INFERNO'
            }).then(ch => { categoryMap.set(cat.id, ch.id); return ch; }).catch(() => null));
        }
        await Promise.all(categoryPromises);

        const channelPromises = [];
        for (const ch of mockupData.channels) {
            const parentId = ch.parentCategoryId ? categoryMap.get(ch.parentCategoryId) : null;
            channelPromises.push(guild.channels.create({
                name: ch.name,
                type: ChannelType.GuildText,
                parent: parentId,
                reason: 'NEXUS INFERNO'
            }).catch(() => null));
        }
        await Promise.all(channelPromises);

        await client.destroy();
        return { success: true, message: '✅ تم بناء السيرفر الأسطوري!' };
    } catch (err) {
        if (client) await client.destroy();
        return { error: err.message };
    }
}

app.post('/api/build', async (req, res) => {
    const { token, guildId, mockup, deleteFirst } = req.body;
    const result = await buildRealServer(token, guildId, mockup, deleteFirst);
    res.json(result);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`🔥 NEXUS INFERNO on http://localhost:${PORT}`));
