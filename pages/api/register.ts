import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (req.method === 'POST') {
    try {
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
