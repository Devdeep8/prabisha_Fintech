// pages/dashboard.tsx
'use client'
import React, { useEffect, useState } from 'react';
import { verifyTokenAndReturnCookies } from '@/lib/cookie';
import { JWTPayload } from 'jose';
import BreadCrumb from '@/components/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';

const UserDashboard: React.FC = () => {
  const [userInfo, setUserInfo] = useState<JWTPayload | null>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userData = await verifyTokenAndReturnCookies();
      if (userData) {
        const userInfoData: JWTPayload = userData  as JWTPayload;
        setUserInfo(userInfoData);
      } else {
        setUserInfo(null);
      }
    };

    fetchUserInfo();
  }, []);
  // console.log(userInfo);

  if (!userInfo) {
    return <div>Loading...</div>; // or handle loading state
  }

  return (
   <>
   
   <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={[]} />
       
      </div>
    </ScrollArea>
   </>
  );
};

export default UserDashboard;
