import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { nanoid } from 'nanoid';

const sendMail = async (user: any, code: any) => {
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
                            <p style="padding-bottom: 16px">Thanks,<br>The KIKU team</p>
                        </div>
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

  const subject = `Thanks for signing up, ${user.name}!`;
  const body = {
    to: user.email,
    content: template,
    subject,
  };

  const res = await fetch('http://localhost:3000/api/sendMail', {
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
      await prisma.user.deleteMany({});

      const { name, email, password } = (await req.body) as {
        name: string;
        email: string;
        password: string;
      };
      const hashed_password = await hash(password, 12);

      const existUser = await prisma.user.findUnique({
        where: {
          email: email.toLowerCase(),
        },
      });

      if (existUser) {
        res.status(500).json({
          message: 'Your email already exists.',
        });
      }

      const user = await prisma.user.create({
        data: {
          name,
          email: email.toLowerCase(),
          password: hashed_password,
        },
      });

      const newCode = await prisma.verificationCode.create({
        data: {
          code: Math.floor(100000 + Math.random() * 900000).toString(),
          userId: user.id,
        },
      });

      const rs = sendMail(user, newCode);

      res.status(200).json({
        user: {
          name: user.name,
          email: user.email,
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
