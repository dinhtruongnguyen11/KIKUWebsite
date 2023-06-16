import type { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '@/lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { orderID, status, email } = (await req.body) as {
    orderID: string;
    status: string;
    email: string;
  };

  console.log(orderID, status, email)

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
      where: { email: email },
      data: {
        plan: 'PAID',
      },
    });

    res.status(200).json({
      orderID,
      status,
    });;

  } catch (error: any) {
    res.status(500).json({
      message: error.message,
    });
  }
}
