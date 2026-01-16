import { Philosopher, Nunito } from 'next/font/google';
import './globals.css';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${philosopher.variable} ${nunito.variable}`}>
        {children}
      </body>
    </html>
  );
}