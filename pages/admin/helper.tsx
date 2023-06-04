import React from 'react';

import Head from 'next/head';

export const helper = () => {
  const clearUser = async () => {
    const res = await fetch('/api/helper/clearUser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    res.json().then((value) => {
      alert(value.message);
    });
  };
  return (
    <div>
      <Head>
        <title>Helper</title>
        <link rel="icon" href="/kikulg2.ico" />
      </Head>
      <div
        className="flex h-screen w-screen justify-center 
      items-center  bg-[#F3F4F6]"
      >
        <div
          className="flex flex-col w-96 bg-white px-6 py-7 
        shadow rounded-lg"
        >
          <span className="text-center w-full font-bold text-xl mb-5">
            Settings
          </span>
          <button
            type="button"
            className="flex items-center justify-center px-7 py-3 hover:bg-blue-700 bg-blue-600 
    text-white font-medium text-sm leading-snug  rounded mb-8 h-11
    shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none 
    focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 
    ease-in-out w-full"
            onClick={clearUser}
          >
            Reset user data
          </button>
        </div>
      </div>
    </div>
  );
};

export default helper;
