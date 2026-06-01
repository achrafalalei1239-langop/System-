// server.js - NEXUS BUILDER 2099
// Build Discord Servers Visually then Deploy with 1 Click

const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, ChannelType, PermissionFlagsBits } = require('discord.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: 'nexus_builder_secret_2099',
    resave: false,
    saveUninitialized: true
}));

// ========== Build the Real Server from Mockup Data ==========
async function buildRealServer(botToken, targetGuildId, mockupData, username) {
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
            return { error: 'Bot not in that server or invalid ID' };
        }

        const categoryMap = new Map();
        const results = { categories: 0, channels: 0, errors: [] };

        // 1. Create Categories
        const categoryPromises = [];
        for (const cat of mockupData.categories) {
            const promise = guild.channels.create({
                name: cat.name,
                type: ChannelType.GuildCategory,
                reason: 'NEXUS BUILDER 2099'
            }).then(ch => {
                categoryMap.set(cat.id, ch.id);
                results.categories++;
                return ch;
            }).catch(err => results.errors.push(`Category ${cat.name}: ${err.message}`));
            categoryPromises.push(promise);
        }
        await Promise.all(categoryPromises);

        // 2. Create Channels under their categories
        const channelPromises = [];
        for (const ch of mockupData.channels) {
            const parentId = ch.parentCategoryId ? categoryMap.get(ch.parentCategoryId) : null;
            const promise = guild.channels.create({
                name: ch.name,
                type: ChannelType.GuildText,
                parent: parentId,
                reason: 'NEXUS BUILDER 2099'
            }).then(() => results.channels++)
              .catch(err => results.errors.push(`Channel ${ch.name}: ${err.message}`));
            channelPromises.push(promise);
        }
        await Promise.all(channelPromises);

        await client.destroy();
        return {
            success: true,
            message: `Built ${results.categories} categories & ${results.channels} channels`,
            errors: results.errors
        };
    } catch (err) {
        if (client) await client.destroy();
        return { error: err.message };
    }
}

// API Routes
app.post('/api/build', async (req, res) => {
    const { token, guildId, mockup, username } = req.body;
    if (!token || !guildId || !mockup) {
        return res.json({ error: 'Missing token, guildId, or mockup data' });
    }
    const result = await buildRealServer(token, guildId, mockup, username);
    res.json(result);
});

app.listen(PORT, () => {
    console.log(`🚀 NEXUS BUILDER running on http://localhost:${PORT}`);
});
