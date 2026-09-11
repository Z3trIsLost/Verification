require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const express = require('express');

// إعداد خادم الويب باش يبقى البوت أونلاين
const app = express();
app.get('/', (req, res) => {
  res.send('البوت راهو خدام 24/7!');
});
app.listen(3000, () => {
  console.log('[INFO] خادم الويب راهو شغال باش يستقبل البينق.');
});

// إعداد البوت
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ],
});

client.once('ready', () => {
  console.log(`[INFO] البوت راهو واجد ويخدم باسم: ${client.user.tag}`);
});

client.on('guildMemberAdd', async (member) => {
  try {
    const channelId = process.env.WELCOME_CHANNEL_ID;
    const roleId = process.env.VERIFICATION_ROLE_ID;

    if (!channelId || !roleId) {
      console.error('[ERROR] معلومات الروم ولا الرتبة ناقصة في الإعدادات.');
      return;
    }

    const channel = member.guild.channels.cache.get(channelId);

    if (!channel) {
      console.error('[ERROR] ما قدرش يلقى الروم، تأكد من الـ ID تاع WELCOME_CHANNEL_ID.');
      return;
    }

    // هنا استعملنا الباكتيك باش المتغيرات يخدمو نورمال
    const welcomeMessage = `👋 مرحبا بك \({member}! يرجى الدخول الى الفويس في الاسفل و انتظار احد اعضاء <@&\){roleId}> لتأكيد هويتك و شكرا على صبرك 🌹`;

    await channel.send(welcomeMessage);
    console.log(`[SUCCESS] تم الترحيب بالعضو الجديد: ${member.user.tag}`);

  } catch (error) {
    console.error('[ERROR] صرا مشكل كي جا يبعث الترحيب:', error);
  }
});

client.login(process.env.TOKEN);
