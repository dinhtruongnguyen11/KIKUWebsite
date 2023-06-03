import { IconArrowBack, IconChevronLeft } from '@tabler/icons-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import LoadingIcons from 'react-loading-icons';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const input_style =
    'form-control text-center block w-full px-4 py-3 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none';

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [showInput, setShowInput] = useState(true);
  const [message, setMessage] = useState(
    `Enter your email and we'll send you a link to reset your password.`,
  );

  useEffect(() => {
    if (session) {
      signOut();
    }
  }, []);

  useEffect(() => {
    const listener = (event: any) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        event.preventDefault();
        submit();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, []);

  const submit = async () => {
    setLoading(true);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.trim() === '') {
      setError('Please enter your email address.');
      setLoading(false);
      return;
    }

    if (!emailRegex.test(email)) {
      setError('Invalid email address.');
      setLoading(false);
      return;
    }

    const res = await fetch('/api/resetPassword', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      res.json().then((value) => {
        setLoading(false);
        const info = value.message ? value.message : 'Reset password failed!';
        setError(info);
      });
    } else {
      setShowInput(false);
      setMessage(
        `Password reset confirmation message sent. Please check your email and follow the instructions to reset your password.`,
      );
    }
  };
  return (
    <>
      <Head>
        <title>Forgot password</title>
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
          <div className="flex w-full items-center justify-center mb-5">
            <Image src="/kikulg.ico" alt="" width={60} height={60} />
          </div>
          <span className="text-center w-full font-bold text-xl mb-5">
            Forgot password
          </span>

          <span
            className="text-center text-gray-700 w-full 
            text-sm font mb-5"
          >
            {message}
          </span>

          <div className={`${showInput ? 'block' : 'hidden'}`}>
            {error && (
              <p className="text-center font-semibold text-sm text-red-300 mb-5 rounded">
                {error}
              </p>
            )}
            <div className="flex mb-5 gap-1.5">
              <input
                required
                type="email"
                name="email"
                placeholder="Email address"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                value={email}
                className={`${input_style}`}
                ref={(input) => input && input.focus()}
              />
            </div>

            <button
              type="button"
              onClick={submit}
              className="flex items-center justify-center px-7 py-3 hover:bg-blue-700 bg-blue-600 
    text-white font-medium text-sm leading-snug  rounded mb-8 h-11
    shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none 
    focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 
    ease-in-out w-full"
              disabled={loading}
            >
              {loading ? (
                <LoadingIcons.Oval height={25} strokeWidth={5} />
              ) : (
                'Submit'
              )}
            </button>
          </div>

          <Link
            className="text-center text-gray-700 
          w-full text-sm font-li  flex justify-center items-center
          gap-1 hover:underline"
            href="/authenticate/login"
          >
            <IconChevronLeft height={20} width={20} className="mb-[1px]" />
            Back to Login
          </Link>
        </div>
      </main>
    </>
  );
}
