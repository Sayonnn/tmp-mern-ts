import sendEmail from "../services/mail.service.js";

export async function startSendingSystemEmail(req, res) {
  try {
    const { to, subject, template, name, link, attachments } = req.body;

    await sendEmail({ to, subject, template, name, link, attachments });

    return res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending email:", err);
    return res.status(500).json({ error: "Error sending email" });
  }
}
 