'use client';

import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Link() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id'); // اگه آدرس مثل ?id=4564 باشه

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response = await axios.get('http://79.133.46.247:3000/list');
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
          alert('❌ لینک کن منقضی شد');
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [id]);

  return <></>;
}
