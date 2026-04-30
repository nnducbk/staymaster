/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { homestayService } from '../services/homestayService';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  User, 
  Phone, 
  MoreVertical, 
  CheckCircle2, 
  Clock,
  XCircle,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

const statusColors: any = {
  'pending': 'bg-orange-100 text-orange-600',
  'confirmed': 'bg-blue-100 text-blue-600',
  'checked-in': 'bg-green-100 text-green-600',
  'checked-out': 'bg-gray-100 text-gray-600',
  'cancelled': 'bg-red-100 text-red-600'
};

export default function BookingManager() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    homestayService.getProperties((props) => {
      setProperties(props);
      if (props.length > 0 && !selectedPropertyId) {
        setSelectedPropertyId(props[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (selectedPropertyId) {
      const unsubscribe = homestayService.getBookings(selectedPropertyId, setBookings);
      return () => unsubscribe?.();
    }
  }, [selectedPropertyId]);

  const handleAddBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const data = {
      propertyId: selectedPropertyId,
      roomId: formData.get('roomId'),
      guestName: formData.get('guestName'),
      guestPhone: formData.get('guestPhone'),
      checkIn: formData.get('checkIn'),
      checkOut: formData.get('checkOut'),
      totalPrice: Number(formData.get('totalPrice')),
      status: 'confirmed'
    };

    await homestayService.addBooking(data);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Quản lý Đặt phòng</h1>
          <p className="text-gray-500">Theo dõi lịch trình và trạng thái các đơn đặt phòng của khách.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-black text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Đặt phòng mới
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 text-gray-500 px-4 border-r border-gray-100">
          <Filter size={18} />
          <span className="text-sm font-bold">Lọc theo:</span>
        </div>
        <select 
          value={selectedPropertyId}
          onChange={(e) => setSelectedPropertyId(e.target.value)}
          className="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer"
        >
          {properties.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
          {properties.length === 0 && <option disabled>Chưa có cơ sở nào</option>}
        </select>
        <div className="h-6 w-px bg-gray-100 mx-2" />
        <select className="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer">
          <option>Tất cả trạng thái</option>
          <option>Đang chờ</option>
          <option>Đã xác nhận</option>
          <option>Đã check-in</option>
        </select>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-[11px] uppercase tracking-wider border-b border-gray-100">
              <th className="px-8 py-5 font-bold">Khách hàng</th>
              <th className="px-8 py-5 font-bold">Thời gian</th>
              <th className="px-8 py-5 font-bold">Căn hộ/Phòng</th>
              <th className="px-8 py-5 font-bold">Trạng thái</th>
              <th className="px-8 py-5 font-bold">Tổng tiền</th>
              <th className="px-8 py-5 font-bold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <AnimatePresence>
              {bookings.map((booking) => (
                <motion.tr 
                  key={booking.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <User size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{booking.guestName}</p>
                        <p className="text-xs text-gray-500">{booking.guestPhone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarIcon size={14} className="text-gray-400" />
                      <span>{format(new Date(booking.checkIn), 'dd/MM')} - {format(new Date(booking.checkOut), 'dd/MM/yyyy')}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-medium">{booking.roomName || 'Phòng standard'}</span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusColors[booking.status] || 'bg-gray-100'}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-bold">{booking.totalPrice?.toLocaleString()}đ</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-100">
                      <MoreVertical size={18} className="text-gray-400" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        
        {bookings.length === 0 && (
          <div className="py-20 text-center">
            <CalendarIcon className="mx-auto text-gray-200 mb-4" size={64} />
            <p className="text-gray-400 font-medium italic">Không có dữ liệu đặt phòng nào được tìm thấy.</p>
          </div>
        )}
      </div>

      {/* Add Booking Modal */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 text-gray-900">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddForm(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] w-full max-w-xl relative z-10 overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Tạo đơn đặt phòng</h2>
                  <p className="text-sm text-gray-500 mt-1">Nhập thông tin chi tiết cho booking mới.</p>
                </div>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <XCircle size={24} />
                </button>
              </div>
              <form onSubmit={handleAddBooking} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-bold mb-2">Khách hàng *</label>
                    <input name="guestName" required placeholder="Họ và tên khách" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Số điện thoại</label>
                    <input name="guestPhone" placeholder="0xxx..." className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">ID Phòng/Căn</label>
                    <input name="roomId" required placeholder="VD: P101" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Ngày Check-in</label>
                    <input name="checkIn" type="date" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-black" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Ngày Check-out</label>
                    <input name="checkOut" type="date" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-black" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold mb-2">Tổng tiền (VNĐ)</label>
                    <input name="totalPrice" type="number" placeholder="500000" className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-black" />
                  </div>
                </div>
                <div className="flex gap-4 pt-4 border-t border-gray-100">
                  <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 px-6 py-4 rounded-xl font-bold border border-gray-100 hover:bg-gray-50 transition-all text-sm">Hủy</button>
                  <button type="submit" className="flex-1 px-6 py-4 rounded-xl font-bold bg-black text-white hover:bg-gray-800 transition-all text-sm">Xác nhận</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
