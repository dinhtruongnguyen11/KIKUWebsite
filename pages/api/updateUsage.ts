import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  try {
    const { email, type, value } = (await req.body) as {
      email: string;
      type: string;
      value: string;
    };

    const existUser = await prisma.user.findFirst({
      where: {
        email: email.toLowerCase(),
      },
    });


    if (existUser) {
      if (type == 'WORD') {
        await prisma.user.update({
          where: { email },
          data: {
            wordCount: parseInt(value),
          },
        });
      }else if (type == 'IMAGE') {
        await prisma.user.update({
          where: { email:email },
          data: {
            imageCount: parseInt(value),
          },
        });
      }
      res.status(200).json({
        message:'Update successfully'
      });
      return;
    }

    res.status(500).json({
      message: 'Error when update usage',
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export default handler;
