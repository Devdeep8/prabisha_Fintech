// DashboardLayout.tsx
'use client'
import { useEffect, useState } from 'react';
import { checkUserRole } from '@/lib/auth';

export default function DashboardLayout({
  children,
  admin,
  user,
}: {
  children: React.ReactNode;
  admin: React.ReactNode;
  user: React.ReactNode;
}) {
  const [role, setRole] = useState<'admin' | 'user' | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const fetchedRole = await checkUserRole();
        setRole(fetchedRole);
      } catch (error) {
        
        console.error('Error fetching user role:', error);
        // Handle error, e.g., redirect to login page or show an error message
      }
    };

    fetchUserRole();
  }, []);

  if (role === null) {
    // While role is being fetched, you can render a loading indicator
    return <div>Loading...</div>;
  }

  if (!role) {
    // Handle case where role is empty or invalid
    return null;
  }

  return <>{role === 'admin' ? admin : user}</>;
}
