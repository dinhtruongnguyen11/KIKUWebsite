import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { code, password } = req.body;

    const existCode = await prisma.verificationCode.findFirst({
      where: {
        code: code,
        active: true,
      },
    });

    if (!existCode) {
      res.status(404).json({
        message: 'Authentication code is no longer valid',
      });
      return;
    }

    const hashed_password = await hash(password, 12);

    await prisma.user.update({
      where: { email: existCode.email },
      data: {
        password: hashed_password,
      },
    });

    await prisma.verificationCode.update({
      where: { id: existCode.id },
      data: {
        active: false,
      },
    });

    res.status(200).json({
      message: 'Reset password successful',
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'An error occurred while reset password', error });
  }
}
