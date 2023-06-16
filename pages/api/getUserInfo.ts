import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import fs from 'fs';

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  try {
    const { email } = (await req.body) as {
      email: string;
    };

    const existUser = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (existUser) {
      res.status(200).json({
        user: { ...existUser },
      });
      return;
    }

    res.status(500).json({
      message: 'User information not found',
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export default handler;
