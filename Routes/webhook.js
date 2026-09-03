const express = require('express');
const axios = require('axios');

const router = express.Router();

router.get('/', (req, res) => {
  const { 'hub.mode': mode, 'hub.verify_token': token, 'hub.challenge': challenge } = req.query;

  if (mode === 'subscribe' && token === process.env.VERIFY_TOKEN) {
    console.log('Webhook verificado correctamente');
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

router.post('/', async (req, res) => {
  const body = req.body;

  if (body.object !== 'whatsapp_business_account') {
    return res.sendStatus(404);
  }

  res.sendStatus(200);

  for (const entry of body.entry || []) {
    for (const change of entry.changes || []) {
      const message = change.value?.messages?.[0];
      if (!message || !message.from) continue;

      const text = message.text?.body || '';
      console.log('Mensaje entrante:', text);

      try {
        await axios.post(
          `https://graph.facebook.com/${process.env.META_API_VERSION || 'v25.0'}/${process.env.PHONE_NUMBER_ID}/messages`,
          {
            messaging_product: 'whatsapp',
            to: message.from,
            text: { body: `Recibí tu mensaje: "${text}"` }
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.META_ACCESS_TOKEN}`,
              'Content-Type': 'application/json'
            }
          }
        );
      } catch (error) {
        console.error('Error respondiendo por WhatsApp:', error.response?.data || error.message);
      }
    }
  }
});

module.exports = router;