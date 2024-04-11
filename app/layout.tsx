import React, { ReactNode } from 'react';
import Navbar from './ClientNavbar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  if (typeof document === 'undefined') {
    // Server-side rendering
    return (
      <html lang="en">
        <body>
          <Navbar /> 
          {children}
        </body>
      </html>
    );
  } else {
    // Client-side rendering
    return (
      <>
        <Navbar /> 
        {children}
      </>
    );
  }
};

export default Layout;
