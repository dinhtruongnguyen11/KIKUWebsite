import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    await prisma.user.deleteMany({});
    await prisma.verificationCode.deleteMany({});

    res.status(200).json({
      message: 'Reset data successful!',
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'An error occurred while reset data!', error });
  }
}
