'use client';

import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

export default function Link() {
  const searchParams = useSearchParams();
  console.log(searchParams.get('id') ,"<<<<<<<<<<<<<<<<<<<<<<<<");
  
  const id = searchParams.get('id'); // اگه آدرس مثل ?id=4564 باشه

  useEffect( () => {
    axios.get('http://79.133.46.247:3000/list')
      .then(async response => {
        const cleanedData = response.data
          .split('\n')  // جدا کردن هر خط
          .filter((line: string) => line.trim() !== '')  // حذف خطوط خالی
          .map((line: string) => line.replace(/^\s*\d+\)\s*/, ''));  // حذف شماره و پرانتز
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
          }else {
            alert('❌ لینک کن منقضی شد');
          }
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <>

    </>
  );
}