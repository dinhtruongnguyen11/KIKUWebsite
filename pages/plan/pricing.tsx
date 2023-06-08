import { IconCircleCheckFilled } from '@tabler/icons-react';
import React from 'react';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

const pricing = () => {
  return (
    <>
      <Head>
        <title>Plan</title>
        <meta
          name="description"
          content="Empowering your growth through continous AI learning."
        />

        <meta
          name="viewport"
          content="width=device-width, initial-scale = 1,user-scalable=no"
        />
        <meta name="theme-color" content="#fff"></meta>

        <link rel="icon" href="/kikulg2.ico" />
      </Head>
      <div
        className="flex flex-col lg:flex-row bg-white lg:p-7 
    antialiased font-normal p-3 py-10 h-full lg:h-screen"
      >
        <div className="lg:w-1/3 w-full flex flex-col bg-[#EBF2FC] rounded-xl text-xl gap-10 justify-center items-center lg:pb-72 pb-10 lg:pt-0 pt-10 lg:px-10 px-5 tracking-wide">
          <div className="flex justify-center items-center gap-2 lg:mb-10 mb-2">
            <Image src="/kikulg.ico" alt="" width={75} height={75} />
          </div>
          <span className="w-full lg:text-[30px] text-2xl flex flex-col items-start">
            Unlock the power
            <span className="font-bold">of Artificial Intelligence</span>
          </span>
          <div className="flex flex-col gap-5">
            <span>
              From blog posts to image generation, we have you covered!
            </span>
            <span>
              Our pricing plans are designed to offer a range of options, so you
              can find the perfect fit for your personal or professional
              requirements.
            </span>
          </div>
        </div>
        <div className="lg:w-2/3 w-full flex flex-col items-center lg:mt-24 mt-10 bg-white">
          <span className="text-[30px] font-bold mb-5">Plans and Pricing</span>
          <span className="text-gray-700 text-lg lg:mb-20 mb-10 text-center">
            Get started for free! No credit card required
          </span>
          <div className="flex w-full gap-7  lg:pl-7 lg:flex-row flex-col">
            <div className="bg-[#EBF2FC] flex flex-col lg:w-1/2 w-full p-7 rounded-lg h-fit">
              <div
                className="flex mb-10 gap-2 border-b border-gray-600 
            pb-3 "
              >
                <Image
                  src="/images/free-plan-icon.svg"
                  width={70}
                  height={70}
                  alt=""
                />
                <div className="flex flex-col pt-3">
                  <span>Basic</span>
                  <span className="text-[30px] font-bold">Free</span>
                </div>
              </div>
              <div className="flex flex-col gap-3 mb-10">
                <span className="flex justify-between">
                  Access to basic features <IconCircleCheckFilled />
                </span>
                <span className="flex justify-between">
                  Save your favorite prompts <IconCircleCheckFilled />
                </span>
                <span className="flex justify-between">
                  Limited usage <IconCircleCheckFilled />
                </span>
              </div>
              <Link
                href="/"
                className="bg-[#2AAAE3] py-2 rounded-lg text-white 
                hover:shadow-lg hover:outline-none hover:ring-0
                flex justify-center"
              >
                Get Started
              </Link>
            </div>
            <div className="bg-[#2AAAE3] flex flex-col lg:w-1/2 w-full p-7 text-white rounded-lg justify-center">
              <div className="flex mb-10 gap-2 border-b border-white pb-3">
                <Image
                  src="/images/pro-plan-icon.svg"
                  width={70}
                  height={70}
                  alt=""
                />
                <div className="flex flex-col  pt-3">
                  <span>Pro</span>
                  <div className="text-[30px] font-bold">
                    <span>$15</span>
                    <span className="text-sm">/month</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 mb-10">
                <span className="flex justify-between">
                  All features in Basic <IconCircleCheckFilled />
                </span>
                <span className="flex justify-between">
                  AI Role selector <IconCircleCheckFilled />
                </span>
                <span className="flex justify-between">
                  <div className="flex gap-2">
                    Image Generation
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.813 15.904L9 18.75L8.187 15.904C7.97687 15.1689 7.5829 14.4994 7.04226 13.9587C6.50162 13.4181 5.83214 13.0241 5.097 12.814L2.25 12L5.096 11.187C5.83114 10.9769 6.50062 10.5829 7.04126 10.0423C7.5819 9.50162 7.97587 8.83214 8.186 8.097L9 5.25L9.813 8.096C10.0231 8.83114 10.4171 9.50062 10.9577 10.0413C11.4984 10.5819 12.1679 10.9759 12.903 11.186L15.75 12L12.904 12.813C12.1689 13.0231 11.4994 13.4171 10.9587 13.9577C10.4181 14.4984 10.0241 15.1679 9.814 15.903L9.813 15.904ZM18.259 8.715L18 9.75L17.741 8.715C17.5927 8.12159 17.286 7.57962 16.8536 7.14703C16.4212 6.71444 15.8794 6.40749 15.286 6.259L14.25 6L15.286 5.741C15.8794 5.59251 16.4212 5.28556 16.8536 4.85297C17.286 4.42038 17.5927 3.87841 17.741 3.285L18 2.25L18.259 3.285C18.4073 3.87854 18.7142 4.42059 19.1468 4.85319C19.5794 5.28579 20.1215 5.59267 20.715 5.741L21.75 6L20.715 6.259C20.1215 6.40733 19.5794 6.71421 19.1468 7.14681C18.7142 7.57941 18.4073 8.12147 18.259 8.715ZM16.894 20.567L16.5 21.75L16.106 20.567C15.9955 20.2356 15.8094 19.9345 15.5625 19.6875C15.3155 19.4406 15.0144 19.2545 14.683 19.144L13.5 18.75L14.683 18.356C15.0144 18.2455 15.3155 18.0594 15.5625 17.8125C15.8094 17.5655 15.9955 17.2644 16.106 16.933L16.5 15.75L16.894 16.933C17.0045 17.2644 17.1906 17.5655 17.4375 17.8125C17.6845 18.0594 17.9856 18.2455 18.317 18.356L19.5 18.75L18.317 19.144C17.9856 19.2545 17.6845 19.4406 17.4375 19.6875C17.1906 19.9345 17.0045 20.2356 16.894 20.567Z"
                        stroke="white"
                        strokeWidth="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                  <IconCircleCheckFilled />
                </span>
                <span className="flex justify-between">
                  Unlimited usage <IconCircleCheckFilled />
                </span>
                <span className="flex justify-between">
                  Priority Support <IconCircleCheckFilled />
                </span>
                <span className="flex justify-between">
                  Advanced features <IconCircleCheckFilled />
                </span>
              </div>
              <button
                type="button"
                className="text-[#2AAAE3] py-2 rounded-lg bg-white hover:shadow-lg hover:outline-none hover:ring-0"
              >
                Choose Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default pricing;
