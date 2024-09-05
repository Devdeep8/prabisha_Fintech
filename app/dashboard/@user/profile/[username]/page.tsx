'use client'
import BreadCrumb from '@/components/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';
import CreateProfileOne from '@/components/form/user-profile-stepper/create-profile';
import { fetchUserData } from '@/utils/fetchdata';
import { useState , useEffect } from 'react';

export default function Page({ params }: any) {
  // Define initial state for user data
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const breadcrumbItems = [{ title: ` Profile `, link: `/dashboard/profile/${params.username}` },
  { title: ` ${params.username} `, link: `/dashboard/profile/${params.username}` }
  ];
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const username = params.username;
        if (username) {
          const userData = await fetchUserData(username);
          if (userData) {
            setUserData(userData);
          }
        } 
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.username]);

  return (
    <ScrollArea className="h-full">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <BreadCrumb items={breadcrumbItems} />
        {loading ? (
          <p>Loading...</p>
        ) : (
          <CreateProfileOne  initialData={userData} params={params} />
        )}
      </div>
    </ScrollArea>
  );
}
