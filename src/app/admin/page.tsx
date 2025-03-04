'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    const adminKey = sessionStorage.getItem('adminKey');
    
    if (adminKey && adminKey === "IIC_rgu%#19") {
      router.push('/admin/dashboard');
    } else {
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-gray-600">Redirecting...</p>
    </div>
  );
}