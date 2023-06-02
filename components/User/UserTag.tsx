import { IconLogout, IconSettings } from '@tabler/icons-react';
import { signIn, signOut, useSession } from 'next-auth/react';
import React from 'react';

const UserTagSidebar = () => {
  const { data: session } = useSession();
  return (
    <>
      {session && session.user && (
        <>
          <div className="flex flex-col py-5 border-b  border-white/20">
            <div className="flex justify-center gap-3 items-center">
              <button className="rounded-full hover:shadow-md p-3">
                <IconSettings size={30} />
              </button>
              <img
                className="rounded-full h-20 w-20 border p-1 border-white/20"
                src={session.user.image || '/images/userIcon.png'}
              />
              <button
                className="rounded-full hover:shadow-md p-3"
                onClick={() => signOut()}
              >
                <IconLogout size={30} />
              </button>
            </div>
            <span className="text-lg text-white text-center mt-5">
              {session?.user?.name}
            </span>
          </div>
        </>
      )}
    </>
  );
};

export default UserTagSidebar;
