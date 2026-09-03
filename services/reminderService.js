const axios = require('axios');
const { connectToDatabase } = require('../database');

async function sendWhatsAppMessage(to) {
  await axios.post(
    `https://graph.facebook.com/${process.env.META_API_VERSION || 'v25.0'}/${process.env.PHONE_NUMBER_ID}/messages`,
    {
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: 'hello_world',
        language: {
          code: 'en_US'
        }
      }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }
  );
}

async function processReminders() {
  const db = await connectToDatabase();
  const users = db.collection('users');

  const reminders = await users.find({
    active: true,
    nextReminderAt: { $lte: new Date() }
  }).toArray();

  for (const user of reminders) {
    try {
      const claimed = await users.updateOne(
        {
          _id: user._id,
          active: true,
          nextReminderAt: user.nextReminderAt
        },
        { $set: { nextReminderAt: null, reminderInProgress: true } }
      );

      if (claimed.modifiedCount !== 1) {
        continue;
      }

      await sendWhatsAppMessage(user.cellphone);

      const nextReminderAt = new Date();
      nextReminderAt.setDate(nextReminderAt.getDate() + (user.reminderIntervalDays || 1));

      await users.updateOne(
        { _id: user._id },
        {
          $set: {
            nextReminderAt,
            lastSentAt: new Date(),
            reminderInProgress: false
          }
        }
      );
    } catch (error) {
      await users.updateOne(
        { _id: user._id },
        { $set: { nextReminderAt: user.nextReminderAt, reminderInProgress: false } }
      );
      console.error(
        `Error enviando recordatorio a ${user.cellphone}:`,
        error.response?.data || error.message
      );
    }
  }
}

module.exports = { processReminders };