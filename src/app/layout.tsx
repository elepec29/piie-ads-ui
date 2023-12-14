import AppFooter from '@/components/footer/footer';
import Version from '@/components/footer/version';
import AppHeader from '@/components/header/header';
import { AuthProvider, InscribeProvider, StepProvider } from '@/contexts';
import 'animate.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head';
import './globals.css';

// const inter = Inter({ subsets: ['latin'] })
export const metadata = {
  title: 'Portal Integral PIE',
  description: 'Nuevo Portal de Integración',
};

export default function RootLayout(
  {
    children,
  }: {
    children: React.ReactNode;
  },
  title: string,
  dsc: string,
) {
  return (
    <StepProvider>
      <AuthProvider>
        <InscribeProvider>
          <html>
            <Head>
              <title>Portal Tramitación LME - {title} </title>
              <meta name="description" content={dsc} />
              <meta name="viewport" content="width=device-width, initial-scale=1" />
              <link rel="icon" href="/favicon.ico" />
            </Head>
            <body>
              <AppHeader />

              <main>{children}</main>

              <footer>
                <AppFooter>
                  <Version />
                </AppFooter>
              </footer>
            </body>

            <script
              src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
              integrity="sha384-geWF76RCwLtnZ8qwWowPQNguL3RmwHVBC9FhGdlKrxdiJJigb/j/68SIy3Te4Bkz"
              crossOrigin={'anonymous'}
              async></script>
          </html>
        </InscribeProvider>
      </AuthProvider>
    </StepProvider>
  );
}
