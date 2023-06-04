import { signOut, useSession } from 'next-auth/react';
import { useEffect } from 'react';

import Head from 'next/head';

import { RegisterForm } from '@/components/Form/RegisterForm';

export default function RegisterPage() {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      signOut();
    }
  }, []);
  return (
    <>
      <Head>
        <title>Sign up</title>
        <meta
          name="description"
          content="Empowering your growth through continous AI learning."
        />

        <meta
          name="viewport"
          content="width=device-width, initial-scale = 1,user-scalable=no"
        />
        <meta name="theme-color" content="#F3F4F6"></meta>

        <link rel="icon" href="/kikulg2.ico" />
      </Head>
      <main
        className="h-screen w-screen flex bg-[#F3F4F6] 
      justify-center items-center px-3 sm:px-0"
      >
        <RegisterForm />
      </main>
    </>
  );
}
