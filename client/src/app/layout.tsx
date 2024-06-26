import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import Navbar from '../components/Navbar';
import Footer from '@/src/components/Footer';
import ReactQueryWrapper from '../components/ReactQueryWrapper';
import DarkThemeWrapper from '../components/DarkThemeWrapper';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="main">
          <DarkThemeWrapper>
            <ReactQueryWrapper>
              <Navbar>{children}</Navbar>
              <Footer />
              <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
              />
            </ReactQueryWrapper>
          </DarkThemeWrapper>
        </div>
      </body>
    </html>
  );
}
