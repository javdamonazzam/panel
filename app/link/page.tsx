'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

export const dynamic = 'force-dynamic'; // ✅ جلوی prerender رو می‌گیره

export default function LinkPage() {
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
          alert('❌ لینک منقضی شده یا معتبر نیست');
        }
      })
      .catch((error) => {
        console.error('خطا:', error);
        alert('❌ خطا در ارتباط با سرور');
      });
  }, [id]);

  return <div style={{ textAlign: 'center', marginTop: '2rem' }}>⏳ در حال پردازش لینک...</div>;
}
