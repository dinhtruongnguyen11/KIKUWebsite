import React from 'react';

import Link from 'next/link';

const UpdatePlusButton = () => {
  return (
    <div>
      <Link
        href="plan/pricing"
        className="w-full mb-3 bg-gradient-to-r from-[#FF4500] to-[#F11137] 
      flex  cursor-pointer select-none items-center gap-3 
      rounded-xl py-4 px-3 text-[13px] leading-3 text-white font-semibold
      transition-colors duration-200 hover:bg-gray-500/10"
      >
        Upgrade to Plus
      </Link>
    </div>
  );
};

export default UpdatePlusButton;
