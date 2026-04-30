/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { auth, signIn, logOut } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  Home, 
  LayoutDashboard, 
  Calendar, 
  Users, 
  LogOut, 
  Plus, 
  Search, 
  Bell,
  Menu,
  X,
  Hotel
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Dashboard from './components/Dashboard';
import PropertyManager from './components/PropertyManager';
import BookingManager from './components/BookingManager';

type View = 'dashboard' | 'properties' | 'bookings' | 'guests';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#F5F5F5]">
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }} 
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-gray-400"
        >
          <Hotel size={48} />
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#F5F5F5] font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 rounded-[24px] shadow-sm text-center max-w-md w-full"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-black text-white p-4 rounded-full">
              <Hotel size={32} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">StayMaster</h1>
          <p className="text-gray-500 mb-8 font-medium">Hệ thống quản lý Homestay hiện đại</p>
          <button 
            onClick={signIn}
            className="w-full bg-black text-white py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-3"
          >
            Đăng nhập với Google
          </button>
        </motion.div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'properties', label: 'Cơ sở lưu trú', icon: Home },
    { id: 'bookings', label: 'Đặt phòng', icon: Calendar },
    { id: 'guests', label: 'Khách hàng', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-[#F5F5F5] font-sans text-gray-900">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="bg-white border-r border-gray-200 flex flex-col overflow-hidden"
          >
            <div className="p-8">
              <div className="flex items-center gap-3 mb-12">
                <div className="bg-black text-white p-2 rounded-lg">
                  <Hotel size={20} />
                </div>
                <span className="text-xl font-bold tracking-tight">StayMaster</span>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setCurrentView(item.id as View)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      currentView === item.id 
                        ? 'bg-gray-100 text-black font-semibold' 
                        : 'text-gray-500 hover:text-black hover:bg-gray-50'
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                    {currentView === item.id && (
                      <motion.div layoutId="nav-indicator" className="ml-auto w-1 h-4 bg-black rounded-full" />
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-auto p-8 border-t border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src={user.photoURL || ''} 
                  alt={user.displayName || ''} 
                  className="w-10 h-10 rounded-full bg-gray-200"
                />
                <div className="overflow-hidden">
                  <p className="text-sm font-semibold truncate">{user.displayName}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
              <button 
                onClick={logOut}
                className="w-full flex items-center gap-3 text-gray-500 hover:text-red-500 transition-colors py-2"
              >
                <LogOut size={20} />
                <span className="font-medium">Đăng xuất</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text" 
                placeholder="Tìm kiếm..."
                className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm border-none focus:ring-2 focus:ring-black/5 w-64 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            <button className="bg-black text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all flex items-center gap-2">
              <Plus size={18} />
              Tạo mới
            </button>
          </div>
        </header>

        {/* Viewport */}
        <div className="flex-1 overflow-y-auto p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {currentView === 'dashboard' && <Dashboard />}
              {currentView === 'properties' && <PropertyManager />}
              {currentView === 'bookings' && <BookingManager />}
              {currentView === 'guests' && (
                <div className="bg-white p-8 rounded-[24px] shadow-sm">
                  <h2 className="text-2xl font-bold mb-4">Danh sách khách hàng</h2>
                  <p className="text-gray-500 italic">Tính năng đang được phát triển...</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
