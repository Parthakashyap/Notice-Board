
'use client'
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import background from "../../../public/background.jpg";
import rgu from "../../../public/rgu.png";
import iicrgu from "../../../public/iic_rgu.jpg";

type Notice = {
  id: number;
  position: string;
  color1: string;
  color2: string;
  text: string;
  image: string;
};

export default function NoticeBoard() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<null | Notice>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        console.log('Fetching notices from API...');
        const response = await fetch('/api/notices');
        console.log('API response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Notices data received, count:', data.length);
          setNotices(data);
        } else {
          const errorData = await response.json();
          console.error('Failed to fetch notices:', errorData);
          setError(`Failed to load notices: ${errorData.error || response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching notices:', error);
        setError(`Error: ${(error as Error).message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, []);

  // Handler for closing the modal when clicking outside
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only close if the click was directly on the backdrop, not on its children
    if (e.target === e.currentTarget) {
      setSelectedNotice(null);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg">Loading notices...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error Loading Notices</h2>
          <p className="mb-4">{error}</p>
          <p className="text-sm text-gray-600">
            Please check if:
            <ul className="list-disc ml-5 mt-2">
              <li>The data directory exists in your project root</li>
              <li>The notices.json file exists in the data directory</li>
              <li>The API routes are properly configured</li>
            </ul>
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (notices.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
          <h2 className="text-xl font-bold mb-4">No Notices Found</h2>
          <p>No notices were loaded from the database.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Background Image */}
      <div className="h-screen">
        <Image src={background} alt="background" className="h-full w-full object-cover" />
      </div>
      <Image src={rgu} alt='rgu logo' className="absolute rounded-md w-[30%] bg-white top-20 left-18 border border-black shadow-md shadow-white transform -translate-x-1/2 -translate-y-1/2 "/>
      <Image src={iicrgu} alt='iic rgu logo' className="absolute rounded-md w-[32%] bg-white top-20 -right-12 border border-black shadow-md shadow-white transform -translate-x-1/2 -translate-y-1/2 "/>


      {/* Notice Cards */}
      {notices.map((notice) => (
        <div
          key={notice.id}
          onClick={() => setSelectedNotice(notice)}
          className={`${notice.position} transform h-48 w-40 -translate-x-1/2 -translate-y-1/2 bg-white shadow-black rounded-md shadow-lg cursor-pointer transition-transform hover:scale-105 flex flex-col items-center p-2 mt-4`}
        >
          <Image
            src={notice.image} 
            alt={notice.text} 
            width={200}
            height={150}
            className="h-12 w-full object-cover rounded-md mb-1"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/200x150?text=Image+Error"
            }}
          />
          <p className="text-xs text-center text-black">{notice.text}</p>
          <div className={`w-2 h-2 rounded-full ${notice.color1} absolute top-2 left-2 border border-black shadow-md shadow-black`} />
          <div className={`w-2 h-2 rounded-full ${notice.color2} absolute top-2 right-2 border border-black shadow-md shadow-black`} />
        </div>
      ))}

      

      {/* Modal with Animation */}
      <AnimatePresence>
        {selectedNotice && (
          <motion.div 
            className="fixed inset-0 flex items-center justify-center bg-black/40 bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleBackdropClick}
          >
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-lg w-[90%] h-[80%] relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setSelectedNotice(null)}
                className="absolute top-2 right-2 bg-gray-300 rounded-full px-2"
              >
                ✕
              </button>
              <Image
                src={selectedNotice.image} 
                alt="Notice" 
                height={300}
                width={400}
                className="rounded-md mb-4 w-full h-3/4 object-contain"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/400x300?text=Image+Error"
                }}
              />
              <p className="text-black text-lg font-semibold">{selectedNotice.text}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}