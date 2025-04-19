'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default async function Home({ params: { locale } }) {


  const router = useRouter();

  useEffect(() => {
    router.push('/parent');
  })

  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
    </div>
  );
}