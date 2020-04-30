const sgMail = require("@sendgrid/mail");

const sendgridAPIKey =
  "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";

sgMail.setApiKey(sendgridAPIKey);

const sendEmail = async () => {
  try {
    await sgMail.send({
      to: "shaqdulove@gmail.com",
      from: "shaqdulove@hotmail.com",
      subject: "This is my first crateion",
      text: "I hope this gets to you.",
    });
  } catch (e) {
    console.log(e);
  }
};
sendEmail();
