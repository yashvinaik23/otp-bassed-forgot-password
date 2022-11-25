const sendSMS = async (receivers_number, message_text) => {
  const client = require("twilio")(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  const message = await client.messages.create({
    body: message_text,
    from: process.env.FROM_NUMBER_SEND_SMS,
    to: `${receivers_number}`,
  });
  return message;
};

module.exports = sendSMS;
