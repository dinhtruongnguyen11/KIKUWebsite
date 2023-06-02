import Head from 'next/head';

import { LoginForm } from '@/components/Form/LoginForm';

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Sign in</title>
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
        className="h-screen w-screen  flex bg-[#F3F4F6] 
      justify-center items-center p-3 sm:px-0"
      >
        <LoginForm />
      </main>
    </>
  );
}
