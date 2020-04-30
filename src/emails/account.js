const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = async (email, name) => {
  try {
    await sgMail.send({
      to: email,
      from: "shaqdulove@hotmail.com",
      subject: "Welcome to the Task Manager App",
      text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
    });
  } catch (e) {
    console.log(e);
  }
};
const sendCancelEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: "shaqdulove@hotmail.com",
    subject: "Goodbye Valued Customer",
    text: `Sorry to see you leave ${name}. Please send us feedback some feedback about why you left and how we can improve.`,
  });
};
module.exports = { sendWelcomeEmail, sendCancelEmail };
