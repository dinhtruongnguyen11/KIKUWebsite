import React from 'react';

import Image from 'next/image';

const pricing = () => {
  return (
    <div
      className="flex bg-white h-screen p-7 antialiased font-thin
      
    "
    >
      <div
        className="w-2/5 flex flex-col bg-[#EBF2FC] 
      rounded-xl text-xl gap-10 justify-center items-center px-10 pb-72
      tracking-wide
      "
      >
        <div className="flex justify-center items-center gap-2 mb-5">
          <Image src="/kikulg2.ico" alt="" width={50} height={50} />
          <span className="text-3xl font-semibold">Kiku</span>
        </div>
        <span className="text-3xl">
          Unlock the power{' '}
          <span className="font-bold">of Artificial Intelligence</span>
        </span>
        <span>From blog posts to image generation, we have you covered!</span>{' '}
        <span>
          Our pricing plans are designed to offer a range of options, So you can
          find the perfect fit for your personal or professional requirements.
        </span>
      </div>
      <div className="w-3/5 flex flex-col items-center">
        <span>Plans and Pricing</span>
        <span>Get started for free! No credit card required</span>
        <div className="flex">
          <div className="bg-[#EBF2FC]">
            Access to basic features Save your favorite prompts Limited usage
          </div>
          <div className="bg-[#2AAAE3]">
            All features in Basic AI Role selector Image Generation Unlimited
            usage Priority Support Advanced features
          </div>
        </div>
      </div>
    </div>
  );
};

export default pricing;
