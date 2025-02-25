import initTranslations from '../i18n';
import TranslationsProvider from "@/app/components/TranslationsProvider";
import localFont from "next/font/local";
import "./globals.css";
import BootstrapClient from "@/app/components/BootstripClient";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default async function RootLayout({ params: { locale }, children }) {
  const { t, resources } = await initTranslations(locale);

  return (
    <html lang="en">
      <head>
        <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css'></link>
        
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <TranslationsProvider
          locale={locale}
          resources={resources}
        >
          {children}
        </TranslationsProvider>
        <BootstrapClient />
      </body>
    </html>
  );
}
