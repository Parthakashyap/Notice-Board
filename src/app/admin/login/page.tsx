'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// The hard-coded admin key - same as in the API
const ADMIN_KEY = "IIC_rgu%#19";

export default function AdminLogin() {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (key === ADMIN_KEY) {
      // Store the key in session storage for the admin panel to use
      sessionStorage.setItem('adminKey', key);
      // Redirect to the admin dashboard
      router.push('/admin/dashboard');
    } else {
      setError('Invalid admin key. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Notice Board Admin</h1>
          <p className="text-gray-600 mt-2">Enter your admin key to continue</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="key" className="block text-gray-700 font-medium mb-2">
                Admin Key
              </label>
              <input
                type="password"
                id="key"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your admin key"
                required
              />
              {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}