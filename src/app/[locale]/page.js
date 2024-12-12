import LanguageChanger from '@/app/components/LanguageChanger';
import initTranslations from '../i18n';


export default async function Home({ params: { locale } }) {
  const { t } = await initTranslations(locale);

  return (
    <main >
      <h1>{t('header')}</h1>
      <LanguageChanger></LanguageChanger>
    </main>
  );
}