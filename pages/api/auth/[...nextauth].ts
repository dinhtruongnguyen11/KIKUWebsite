import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';
import { compare } from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/authenticate/login',
  },
  session: {
    strategy: 'jwt',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),

    CredentialsProvider({
      name: 'Sign in',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !(await compare(credentials.password, user.password))) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          randomKey: 'Hey cool',
        };
      },
    }),
  ],
  callbacks: {
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          randomKey: token.randomKey,
        },
      };
    },
    jwt: async ({ token, user }) => {
      if (user) {
        const u = user as unknown as any;

        const existUser = await prisma.user.findFirst({
          where: {
            email: u.email,
          },
        });

        if (!existUser) {
          var password =
            '2023' + Math.floor(100000 + Math.random() * 900000).toString();
          const hashed_password = await hash(password, 12);
          await prisma.user.create({
            data: {
              name: u.name,
              email: u.email.toLowerCase(),
              password: hashed_password,
              plan: 'NONE',
              verified: true,
            },
          });
        }

        await prisma.userLogging.create({
          data: {
            type: 'LOGIN',
            email: u.email.toLowerCase(),
          },
        });

        return {
          ...token,
          id: u.id,
          randomKey: u.randomKey,
        };
      }
      return token;
    },
  },
};

export default NextAuth(authOptions);
