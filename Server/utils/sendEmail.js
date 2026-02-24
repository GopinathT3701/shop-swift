import SibApiV3Sdk from "sib-api-v3-sdk";
import dotenv from "dotenv";

dotenv.config();

const client = SibApiV3Sdk.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const sendEmail = async (to, subject, htmlContent) => {
  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  try {
    await apiInstance.sendTransacEmail({
      sender: {
        email: "gopinath732001@gmail.com",
        name: "Shopvibe",
      },
      to: [{ email: to }],
      subject: subject,
      htmlContent: htmlContent,
      textContent:  "Your order has been confirmed. Order ID: " + subject
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email error:", error.response?.body || error);
  }
};

export default sendEmail;
