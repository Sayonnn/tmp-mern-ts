import nodemailer from "nodemailer";
import { config } from "./index.js";
import handlebarOptions from "./handlebar.js";
import hbs from "nodemailer-express-handlebars";

/** Configure transporter */
const transporter = nodemailer.createTransport({
    host: config.mail.host,
    port: config.mail.port,
    secure: config.mail.secure,
    auth: {
        user: config.mail.auth.user,
        pass: config.mail.auth.pass
    }
});

/** Configure transporter */
transporter.use("compile", hbs(handlebarOptions));

export default transporter;
