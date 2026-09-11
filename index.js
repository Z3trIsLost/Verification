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
    // 1. إعطاء الرتبة التلقائية (حط الـ ID تاع الرتبة هنا)
    const AUTO_ROLE_ID = '1548038145633951888';
    const roleToAdd = member.guild.roles.cache.get(AUTO_ROLE_ID);
    
    if (roleToAdd) {
      await member.roles.add(roleToAdd);
      console.log(`[SUCCESS] تم إعطاء الرتبة التلقائية للعضو: ${member.user.tag}`);
    } else {
      console.error('[ERROR] ما قدرش يلقى الرتبة الاوتوماتيكية، تأكد من الـ ID.');
    }

    // 2. إرسال رسالة الترحيب
    const channelId = process.env.WELCOME_CHANNEL_ID;
    const verificationRoleId = process.env.VERIFICATION_ROLE_ID;

    if (!channelId || !verificationRoleId) {
      console.error('[ERROR] معلومات الروم ولا رتبة التحقق ناقصة في الإعدادات.');
      return;
    }

    const channel = member.guild.channels.cache.get(channelId);

    if (channel) {
      const welcomeMessage = `👋 مرحبا بك \{member} يرجى الدخول الى الفويس في الاسفل و انتظار احد اعضاء <@&{verificationRoleId}> لتأكيد هويتك و شكرا على صبرك 🌹`;
      await channel.send(welcomeMessage);
      console.log(`[SUCCESS] تم الترحيب بالعضو الجديد: ${member.user.tag}`);
    } else {
      console.error('[ERROR] ما قدرش يلقى الروم تاع الترحيب.');
    }

  } catch (error) {
    console.error('[ERROR] صرا مشكل كي دخل العضو:', error);
  }
});

client.login(process.env.TOKEN);
