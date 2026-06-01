const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } = require('discord.js');

const app = express();
const PORT = process.env.PORT || 3000;

// إنشاء المجلدات إذا ما كانت موجودة
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

// ========== بناء السيرفر مع صلاحيات الرومات المخفية ==========
async function buildRealServer(botToken, targetGuildId, mockupData, deleteFirst) {
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
            return { error: '❌ البوت ليس في هذا السيرفر أو ID غير صحيح' };
        }

        // حذف جميع القنوات إذا طلب المستخدم
        if (deleteFirst) {
            const channels = guild.channels.cache;
            const deletePromises = [];
            for (const [id, ch] of channels) {
                if (ch.deletable) deletePromises.push(ch.delete().catch(() => null));
            }
            await Promise.all(deletePromises);
        }

        const categoryMap = new Map();
        const results = { categories: 0, channels: 0, hidden: 0 };

        // 1. إنشاء الكاتيجوريات مع الصلاحيات
        for (const cat of mockupData.categories) {
            const category = await guild.channels.create({
                name: cat.name,
                type: ChannelType.GuildCategory,
                reason: 'NEXUS INFERNO'
            });
            
            // تطبيق الصلاحيات: إذا كان مخفي، الكل ما يشوفه إلا الإدارة
            if (cat.hidden === true) {
                await category.permissionOverwrites.edit(guild.roles.everyone, {
                    ViewChannel: false
                });
                results.hidden++;
            }
            
            categoryMap.set(cat.id, category.id);
            results.categories++;
        }

        // 2. إنشاء الرومات مع الصلاحيات
        for (const ch of mockupData.channels) {
            const parentId = ch.parentCategoryId ? categoryMap.get(ch.parentCategoryId) : null;
            const channel = await guild.channels.create({
                name: ch.name,
                type: ChannelType.GuildText,
                parent: parentId,
                reason: 'NEXUS INFERNO'
            });
            
            // تطبيق الصلاحيات على الروم
            if (ch.hidden === true) {
                await channel.permissionOverwrites.edit(guild.roles.everyone, {
                    ViewChannel: false
                });
                results.hidden++;
            }
            
            results.channels++;
        }

        await client.destroy();
        
        let message = `✅ تم بناء السيرفر!\n📁 ${results.categories} كاتيجوري\n💬 ${results.channels} روم\n🔒 ${results.hidden} عنصر مخفي (للإدارة فقط)`;
        
        return { success: true, message: message };
        
    } catch (err) {
        if (client) await client.destroy();
        return { error: err.message };
    }
}

// ========== API ==========
app.post('/api/build', async (req, res) => {
    const { token, guildId, mockup, deleteFirst } = req.body;
    
    if (!token || !guildId || !mockup) {
        return res.json({ error: '❌ البيانات ناقصة: توكن، ID سيرفر، أو بيانات المحاكاة' });
    }
    
    const result = await buildRealServer(token, guildId, mockup, deleteFirst);
    res.json(result);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`
    ╔════════════════════════════════════════╗
    ║   🔥 NEXUS INFERNO IS LIVE 🔥          ║
    ║   http://localhost:${PORT}                ║
    ║   Hidden Channels Fixed!               ║
    ╚════════════════════════════════════════╝
    `);
});
