import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  try {
    const { email, type } = (await req.body) as {
      email: string;
      type: string;
    };

    const existUser = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    });

    if (existUser) {
      const plan = type == '1' ? 'PAID' : 'FREE';

      await prisma.user.update({
        where: { email: email },
        data: {
          plan,
        },
      });
      res.status(200).json({
        message: 'Update successfully',
      });
      return;
    }

    res.status(500).json({
      message: 'Error when update plan',
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export default handler;
