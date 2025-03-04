'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if the admin key exists in session storage
    const adminKey = sessionStorage.getItem('adminKey');
    
    if (!adminKey || adminKey !== "IIC_rgu%#19") {
      // Redirect to the login page if not authenticated
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Verifying access...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
}