import { Philosopher, Nunito } from 'next/font/google';
import './globals.css';
import Script from 'next/script';

const philosopher = Philosopher({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-philosopher',
});

const nunito = Nunito({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-nunito',
});

export const metadata = {
  title: 'Appoet - Human-Written Poetry Commissions',
  description: 'Commission poetry written with care, delivered with meaning. No AI, just authentic words crafted by a human poet.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.paypal.com/sdk/js?client-id=${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}&currency=USD`}
          strategy="lazyOnload"
        />
      </head>
      <body className={`${philosopher.variable} ${nunito.variable}`}>
        {children}
      </body>
    </html>
  );
}