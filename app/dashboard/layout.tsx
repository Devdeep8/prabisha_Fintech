import { checkUserRole } from '@/lib/auth';

export default async function DashboardLayout({
  children,
  admin,
  user,
}: {
  children: React.ReactNode,
  admin: React.ReactNode,
  user: React.ReactNode,
}) {
  const role = await checkUserRole();

  return (
    <>
   
      {role === 'admin' ? admin : user}

    
    </>
  );
}
