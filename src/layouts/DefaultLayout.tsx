import React from 'react';
import { Header } from '../components/Header';

interface DefaultLayoutProps {
  children: React.ReactNode;
  cartVisible?: boolean;
  title?: string;
  backButtonText?: string;
  backButtonPath?: string;
}

export function DefaultLayout({
  children,
  cartVisible = true,
  title,
  backButtonText,
  backButtonPath
}: DefaultLayoutProps) {

  return (
    <div className="min-h-screen bg-gray-100">
      <Header
        cartVisible={cartVisible}
        title={title}
        backButtonText={backButtonText}
        backButtonPath={backButtonPath}
      />

      {children}
    </div>
  );
}
