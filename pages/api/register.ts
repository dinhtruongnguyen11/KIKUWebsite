import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';
import { Plan } from '@prisma/client';
import { hash } from 'bcryptjs';
import fs from 'fs';

const sendMail = async (
  user: any,
  code: any,
  password: string,
  baseUrl: string,
) => {
  var path = require('path');
  const configDirectory = path.resolve(process.cwd(), 'email_templates');
  var filePath = path.join(configDirectory, 'signup-email.html');
  let template = fs.readFileSync(filePath, 'utf-8');

  template = template
    .replace('&username', user.name)
    .replace('&username', user.name);
  template = template.replace('&code', code.code);
  template = template.replace('&email', user.email);
  template = template.replace('&password', password);

  const subject = `Thanks for signing up, ${user.name}!`;
  const body = {
    to: user.email,
    content: template,
    subject,
    code,
  };

  await fetch(`${baseUrl}/api/sendMail`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (req.method === 'POST') {
    try {
      const currentUrl = new URL(req.headers.referer as string);
      const baseUrl = `${currentUrl.protocol}//${currentUrl.host}`;

      const { name, email, password, reSend } = (await req.body) as {
        name: string;
        email: string;
        password: string;
        reSend: string;
      };

      let newUser: any;

      if (reSend && reSend == '1') {
        const existUser = await prisma.user.findFirst({
          where: {
            email: email.toLowerCase(),
          },
        });

        if (existUser) {
          newUser = existUser;
        } else {
          res.status(500).json({
            message: 'Your email does not exist',
          });
          return;
        }
      } else {
        const hashed_password = await hash(password, 12);
        const existUser = await prisma.user.findFirst({
          where: {
            email: email.toLowerCase(),
          },
        });

        if (existUser) {
          res.status(500).json({
            message: 'Your email already exists.',
          });
          return;
        }

        newUser = await prisma.user.create({
          data: {
            name,
            email: email.toLowerCase(),
            password: hashed_password,
            plan: Plan.FREE,
          },
        });
      }

      const newCode = await prisma.verificationCode.create({
        data: {
          code: Math.floor(100000 + Math.random() * 900000).toString(),
          email: email.toLowerCase(),
          type: 'NEW_ACCOUNT',
        },
      });

      sendMail(newUser, newCode, password, baseUrl);

      res.status(200).json({
        user: {
          name: newUser.name,
          email: newUser.email,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
};

export default handler;
