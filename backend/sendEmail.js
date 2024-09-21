import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import validateEmailFormat from "./CheckDomainExistsOrNot.js";
import checkDomainExists from "./CheckDomainExistsOrNot.js";
dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

const sendEmail = async (req, res) => {
    try {
        // Extract form data from req.body
        const { name, phone, email, subject, message } = req.body;

        if (!validateEmailFormat(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if the domain exists
        const domainExists = await checkDomainExists(email);
        if (!domainExists) {
            return res.status(400).json({ message: 'Email domain does not exist' });
        }

        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: process.env.EMAIL,
                clientId: process.env.CLIENT_ID,
                clientSecret: process.env.CLIENT_SECRET,
                refreshToken: process.env.REFRESH_TOKEN,
                accessToken: accessToken.token,
            },
        });

        // Beautified HTML email content
        const mailOptions = {
            from: `${name} <${process.env.EMAIL}>`,
            to: email,
            subject: subject,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2 style="color: #4CAF50;">New Message from ${name}</h2>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <hr style="border: 1px solid #ddd; margin: 20px 0;">
                    <p style="font-size: 16px; color: #555;"><strong>Message:</strong></p>
                    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
                        <p style="font-size: 16px; color: #333;">${message}</p>
                    </div>
                    <hr style="border: 1px solid #ddd; margin: 20px 0;">
                    <footer style="text-align: center; font-size: 12px; color: #999;">
                        <p>Sent from Email Sender Application</p>
                    </footer>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully!', result });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Failed to send email', error });
    }
};

export default sendEmail;
