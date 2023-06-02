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
    const { to, subject, content } = req.body;

    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: 'KIKU Team <info@kiku.do>',
      to,
      subject,
      html: content,
    };

    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email sent successfully', info });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'An error occurred while sending the email', error });
  }
}
