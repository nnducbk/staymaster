/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { homestayService } from '../services/homestayService';
import { 
  Plus, 
  MapPin, 
  Building2, 
  MoreVertical, 
  Image as ImageIcon,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PropertyManager() {
  const [properties, setProperties] = useState<any[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProperty, setNewProperty] = useState({
    name: '',
    address: '',
    description: '',
    type: 'Villa',
    images: [] as string[]
  });

  const [viewingRoomsFor, setViewingRoomsFor] = useState<any | null>(null);
  const [rooms, setRooms] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = homestayService.getProperties(setProperties);
    return () => unsubscribe?.();
  }, []);

  useEffect(() => {
    if (viewingRoomsFor) {
      const unsubscribe = homestayService.getRooms(viewingRoomsFor.id, setRooms);
      return () => unsubscribe?.();
    }
  }, [viewingRoomsFor]);

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    await homestayService.addProperty(newProperty);
    setShowAddForm(false);
    setNewProperty({ name: '', address: '', description: '', type: 'Villa', images: [] });
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!viewingRoomsFor) return;
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = {
      name: formData.get('name'),
      type: formData.get('type'),
      pricePerNight: Number(formData.get('price')),
      capacity: Number(formData.get('capacity')),
      status: 'available'
    };
    await homestayService.addRoom(viewingRoomsFor.id, data);
    form.reset();
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Cơ sở lưu trú</h1>
          <p className="text-gray-500">Quản lý danh sách các homestay, biệt thự và căn hộ của bạn.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-black text-white px-6 py-3 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Thêm cơ sở mới
        </button>
      </div>

      {/* Property List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {properties.map((property) => (
            <motion.div 
              key={property.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[24px] overflow-hidden shadow-sm border border-gray-100 group"
            >
              <div className="aspect-[16/10] bg-gray-200 relative overflow-hidden">
                {property.images?.[0] ? (
                  <img 
                    src={property.images[0]} 
                    alt={property.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {property.type}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold tracking-tight">{property.name}</h3>
                  <button className="text-gray-400 hover:text-black">
                    <MoreVertical size={20} />
                  </button>
                </div>
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                  <MapPin size={14} />
                  <span className="truncate">{property.address}</span>
                </div>
                
                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold">
                        U{i}
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => setViewingRoomsFor(property)}
                    className="text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Quản lý phòng <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {properties.length === 0 && !showAddForm && (
          <div className="col-span-full py-20 text-center bg-white rounded-[24px] border-2 border-dashed border-gray-200">
            <Building2 className="mx-auto text-gray-300 mb-4" size={48} />
            <p className="text-gray-500 font-medium">Chưa có cơ sở lưu trú nào.</p>
            <button 
              onClick={() => setShowAddForm(true)}
              className="mt-4 text-black font-bold underline"
            >
              Bắt đầu thêm ngay
            </button>
          </div>
        )}
      </div>

      {/* Room Listing Modal */}
      <AnimatePresence>
        {viewingRoomsFor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 text-gray-900">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setViewingRoomsFor(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[32px] w-full max-w-4xl relative z-10 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50 flex-shrink-0">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">{viewingRoomsFor.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">Danh sách phòng và trạng thái hiện tại.</p>
                </div>
                <button 
                  onClick={() => setViewingRoomsFor(null)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <ChevronRight className="rotate-90 scale-150" size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 flex gap-8">
                {/* Add Room Form */}
                <div className="w-80 flex-shrink-0 border-r border-gray-100 pr-8">
                  <h3 className="font-bold mb-4">Thêm phòng mới</h3>
                  <form onSubmit={handleAddRoom} className="space-y-4">
                    <input name="name" required placeholder="Tên/Số phòng" className="w-full px-4 py-2 rounded-xl bg-gray-50 border-none text-sm" />
                    <select name="type" className="w-full px-4 py-2 rounded-xl bg-gray-50 border-none text-sm appearance-none">
                      <option>Standard</option>
                      <option>Deluxe</option>
                      <option>Suite</option>
                    </select>
                    <input name="price" type="number" required placeholder="Giá/Đêm" className="w-full px-4 py-2 rounded-xl bg-gray-50 border-none text-sm" />
                    <input name="capacity" type="number" required placeholder="Sức chứa" className="w-full px-4 py-2 rounded-xl bg-gray-50 border-none text-sm" />
                    <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-bold text-sm hover:bg-gray-800 transition-all">
                      Thêm phòng
                    </button>
                  </form>
                </div>

                {/* Rooms Grid */}
                <div className="flex-1 grid grid-cols-2 gap-4">
                  {rooms.map((room) => (
                    <div key={room.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold">{room.name}</h4>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            room.status === 'available' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {room.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mb-4">{room.type} • {room.capacity} khách</p>
                      </div>
                      <p className="text-sm font-bold">{room.pricePerNight?.toLocaleString()}đ <span className="text-[10px] text-gray-400 font-normal">/đêm</span></p>
                    </div>
                  ))}
                  {rooms.length === 0 && (
                    <div className="col-span-full py-12 text-center text-gray-400 italic text-sm">
                      Chưa có phòng nào được thêm vào cơ sở này.
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Property Modal */}
      <AnimatePresence>
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
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
              <div className="p-8 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold tracking-tight">Thêm cơ sở mới</h2>
                <button 
                  onClick={() => setShowAddForm(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Plus className="rotate-45" size={24} />
                </button>
              </div>
              <form onSubmit={handleAddProperty} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-bold mb-2">Tên cơ sở *</label>
                  <input 
                    required
                    type="text" 
                    value={newProperty.name}
                    onChange={(e) => setNewProperty({...newProperty, name: e.target.value})}
                    placeholder="VD: Ocean View Villa"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-black transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Địa chỉ *</label>
                  <input 
                    required
                    type="text" 
                    value={newProperty.address}
                    onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
                    placeholder="VD: 123 Đường Biển, Đà Nẵng"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-black transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2">Loại hình</label>
                    <select 
                      value={newProperty.type}
                      onChange={(e) => setNewProperty({...newProperty, type: e.target.value})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-black transition-all appearance-none"
                    >
                      <option>Villa</option>
                      <option>Căn hộ</option>
                      <option>Homestay</option>
                      <option>Khách sạn</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold mb-2">Hình ảnh (URL)</label>
                    <input 
                      type="text" 
                      placeholder="Http://..."
                      onChange={(e) => setNewProperty({...newProperty, images: [e.target.value]})}
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-black transition-all"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">Mô tả</label>
                  <textarea 
                    value={newProperty.description}
                    onChange={(e) => setNewProperty({...newProperty, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border-none focus:ring-2 focus:ring-black transition-all resize-none"
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 px-6 py-4 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition-all text-sm"
                  >
                    Hủy
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 px-6 py-4 rounded-xl font-bold bg-black text-white hover:bg-gray-800 transition-all text-sm"
                  >
                    Lưu cơ sở
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
