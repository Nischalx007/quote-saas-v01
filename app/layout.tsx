import './globals.css';
import AppGate from '../components/AppGate';

export const metadata = {
  title: 'QuotePilot',
  description: 'Simple quotation builder MVP',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AppGate>{children}</AppGate>
      </body>
    </html>
  );
}
