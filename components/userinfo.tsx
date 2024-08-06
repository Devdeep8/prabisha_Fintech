// app/dashboard/@user/profile/[username]/page.tsx
'use client'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { UserInfo } from '@/types';

const UserProfilePage = ( username : any) => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserInfo | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/user?username=${username}`);
        if (!response.ok) {
          throw new Error('User not found');
        }
        const userData = await response.json();
        setUserData(userData);
      } catch (error: any) {
        setError(error.message || 'Error fetching user data');
      }
    };

    if (username) {
      fetchUserData();
    }
  }, [username]);

  if (error) return <div>{error}</div>;
  if (!userData) return <div>Loading...</div>; // Handle loading state

  return (
    <div>
      <h1>User Profile: {userData.username}</h1>
      <p>Name: {userData.name}</p>
      <p>Email: {userData.email}</p>
      {/* Display other user information as needed */}
    </div>
  );
};

export default UserProfilePage;
