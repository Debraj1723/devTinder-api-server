const { SendEmailCommand } = require("@aws-sdk/client-ses");
const { sesClient } = require("./sesClient.js");

const createSendEmailCommand = (
  toAddress,
  subject,
  emailContent,
  CcAddresses
) => {
  return new SendEmailCommand({
    Destination: {
      CcAddresses: CcAddresses || [],
      ToAddresses: toAddress || [],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: emailContent,
        },
        Text: {
          Charset: "UTF-8",
          Data: "This is a text from devTinder",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject || "No Subject",
      },
    },
    Source: "debraj@tinderlite.in",
    ReplyToAddresses: [
      /* more items */
    ],
  });
};

const sendEmail = async (toAddress, subject, emailContent, CcAddresses = []) => {
    console.log(
        {toAddress, subject, emailContent, CcAddresses}
    )
  const sendEmailCommand = createSendEmailCommand(
    toAddress,
    subject,
    emailContent,
    CcAddresses
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

module.exports = { sendEmail };
