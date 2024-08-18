const sendEmail = require("../utils/sendEmail");
const support=async (req, res, next) => {
    const { email, message } = req.body;
  
    if (!email || !message) {
      return res.status(400).json({ message: "Email and message are required" });
    }
  
    try {
      const supportMessage = `
        <h1>Support Request</h1>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
      `;
  
      await sendEmail({
        to: "mohamedmostafa58113@gmail.com",
        subject: "New Support Request",
        html: supportMessage,
      });
  
      return res.status(200).json({ message: "Your message has been sent!" });
    } catch (error) {
      return next(new Error("There was a problem sending your message"));
    }
  }
  module.exports=support