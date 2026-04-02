import React, { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  user?: any;
  hideHeader?: boolean;
  hideFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  user,
  hideHeader = false,
  hideFooter = false,
}) => {
  return (
    <div className="flex flex-col min-h-screen">
      {!hideHeader && <Header user={user} />}
      <main className="flex-grow">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  );
};
