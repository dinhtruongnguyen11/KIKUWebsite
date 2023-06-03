import { IconArrowBack, IconChevronLeft } from '@tabler/icons-react';
import { signOut, useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import LoadingIcons from 'react-loading-icons';

import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function NewPassword() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { push } = useRouter();

  const [password, setPassword] = useState('');
  const [rePassword, setRePassword] = useState('');
  const input_style =
    'form-control text-center block w-full px-4 py-3 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none';

  const router = useRouter();
  const emailInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
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

    var code = router.query.code;

    if (password !== rePassword) {
      setError('The re-entered password is incorrect.');
      setLoading(false);
      return;
    }

    if (password === '') {
      setError('Please enter a password.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
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
        setError(value.message);
        setLoading(false);
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
          <div className="flex w-full items-center justify-center mb-5">
            <Image src="/kikulg.ico" alt="" width={60} height={60} />
          </div>
          <span className="text-center w-full font-bold text-xl mb-5">
            Reset your password
          </span>

          <span
            className="text-center text-gray-700 w-full 
            text-sm font mb-5"
          >
            Please enter a new password below.
          </span>

          {error && (
            <p className="text-center font-semibold text-sm text-red-300 mb-5 rounded">
              {error}
            </p>
          )}

          <div className="flex mb-5 gap-1.5">
            <input
              required
              type="password"
              name="password"
              placeholder="New password"
              className={`${input_style}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              ref={emailInputRef}
            />
          </div>
          <div className="flex mb-5 gap-1.5">
            <input
              required
              type="password"
              name="re-password"
              placeholder="Re-enter new password"
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
              'Update password'
            )}
          </button>
        </div>
      </main>
    </>
  );
}
