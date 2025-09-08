/* 
 * Name: Mailer Service
 * Description: This service is responsible for sending emails for clients
 * Author: Sayon
 * Date: 2025-09-06
 * Path: app/services/mail.service.js 
 * Version: 1.0.0
 */ 
import { config } from "../configs/index.js";
import transporter from "../configs/mailer.js";

export default async function sendEmail({
  to = [],
  name = "",
  link = "",
  template = "",
  subject = `${config.app.emailHeader}`,
  attachments = [],
}) {
  const recipients = Array.isArray(to) ? to.join(", ") : to;

  await transporter.sendMail({
    from: `"${config.app.emailHeader}" <${config.mail.auth.user}>`,
    to: recipients, 
    subject: subject + " | " + config.app.coolName,
    template,
    context: { name, link },
    attachments,
  });

  console.log(`Email successfully sent to: ${recipients}`);
}
