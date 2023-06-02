import { IconArrowBack, IconChevronLeft } from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/router';

export default function NewPassword() {
  const { data: session } = useSession();
  if (session) {
    signOut();
  }
  const { push } = useRouter();

  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const input_style =
    'form-control text-center block w-full px-4 py-3 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none';

  const router = useRouter();

  const submit = async () => {
    var code = router.query.code;

    if (password !== rePassword) {
      alert('The re-entered password is incorrect.');
      return;
    }

    if (password === '') {
      alert('Please enter a password.');
      return;
    }

    if (password.length < 6) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    var body = { code, password };
    const res = await fetch('/api/newPassword', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      res.json().then((value) => {
        alert(value.message);
      });
    } else {
      res.json().then((value) => {
        alert(value.message);
      });
      push('/authenticate/login');
    }
  };
  return (
    <>
      <Head>
        <title>Reset password</title>
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
        <div className="flex flex-col w-96 bg-white px-6 py-7 shadow rounded-lg">
          <span className="text-center w-full font-bold text-xl mb-5">
            Reset your password
          </span>

          <span
            className="text-center text-gray-700 w-full 
            text-sm font mb-5"
          >
            Please enter a new password below.
          </span>

          <div className="flex mb-5 gap-1.5">
            <input
              required
              type="password"
              name="password"
              placeholder="New Password"
              className={`${input_style}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="flex mb-5 gap-1.5">
            <input
              required
              type="password"
              name="re-password"
              placeholder="Re-enter new Password"
              className={`${input_style}`}
              value={rePassword}
              onChange={(e) => {
                setRePassword(e.target.value);
              }}
            />
          </div>

          <button
            type="button"
            onClick={submit}
            className="inline-block px-7 py-3 hover:bg-blue-700 bg-blue-600 
    text-white font-medium text-sm leading-snug  rounded mb-8
    shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none 
    focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 
    ease-in-out w-full"
          >
            Change
          </button>
        </div>
      </main>
    </>
  );
}
