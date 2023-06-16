import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';

const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {

  const { orderID, status, email } = (await req.body) as {
    orderID: string;
    status: string;
    email: string;
  };

  if (!orderID || !status || !email) {
  return res.status(400).json({
    message: 'Missing required fields in request body.',
  });
}

  try {
    //Once order is created store the data using Prisma
    await prisma.payment.create({
      data: {
        orderID,
        status,
        email,
      },
    });

    await prisma.user.update({
      where: { email },
      data: {
        plan: 'PAID',
      },
    });

    res.status(200).json({
      orderID,
      status,
    });
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export default handler;
