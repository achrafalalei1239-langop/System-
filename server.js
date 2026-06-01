const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, ChannelType } = require('discord.js');

const app = express();
const PORT = process.env.PORT || 3000;

// إعداد المجلدات
if (!fs.existsSync('./data')) fs.mkdirSync('./data');
if (!fs.existsSync('./data/users.json')) fs.writeFileSync('./data/users.json', '[]');

app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: 'nexus_builder_secret_key_2099',
    resave: false,
    saveUninitialized: true
}));

// ========== بناء السيرفر الحقيقي ==========
async function buildRealServer(botToken, targetGuildId, mockupData) {
    let client = null;
    try {
        client = new Client({
            intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
        });

        await client.login(botToken);
        await new Promise(resolve => client.once('ready', resolve));

        const guild = client.guilds.cache.get(targetGuildId);
        if (!guild) {
            await client.destroy();
            return { error: 'البوت ليس في هذا السيرفر أو ID غير صحيح' };
        }

        const categoryMap = new Map();
        const results = { categories: 0, channels: 0, errors: [] };

        // 1. إنشاء جميع الكاتيجوريات دفعة واحدة
        const categoryPromises = [];
        for (const cat of mockupData.categories) {
            const promise = guild.channels.create({
                name: cat.name,
                type: ChannelType.GuildCategory,
                reason: 'NEXUS BUILDER'
            }).then(ch => {
                categoryMap.set(cat.id, ch.id);
                results.categories++;
                return ch;
            }).catch(err => results.errors.push(`Category ${cat.name}: ${err.message}`));
            categoryPromises.push(promise);
        }
        await Promise.all(categoryPromises);

        // 2. إنشاء جميع الرومات دفعة واحدة
        const channelPromises = [];
        for (const ch of mockupData.channels) {
            const parentId = ch.parentCategoryId ? categoryMap.get(ch.parentCategoryId) : null;
            const promise = guild.channels.create({
                name: ch.name,
                type: ChannelType.GuildText,
                parent: parentId,
                reason: 'NEXUS BUILDER'
            }).then(() => results.channels++)
              .catch(err => results.errors.push(`Channel ${ch.name}: ${err.message}`));
            channelPromises.push(promise);
        }
        await Promise.all(channelPromises);

        await client.destroy();
        return {
            success: true,
            message: `✅ تم بناء ${results.categories} كاتيجوري و ${results.channels} روم`,
            errors: results.errors
        };
    } catch (err) {
        if (client) await client.destroy();
        return { error: err.message };
    }
}

// ========== API Routes ==========
app.post('/api/build', async (req, res) => {
    const { token, guildId, mockup } = req.body;
    if (!token || !guildId || !mockup) {
        return res.json({ error: 'البيانات ناقصة: توكن، ID سيرفر، أو بيانات المحاكاة' });
    }
    const result = await buildRealServer(token, guildId, mockup);
    res.json(result);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 NEXUS BUILDER running on http://localhost:${PORT}`);
});
