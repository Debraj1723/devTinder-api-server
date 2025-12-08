require("dotenv").config();
const { SESClient } = require("@aws-sdk/client-ses");

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: String(process.env.AWS_SES_ACCESS_KEY),
    secretAccessKey: String(process.env.AWS_SES_SECRET_KEY),
  },
});

module.exports = { sesClient };