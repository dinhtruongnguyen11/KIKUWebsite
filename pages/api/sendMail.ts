import { NextApiRequest, NextApiResponse } from 'next';

import nodemailer from 'nodemailer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    let template = `
        <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Please activate your account</title>
        <!--[if mso]><style type="text/css">body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
    </head>
    
    <body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
        <table role="presentation"
        style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: rgb(239, 239, 239);">
        <tbody>
            <tr>
            <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
                <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                <tbody>
                    <tr>
                    <td style="padding: 40px 0px 0px;">
                        <div style="text-align: left;">
                        <div style="padding-bottom: 20px;"><img src="https://i.ibb.co/Qbnj4mz/logo.png" alt="Company" style="width: 56px;"></div>
                        </div>
                        <div style="padding: 20px; background-color: rgb(255, 255, 255);">
                        <div style="color: rgb(0, 0, 0); text-align: left;">
                            <h1 style="margin: 1rem 0">Final step...</h1>
                            <p style="padding-bottom: 16px">Follow this link to verify your email address.</p>
                            <p style="padding-bottom: 16px"><a href="#" target="_blank"
                                style="padding: 12px 24px; border-radius: 4px; color: #FFF; background: #2B52F5;display: inline-block;margin: 0.5rem 0;">Confirm
                                now</a></p>
                            <p style="padding-bottom: 16px">If you didn’t ask to verify this address, you can ignore this email.</p>
                            <p style="padding-bottom: 16px">Thanks,<br>The Mailmeteor team</p>
                        </div>
                        </div>
                        <div style="padding-top: 20px; color: rgb(153, 153, 153); text-align: center;">
                        <p style="padding-bottom: 16px">Made with ♥ in Paris</p>
                        </div>
                    </td>
                    </tr>
                </tbody>
                </table>
            </td>
            </tr>
        </tbody>
        </table>
    </body>
    
    </html>
        `;
    const { to } = req.body;

    const subject = 'Thanks for signing up, Jane!';

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: 'info@kiku.do',
      to,
      subject,
      html: template,
    };

    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully', info });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'An error occurred while sending the email', error });
  }
}
