import * as React from 'react';
import type { Viewport } from 'next';

import '@/styles/global.css';

import { UserProvider } from '@/contexts/user-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { ThirdwebProvider } from "thirdweb/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

const activeChain = "mumbai"

export default function Layout({ children }: LayoutProps): React.JSX.Element {

  const thirdWebProviderProps = {
    activeChain: "ethereum",
    clientId: process.env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID
  }

  return (
    <html lang="en">
      <body>
        <LocalizationProvider>
          <ThirdwebProvider
            {...thirdWebProviderProps}
          >
            <UserProvider>
              <ThemeProvider>{children}</ThemeProvider>
              <ToastContainer />
            </UserProvider>
          </ThirdwebProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
