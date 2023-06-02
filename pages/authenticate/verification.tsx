import { useSession } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';

import Head from 'next/head';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const input_style = `form-control block w-full px-1 py-2 
    text-2xl font-normal text-gray-700 text-center
    bg-white bg-clip-padding border border-solid 
    border-gray-300 rounded transition 
    ease-in-out m-0 focus:text-gray-700 
    focus:bg-white focus:border-blue-600 
    focus:outline-none`;

  const { data: session } = useSession();
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);

  var error = '';

  const [data, setData] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<Array<HTMLInputElement>>([]);

  const handleChange = (index: number, value: string) => {
    const newData = [...data];
    newData[index] = value;
    setData(newData);
  };

  useEffect(() => {
    if (inputRefs.current.length > 0) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    // Cập nhật giá trị của các input khi biến 'data' thay đổi
    data.forEach((item, index) => {
      const inputElement = document.getElementById(
        `input-${index}`,
      ) as HTMLInputElement;
      if (inputElement) {
        inputElement.value = item;
      }
    });
  }, [data]);

  const updateValue = (value: string) => {
    const arr = value.split('').slice(0, 6);
    setData(arr);
  };

  const handlePaste = async (event: any) => {
    const clipboardData = event.clipboardData || window.Clipboard;
    const text = clipboardData.getData('text');
    // Xử lý dữ liệu từ clipboard ở đây
    updateValue(text);
  };

  const handleKeyDown = async (event: any) => {
    if (event.ctrlKey && event.key === 'v') {
      event.preventDefault();
      try {
        const text = await navigator.clipboard.readText();
        // Xử lý dữ liệu từ clipboard ở đây
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
            className="inline-block px-7 py-3 hover:bg-blue-700 bg-blue-600 
        text-white font-medium text-sm leading-snug  rounded 
        shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none 
        focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 
        ease-in-out w-full"
            disabled={loading}
          >
            {loading ? '...' : 'Submit'}
          </button>
        </div>
      </main>
    </>
  );
}
