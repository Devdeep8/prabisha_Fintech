// In your layout or any component where you want to use the side navbar
import React from 'react';
const Layout: React.FC = ({ children  } : any) => {
  return (
  <>
      <main className="flex-grow ">{children}</main>
   
  </>
  );
};

export default Layout;
