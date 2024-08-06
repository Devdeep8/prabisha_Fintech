// In your layout or any component where you want to use the side navbar
import Sidebar from '@/components/sidebar/sidebar';
import Header from '@/components/header';
import React from 'react';
const Layout: React.FC = ({ children  } : any) => {
  return (
  <>
   <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
      <main className="flex-grow mt-10">{children}</main>
      </div>
      </div>
  </>
  );
};

export default Layout;
 