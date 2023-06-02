import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';
import fs from 'fs';

const sendMail = async (
  name: string,
  email: string,
  resetLink: string,
  baseUrl: string,
) => {
  var path = require('path');
  const configDirectory = path.resolve(process.cwd(), 'email_templates');
  var filePath = path.join(configDirectory, 'reset-password.html');
  let template = fs.readFileSync(filePath, 'utf-8');

  template = template.replace('&username', name);
  template = template.replace('&reset_link', resetLink);

  const subject = `Password Reset`;
  const body = {
    to: email,
    content: template,
    subject,
  };

  const res = await fetch(`${baseUrl}/api/sendMail`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { email } = req.body;
    const currentUrl = new URL(req.headers.referer as string);
    const baseUrl = `${currentUrl.protocol}//${currentUrl.host}`;

    const existUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!existUser) {
      res.status(404).json({
        message: 'Email does not exist',
      });
      return;
    }

    const newCode = await prisma.verificationCode.create({
      data: {
        code: Math.floor(100000 + Math.random() * 900000).toString(),
        email: email.toLowerCase(),
        type: 'RESET_PASSWORD',
      },
    });

    var resetLink = `${baseUrl}/authenticate/newPassword?code=` + newCode.code;

    sendMail(existUser.name, existUser.email, resetLink, baseUrl);

    res.status(200).json({
      message: 'Reset password successful',
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'An error occurred while sending the email', error });
  }
}
