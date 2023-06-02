import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { code, email } = req.body;

    const existCode = await prisma.verificationCode.findFirst({
      where: {
        code: code,
        email: email,
        active: true,
      },
    });

    if (!existCode) {
      res.status(404).json({
        message: 'Authentication code is no longer valid',
      });
      return;
    }

    await prisma.user.update({
      where: { email: email },
      data: {
        verified: true,
      },
    });

    await prisma.verificationCode.update({
      where: { id: existCode.id },
      data: {
        active: false,
      },
    });

    res.status(200).json({
      message: 'Authentication successful',
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'An error occurred while active your account', error });
  }
}
