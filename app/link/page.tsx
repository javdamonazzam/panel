// app/link/page.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';

export default function Link() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const id = searchParams.get('id'); // اگه آدرس مثل ?id=4564 باشه

  useEffect(() => {
    if (!id) {
      setError('❌ ID موجود نیست!');
      return;
    }
    
    setLoading(true);
    axios.get('http://79.133.46.247:3000/list')
      .then(async response => {
        const cleanedData = response.data
          .split('\n')
          .filter((line: string) => line.trim() !== '')
          .map((line: string) => line.replace(/^\s*\d+\)\s*/, ''));
        
        console.log(cleanedData);
        
        if (cleanedData.includes(id)) {
          const create = await axios.get(`http://79.133.46.247:3000/create?publicKey=${id}`);
          const config = create.data.replace('79.133.46.247', 'be.jettingwire.xyz');
          const blob = new Blob([config], { type: 'text/plain;charset=utf-8' });

          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `${id}.ovpn`; // نام فایل بر اساس نام کاربر
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          setError('❌ لینک منقضی شد');
        }
      })
      .catch(error => {
        console.error(error);
        setError('خطا در بارگذاری داده‌ها');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div>در حال بارگذاری...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return <></>;
}
