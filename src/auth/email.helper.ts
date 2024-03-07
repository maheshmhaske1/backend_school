
// email.helper.ts

import * as nodemailer from 'nodemailer';

// Create a transporter using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'satyajitvarpe45@gmail.com',
    pass: 'dvqleodsihmkujms',
  },
});

// Helper function to send email
export async function sendEmail(email: string, subject: string, body: string, attachment?: string): Promise<void> {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: 'satyajitvarpe45@gmail.com',
                pass: 'dvqleodsihmkujms'
            }
        });

        const mail = {
            from: 'satyajitvarpe45@gmail.com',
            to: email,
            subject: subject,
            html: body,
            attachments: attachment ? [{ path: attachment }] : []
        };

        await transporter.sendMail(mail);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
        throw error; // Re-throw the error to be caught by the caller
    }
}
