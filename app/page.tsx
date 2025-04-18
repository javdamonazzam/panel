"use client"
import axios from 'axios';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function Home() {
  const [data, setData] = useState([]);
  const [userName, setUserName] = useState('');
  const [load, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  // دریافت داده از API
  useEffect(() => {
    axios.get('http://79.133.46.247:3000/list')
      .then(response => {
        const cleanedData = response.data
          .split('\n')  // جدا کردن هر خط
          .filter((line: string) => line.trim() !== '')  // حذف خطوط خالی
          .map((line: string) => line.replace(/^\s*\d+\)\s*/, ''));  // حذف شماره و پرانتز

        setData(cleanedData);
      })
      .catch(error => {
        console.error(error);
      });
  }, [load]);

  // تابع برای ایجاد کاربر جدید
  const handleCreateUser = async () => {
    if (userName.trim() !== '') {
      setIsCreating(true);
      const create = await axios.get(`http://79.133.46.247:3000/create?publicKey=${userName}`);
      const config = create.data.replace('79.133.46.247', 'be.jettingwire.xyz');
      const blob = new Blob([config], { type: 'text/plain;charset=utf-8' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${userName}.ovpn`; // نام فایل بر اساس نام کاربر
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsCreating(false);
      setUserName('');  // پاک کردن فیلد ورودی پس از ارسال
    } else {
      alert('لطفاً نام کاربر را وارد کنید');
    }
  };
  const handleDeleteUser = async (name: string) => {
    setLoading(true)

    const create = await axios.get(`http://79.133.46.247:3000/remove?publicKey=${name}`);
    setLoading(false)
  }
  // const CopyableTableCell = ({ link }) => {
  //   const handleCopy = () => {
  //     navigator.clipboard.writeText(link).then(() => {
  //       alert('کپی شد!');
  //     }).catch((err) => {
  //       console.error('خطا در کپی:', err);
  //     });
  //   };
  return (
    <>
      <Box
        sx={{
          maxWidth: '400px',
          margin: 'auto',
          padding: '20px',
          backgroundColor: '#f4f6f8',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" sx={{ color: '#333', textAlign: 'center' }}>
          ساخت کاربر جدید
        </Typography>

        <TextField
          label="نام کاربر"
          variant="outlined"
          fullWidth
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          sx={{
            backgroundColor: 'white',
            borderRadius: '5px',
          }}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            fontSize: '1rem',
            padding: '10px',
            backgroundColor: '#1976d2',
            borderRadius: '5px',
            '&:hover': {
              backgroundColor: '#1565c0',
            },
          }}
          onClick={handleCreateUser}
          disabled={isCreating}
        >
          {isCreating ? 'در حال ساخت...' : 'ساخت کاربر'}
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ maxWidth: '500px', margin: 'auto' }}>
        <Table sx={{ minWidth: 50, fontSize: '0.8rem' }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="right" sx={{ fontSize: '0.8rem' }}>نام کاربر</TableCell>
              <TableCell align="right" sx={{ fontSize: '0.8rem' }}>لینک</TableCell>
              <TableCell align="left" sx={{ fontSize: '0.8rem' }}>عملیات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <TableRow key={index}>
                  <TableCell align="right" sx={{ fontSize: '0.8rem' }}>{item}</TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontSize: '0.8rem', cursor: 'pointer', color: 'blue' }}
                    onClick={() => {
                      navigator.clipboard.writeText(`http://localhost:3000/link?id=${item}`)
                        .catch(err => console.error('خطا در کپی:', err));
                    }}
                  >
                    کپی لینک
                  </TableCell>
                  <TableCell align="left" sx={{ fontSize: '1rem', paddingRight: '60px' }}>
                    <button
                      style={{
                        backgroundColor: '#ff4747',  // رنگ قرمز جذاب
                        borderRadius: '20px',  // گوشه‌های گرد
                        border: 'none',
                        color: 'white',  // متن سفید
                        fontSize: '1rem',
                        padding: '8px 20px',  // فضای داخلی دکمه
                        cursor: 'pointer',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',  // سایه برای عمق بیشتر
                        transition: 'all 0.3s ease',  // انیمیشن هنگام هاور
                      }}
                      onClick={() => {
                        // کدی که برای حذف میخواهید انجام دهید را اینجا بنویسید
                        handleDeleteUser(item)
                      }}
                    >
                      {load ? 'در حال حذف' : 'حذف'}
                    </button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center" sx={{ fontSize: '1rem' }}>
                  در حال بارگذاری داده‌ها...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
