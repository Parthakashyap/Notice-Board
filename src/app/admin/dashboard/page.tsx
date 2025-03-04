'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

const colorOptions = [
  { value: 'bg-red-400', label: 'Red' },
  { value: 'bg-blue-400', label: 'Blue' },
  { value: 'bg-green-400', label: 'Green' },
  { value: 'bg-yellow-400', label: 'Yellow' },
  { value: 'bg-purple-400', label: 'Purple' },
  { value: 'bg-pink-400', label: 'Pink' },
  { value: 'bg-orange-400', label: 'Orange' },
];

type Notice = {
  id: number;
  position: string;
  color1: string;
  color2: string;
  text: string;
  image: string;
};

export default function AdminDashboard() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(1);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Fetch notices from API when component mounts
    const fetchNotices = async () => {
      try {
        const response = await fetch('/api/notices');
        if (response.ok) {
          const data = await response.json();
          setNotices(data);
          // Set the first notice as active by default
          if (data.length > 0) {
            setEditingNotice(data.find((notice: Notice) => notice.id === activeTab) || null);
          }
        } else {
          console.error('Failed to fetch notices');
        }
      } catch (error) {
        console.error('Error fetching notices:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotices();
  }, [activeTab]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (!editingNotice) return;
    
    const { name, value } = e.target;
    setEditingNotice({
      ...editingNotice,
      [name]: value,
    });
  };

  const handleSave = async () => {
    if (!editingNotice) return;
    
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      // Get the admin key from session storage
      const adminKey = sessionStorage.getItem('adminKey');
      
      if (!adminKey) {
        setSaveMessage('Authentication error. Please log in again.');
        setTimeout(() => {
          router.push('/admin/login');
        }, 2000);
        return;
      }
      
      const response = await fetch('/api/notices', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updatedNotice: editingNotice,
          adminKey: adminKey
        }),
      });
      
      if (response.ok) {
        const updatedNotice = await response.json();
        // Update the notices list with the updated notice
        setNotices(notices.map(notice => 
          notice.id === editingNotice.id ? updatedNotice.notice : notice
        ));
        setSaveMessage('Notice updated successfully!');
        
        // Refresh the cache for the notice board page
        router.refresh();
      } else {
        const errorData = await response.json();
        setSaveMessage(`Failed to update notice: ${errorData.error || 'Please try again.'}`);
        
        // If unauthorized, redirect to login
        if (response.status === 401) {
          setTimeout(() => {
            sessionStorage.removeItem('adminKey');
            router.push('/admin/login');
          }, 2000);
        }
      }
    } catch (error) {
      console.error('Error saving notice:', error);
      setSaveMessage('An error occurred. Please try again.');
    } finally {
      setIsSaving(false);
      
      // Clear success message after 3 seconds
      if (saveMessage.includes('successfully')) {
        setTimeout(() => {
          setSaveMessage('');
        }, 3000);
      }
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminKey');
    router.push('/admin/login');
  };

  const handleTabClick = (noticeId: number) => {
    setActiveTab(noticeId);
    const selectedNotice = notices.find(notice => notice.id === noticeId);
    if (selectedNotice) {
      setEditingNotice(selectedNotice);
    }
  };

  if (loading) {
    return <div className="h-screen flex items-center justify-center">Loading admin panel...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Notice Board Admin</h1>
          <div className="flex space-x-4">
            <Link href="/" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              View Notice Board
            </Link>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b">
            {notices.map((notice) => (
              <button
                key={notice.id}
                className={`px-6 py-3 font-medium ${
                  activeTab === notice.id
                    ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
                onClick={() => handleTabClick(notice.id)}
              >
                Notice {notice.id}
              </button>
            ))}
          </div>
          
          {/* Edit Form */}
          {editingNotice && (
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Edit Notice {editingNotice.id}</h2>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Notice Text</label>
                    <textarea
                      name="text"
                      value={editingNotice.text}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">Image URL</label>
                    <input
                      type="text"
                      name="image"
                      value={editingNotice.image}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Color 1</label>
                      <select
                        name="color1"
                        value={editingNotice.color1}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {colorOptions.map((color) => (
                          <option key={color.value} value={color.value}>
                            {color.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">Color 2</label>
                      <select
                        name="color2"
                        value={editingNotice.color2}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {colorOptions.map((color) => (
                          <option key={color.value} value={color.value}>
                            {color.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className={`px-4 py-2 rounded-md text-white ${
                        isSaving ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'
                      } transition-colors`}
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    {saveMessage && (
                      <span className={`ml-4 ${saveMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                        {saveMessage}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-medium mb-4">Preview</h3>
                  <div className="border border-gray-200 p-4 rounded-lg bg-white">
                    <div className="relative w-full h-48 mb-3 bg-gray-100 rounded-md overflow-hidden">
                      <Image 
                        src={editingNotice.image} 
                        alt="Notice Preview" 
                        width={400}
                        height={300}
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/400x300?text=Invalid+Image+URL")}
                      />
                    </div>
                    <p className="text-center font-medium">{editingNotice.text}</p>
                    <div className="flex items-center justify-center mt-2 space-x-2">
                      <div className={`w-4 h-4 rounded-full ${editingNotice.color1}`}></div>
                      <div className={`w-4 h-4 rounded-full ${editingNotice.color2}`}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}