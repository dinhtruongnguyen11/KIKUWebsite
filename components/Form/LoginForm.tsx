import { signIn } from 'next-auth/react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import LoadingIcons from 'react-loading-icons';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export const LoginForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  const emailInputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);

      const res = await signIn('credentials', {
        redirect: false,
        email: formValues.email,
        password: formValues.password,
        callbackUrl,
      });

      if (!res?.error) {
        router.push(callbackUrl);
      } else {
        setError('Invalid email or password');
        setLoading(false);
      }
    } catch (error: any) {
      setLoading(false);
      setError(error);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const input_style =
    'form-control block w-full px-4 py-3 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none';

  useEffect(() => {
    const listener = (event: any) => {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        event.preventDefault();
        buttonRef.current?.click();
      }
    };
    document.addEventListener('keydown', listener);
    return () => {
      document.removeEventListener('keydown', listener);
    };
  }, []);

  return (
    <form
      onSubmit={onSubmit}
      className="flex  flex-col w-96 bg-white px-6 py-7 shadow rounded-lg"
    >
      <div className="flex w-full items-center justify-center mb-5">
        <Image src="/kikulg.ico" alt="" width={60} height={60} />
      </div>
      <span className="text-center w-full font-bold text-2xl mb-2">
        Sign in
      </span>
      <span className="text-center w-full text-xs  mb-4">
        Don&apos;t have an account yet?{' '}
        <Link
          href="/authenticate/register"
          className="text-blue-600 font-semibold"
        >
          Sign up here
        </Link>
      </span>
      <a
        className="px-7 py-2 text-gray-700 font-medium text-sm leading-snug 
         rounded border hover:bg-gray-100 h-11
        focus:outline-none focus:ring-0 transition 
        duration-150 ease-in-out w-full flex justify-center items-center mb-3"
        onClick={() => signIn('google', { callbackUrl })}
        role="button"
      >
        <img className="pr-2 h-5" src="/images/google.svg" alt="" />
        Sign in with Google
      </a>

      <div
        className="mb-3 flex items-center text-xs text-gray-400 uppercase 
      before:flex-[1_1_0%] before:border-t before:border-gray-200 before:mr-6 
      after:flex-[1_1_0%] after:border-t after:border-gray-200 after:ml-6 
      dark:text-gray-500 dark:before:border-gray-600 dark:after:border-gray-600"
      >
        Or
      </div>

      {error && (
        <p className="text-center font-semibold text-sm text-red-300 mb-5 rounded">
          {error}
        </p>
      )}
      <div className="mb-6">
        <input
          required
          type="email"
          name="email"
          value={formValues.email}
          onChange={handleChange}
          placeholder="Email address"
          className={`${input_style}`}
          ref={emailInputRef}
        />
      </div>
      <div className="mb-2">
        <input
          required
          type="password"
          name="password"
          value={formValues.password}
          onChange={handleChange}
          placeholder="Password"
          className={`${input_style}`}
        />
      </div>
      <div className="mb-5 flex justify-end">
        <span className="text-xs">
          <Link
            href="/authenticate/resetPassword"
            className="text-blue-600 font-semibold"
          >
            Forgot password
          </Link>
        </span>
      </div>
      <button
        type="submit"
        className="flex items-center justify-center px-7 py-3 hover:bg-blue-700 bg-blue-600 
        text-white font-medium text-sm leading-snug  rounded 
        shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none 
        focus:ring-0 active:bg-blue-800 active:shadow-lg transition 
        duration-150 h-11
        ease-in-out w-full"
        disabled={loading}
        ref={buttonRef}
      >
        {loading ? (
          <LoadingIcons.Oval height={25} strokeWidth={5} />
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  );
};
