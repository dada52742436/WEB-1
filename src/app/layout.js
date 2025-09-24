import './globals.css';
import ReduxProvider from '@/providers/ReduxProvider';
import ClientAuthInitializer from '@/components/ClientAuthInitializer';

export const metadata = {
  title: 'User Authentication System',
  description: 'A complete user authentication system built with Next.js and Redux',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <ClientAuthInitializer />
          <main>
            {children}
          </main>
        </ReduxProvider>
      </body>
    </html>
  );
}