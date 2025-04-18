'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import axios from 'axios';

function LinkHandler() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    if (!id) return;

    axios.get('http://79.133.46.247:3000/list')
      .then(async (response) => {
        const cleanedData = response.data
          .split('\n')
          .filter((line: string) => line.trim() !== '')
          .map((line: string) => line.replace(/^\s*\d+\)\s*/, ''));

        if (cleanedData.includes(id)) {
          const create = await axios.get(`http://79.133.46.247:3000/create?publicKey=${id}`);
          const config = create.data.replace('79.133.46.247', 'be.jettingwire.xyz');
          const blob = new Blob([config], { type: 'text/plain;charset=utf-8' });

          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `${id}.ovpn`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          alert('❌ لینک نامعتبر است یا منقضی شده است.');
        }
      })
      .catch((error) => {
        console.error(error);
        alert('❌ خطا در ارتباط با سرور.');
      });
  }, [id]);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>⏳ در حال پردازش لینک...</div>
  );
}

export default function LinkPage() {
  return (
    <Suspense fallback={<div>در حال بارگذاری...</div>}>
      <LinkHandler />
    </Suspense>
  );
}
