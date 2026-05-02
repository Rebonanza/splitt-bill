import { type ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
}

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 pb-24 pt-6 sm:px-6">
      {children}
    </main>
  );
}
