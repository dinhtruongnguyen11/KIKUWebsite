import { signOut, useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import LoadingIcons from 'react-loading-icons';

import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { authOptions } from '../api/auth/[...nextauth]';

export default function LoginPage() {
  const { data: session } = useSession();
  const input_style = `form-control block w-full px-1 py-2 
    text-2xl font-normal text-gray-700 text-center
    bg-white bg-clip-padding border border-solid 
    border-gray-300 rounded transition 
    ease-in-out m-0 focus:text-gray-700 
    focus:bg-white focus:border-blue-600 
    focus:outline-none`;

  const { push } = useRouter();
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<HTMLInputElement>>([]);

  const handleChange = (index: number, value: string) => {
    const newData = [...data];
    newData[index] = value;
    setData(newData);

    if (value.length === 1 && index < data.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  useEffect(() => {
    if (inputRefs.current.length > 0) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    data.forEach((item, index) => {
      const inputElement = document.getElementById(
        `input-${index}`,
      ) as HTMLInputElement;
      if (inputElement) {
        inputElement.value = item;
      }
    });
  }, [data]);

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

  const updateValue = (value: string) => {
    const arr = value.split('').slice(0, 6);
    setData(arr);
  };

  const handlePaste = async (event: any) => {
    const clipboardData = event.clipboardData || window.Clipboard;
    const text = clipboardData.getData('text');
    updateValue(text);
  };

  const handleKeyDown = async (event: any) => {
    if (event.ctrlKey && event.key === 'v') {
      event.preventDefault();
      try {
        const text = await navigator.clipboard.readText();
        updateValue(text);
      } catch (error) {}
    }
  };
  const handleFocus = (index: number) => {
    if (inputRefs.current[index]) {
      inputRefs.current[index].select();
    }
  };

  const submit = async () => {
    setLoading(true);

    var code = data.join('');
    var email = session?.user?.email;

    if (code.length < 6) {
      alert('Please input your verification code!');
      setLoading(false);
      return;
    }

    var body = {
      code,
      email,
    };

    const res = await fetch('/api/verification', {
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
      setLoading(false);
    } else {
      push('/');
    }
  };

  return (
    <>
      <Head>
        <title>Verification</title>
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
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
      >
        <div className="flex flex-col w-96 bg-white px-6 py-7 shadow rounded-lg">
          <div className="flex w-full items-center justify-center mb-5">
            <Image src="/kikulg.ico" alt="" width={60} height={60} />
          </div>
          <span className="text-center w-full font-bold text-xl mb-5">
            Enter your code
          </span>

          <span
            className="text-center text-gray-700 w-full 
          text-sm font-light mb-5"
          >
            Enter the code sent to your email to complete the login process.
          </span>

          <div className="flex mb-5 gap-1.5">
            {data.map((item, index) => (
              <input
                key={index}
                type="tel"
                maxLength={1}
                pattern="[0-9]"
                className={`${input_style}`}
                id={`input-${index}`}
                onChange={(e) => handleChange(index, e.target.value)}
                onFocus={() => handleFocus(index)}
                ref={(ref) =>
                  (inputRefs.current[index] = ref as HTMLInputElement)
                }
              />
            ))}
          </div>

          <button
            type="button"
            onClick={submit}
            className="flex items-center justify-center px-7 py-3 hover:bg-blue-700 bg-blue-600 
        text-white font-medium text-sm leading-snug  rounded h-11
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
      </main>
    </>
  );
}

// export const getServerSideProps: GetServerSideProps = async (
//   context: GetServerSidePropsContext,
// ) => {
//   const session = await getServerSession(context.req, context.res, authOptions);
//   if (!session) {
//     return {
//       redirect: {
//         permanent: false,
//         destination: '/authenticate/login',
//       },
//       props: {},
//     };
//   }
//   return {
//     props: {},
//   };
// };
