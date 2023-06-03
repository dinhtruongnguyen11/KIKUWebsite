import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';
import fs from 'fs';

const sendMail = async (user: any, newCode: any, baseUrl: string) => {
  var path = require('path');
  const configDirectory = path.resolve(process.cwd(), 'email_templates');
  var filePath = path.join(configDirectory, 'reset-password.html');
  let template = fs.readFileSync(filePath, 'utf-8');

  var resetLink = `${baseUrl}/authenticate/newPassword?code=` + newCode.code;
  template = template.replace('&username', user.name);
  template = template.replace('&reset_link', resetLink);

  const subject = `Password Reset`;
  const body = {
    to: user.email,
    content: template,
    subject,
    code: newCode.code,
  };

  await fetch(`${baseUrl}/api/sendMail`, {
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

    try {
      const currentUrl = new URL(req.headers.referer as string);
      var baseUrl = `${currentUrl.protocol}//${currentUrl.host}`;
    } catch {
      var baseUrl = process.env.NEXTAUTH_URL as string;
    }

    const existUser = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!existUser) {
      res.status(404).json({
        message: 'Email does not exist!',
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

    sendMail(existUser, newCode, baseUrl);

    res.status(200).json({
      message: 'Reset password successful',
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'An error occurred while reset password', error });
  }
}
