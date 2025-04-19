import { redirect } from 'next/navigation';

export default function Home({ params: { locale } }) {
  redirect('/parent');

  // fallback content (won't be seen because of redirect)
  return null;
}
