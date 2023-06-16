import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { IconCircleCheckFilled } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Pricing = () => {
  const [showProPlan, setShowProPlan] = useState(true);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [email, setEmail] = useState('');
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.user?.email) setEmail(session?.user?.email);
  }, [session]);

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
        className="flex flex-col lg:flex-row bg-white  
    antialiased font-normal  sm:py-5 px-3 lg:px-5 min-h-screen h-full"
      >
        <div
          className="lg:w-1/3 w-full  flex flex-col bg-[#EBF2FC] rounded-xl text-xl 
         justify-center items-center py-10  lg:px-10 px-5 
         "
        >
          <div className="flex justify-center items-center gap-2 lg:mb-10 mb-2">
            <Image src="/kikulg.ico" alt="" width={75} height={75} />
          </div>
          <span className="w-full flex flex-col items-start sm:mb-5 mb-3">
            <span className="text-2xl sm:mb-1">Unlock the power of Kiku:</span>
            <span className="font-black text-2xl tracking-wide">
              Your new Smart Assistant
            </span>
          </span>
          <div className="flex flex-col gap-5 text-lg">
            <span className="sm:mb-1">
              From generating stunning visuals to providing instant answers, an
              smart assistant saves you time and offers personalized support.
            </span>
            <span className="font-semibold">
              Choose the plan that suits you best and experience the power of AI
              in transforming the way you work and live.
            </span>
          </div>
          <div className="flex justify-center items-center">
            <Image src="/images/p1.png" alt="" width={244} height={277} />
          </div>
        </div>
        <div className="lg:w-2/3 w-full flex flex-col items-center lg:mt-3 mt-10 bg-white">
          <span className="text-[30px] font-bold mb-5">Plans and Pricing</span>
          <span className="text-gray-700 text-lg lg:mb-15 mb-10 text-center">
            Get started for free! No credit card required
          </span>
          <div className="flex w-full gap-7  lg:pl-7 lg:flex-row flex-col">
            <div className="bg-[#EBF2FC] flex flex-col lg:w-1/2 w-full p-7 rounded-lg h-fit">
              <div
                className="flex mb-10 gap-2 border-b border-gray-600 
            pb-3 "
              >
                <div
                  className="bg-white rounded-full flex items-center justify-center
                    w-20 h-20 p-2"
                >
                  <Image
                    src="/images/free-icon.png"
                    width={80}
                    height={80}
                    alt=""
                  />
                </div>
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
                  Professional AI Role selector <IconCircleCheckFilled />
                </span>
                <span className="flex justify-between">
                  2000 words and 5 images per month <IconCircleCheckFilled />
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
            <div
              className={`${
                showProPlan && !paymentComplete
                  ? 'bg-[#2AAAE3]'
                  : 'bg-white border-4'
              } flex flex-col lg:w-1/2 w-full p-7 text-white rounded-lg justify-center`}
            >
              {showProPlan && !paymentComplete && (
                <>
                  <div className="flex mb-10 gap-5 border-b border-white pb-3 relative">
                    <div
                      className="absolute -top-10 left-1/2 transform -translate-x-1/2
                    bg-[#FF4500] rounded-lg w-56 py-1 flex items-center justify-center
                    shadow-md"
                    >
                      <span>Most Popular</span>
                    </div>
                    <div className="bg-white rounded-full flex items-center justify-center w-20 h-20">
                      <Image
                        src="/images/pro-icon.png"
                        width={80}
                        height={80}
                        alt=""
                      />
                    </div>
                    <div className="flex flex-col  pt-3">
                      <span>Plus</span>
                      <div className="text-[30px] font-bold">
                        <span>$15</span>
                        <span className="text-sm">/month</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 mb-10">
                    <span className="flex justify-between">
                      <span>
                        All features in <span className="font-bold">Basic</span>
                      </span>{' '}
                      <IconCircleCheckFilled />
                    </span>
                    <span className="flex justify-between">
                      Unlimited words and answers <IconCircleCheckFilled />
                    </span>
                    <span className="flex justify-between">
                      <div className="flex gap-2">
                        Unlimited HD Image Generation
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
                      Priority Support <IconCircleCheckFilled />
                    </span>
                    <span className="flex justify-between">
                      Access to exclusive features <IconCircleCheckFilled />
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowProPlan(false);
                    }}
                    className="text-[#2AAAE3] py-2 rounded-lg bg-white hover:shadow-lg hover:outline-none hover:ring-0"
                  >
                    Choose Plan
                  </button>
                </>
              )}

              {paymentComplete && (
                <div className="text-gray-800 flex flex-col items-center">
                  <Image
                    className="mb-3"
                    src="/images/payment-successful.jpg"
                    alt=""
                    width={200}
                    height={200}
                  />
                  <span className="font-bold mb-1 ">Payment successful! </span>
                  <span className="text-sm">
                    You will be redirected to the chat now ...
                  </span>
                </div>
              )}

              <div
                className={`${
                  showProPlan || paymentComplete ? 'hidden' : ''
                } flex flex-col`}
              >
                <PayPalScriptProvider
                  options={{
                    clientId:
                      'AWcEIw7plXeOimWnp_hSBT8kUfKm-JTa8cMnqYqbbSVApYVs8cjfehz6dALzZGQW19oZNdhwZu_hPB4R',
                  }}
                >
                  <PayPalButtons
                    style={{ layout: 'vertical', shape: 'pill' }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: '24.99',
                            },
                          },
                        ],
                      });
                    }}
                    onApprove={async (data, actions) => {
                      const details = await actions.order?.capture();
                      const orderID = details?.id;
                      const status = details?.status;
                      if (status == 'COMPLETED') {
                        const body = {
                          orderID,
                          status,
                          email,
                        };
                        console.log(body);
                        const res = await fetch('/api/paypal/captureOrder', {
                          method: 'POST',
                          body: JSON.stringify(body),
                          headers: {
                            'Content-Type': 'application/json',
                          },
                        });
                        if (!res.ok) {
                          alert('Error when update user info! Try again.');
                          return;
                        }
                        setPaymentComplete(true);
                        setTimeout(() => {
                          router.push('/');
                        }, 4000);
                      }
                    }}
                  />
                </PayPalScriptProvider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pricing;
