import { NextApiRequest, NextApiResponse } from 'next';

import sgMail from '@sendgrid/mail';
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

    // const transporter = nodemailer.createTransport({
    //   host: process.env.MAIL_HOST,
    //   port: Number(process.env.MAIL_PORT),
    //   auth: {
    //     user: process.env.MAIL_USERNAME,
    //     pass: process.env.MAIL_PASSWORD,
    //   },
    // });

    // await new Promise((resolve, reject) => {
    //   transporter.verify(function (error, success) {
    //     if (error) {
    //       console.log(error);
    //       reject(error);
    //     } else {
    //       console.log('Server is ready to take our messages');
    //       resolve(success);
    //     }
    //   });
    // });

    // const mailOptions = {
    //   from: 'KIKU Team <info@kiku.do>',
    //   to,
    //   subject,
    //   html: content,
    // };

    // await new Promise((resolve, reject) => {
    //   // send mail
    //   transporter.sendMail(mailOptions, (err, info) => {
    //     if (err) {
    //       console.error(err);
    //       reject(err);
    //     } else {
    //       console.log(info);
    //       resolve(info);
    //     }
    //   });
    // });

    // console.log(mailOptions);

    sgMail.setApiKey(process.env.SEND_GRID_KEY as string);

    // const options = {
    //   From: 'info@kiku.do',
    //   To: 'info@kiku.do',
    //   Subject: subject,
    //   HtmlBody: content,
    // };

    const msg = {
      to,
      from: 'KIKU Team <info@kiku.do>',
      subject,
      html: content,
    };

    await sgMail.send(msg);

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'An error occurred while sending the email', error });
  }
}
