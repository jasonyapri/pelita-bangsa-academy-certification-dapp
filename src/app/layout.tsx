import * as React from 'react';
import type { Viewport } from 'next';
import type { Metadata } from 'next';

import '@/styles/global.css';

import { UserProvider } from '@/contexts/user-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { ThirdwebProvider } from "thirdweb/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { config } from '@/config';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
  children: React.ReactNode;
}

const activeChain = process.env.NEXT_PUBLIC_DEVELOPMENT_MODE === 'true' ? process.env.NEXT_PUBLIC_TESTNET : process.env.NEXT_PUBLIC_MAINNET

export const metadata = { title: `${config.site.name}` } satisfies Metadata;

export default function Layout({ children }: LayoutProps): React.JSX.Element {

  const thirdWebProviderProps = {
    activeChain,
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
