import initTranslations from '../i18n';
import TranslationsProvider from "@/app/components/TranslationsProvider";
// import "./globals.css";
import BootstrapClient from "@/app/components/BootstrapClient";


export default async function RootLayout({ params: { locale }, children }) {
  const { t, resources } = await initTranslations(locale);

  return (
    <html lang="en">
      <head>
        <title>Bricks 4 Kidz - Book</title>

        <link rel='stylesheet' href='https://cdn.jsdelivr.net/npm/@mdi/font@7.4.47/css/materialdesignicons.min.css'></link>

      </head>
      <body>
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
