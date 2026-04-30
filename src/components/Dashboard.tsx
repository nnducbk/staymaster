/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  CreditCard, 
  Home as HomeIcon,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', revenue: 4000, bookings: 24 },
  { name: 'Tue', revenue: 3000, bookings: 13 },
  { name: 'Wed', revenue: 2000, bookings: 98 },
  { name: 'Thu', revenue: 2780, bookings: 39 },
  { name: 'Fri', revenue: 1890, bookings: 48 },
  { name: 'Sat', revenue: 2390, bookings: 38 },
  { name: 'Sun', revenue: 3490, bookings: 43 },
];

const StatCard = ({ title, value, icon: Icon, trend, trendValue }: any) => (
  <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">
    <div className="flex justify-between items-start mb-4">
      <div className="bg-gray-50 p-3 rounded-2xl text-black">
        <Icon size={24} />
      </div>
      <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
        {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        {trendValue}
      </div>
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
    </div>
  </div>
);

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Xin chào 👋</h1>
        <p className="text-gray-500">Đây là báo cáo tổng quan về hệ thống Homestay của bạn.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Tổng doanh thu" 
          value="125.400.000đ" 
          icon={CreditCard} 
          trend="up" 
          trendValue="+12.5%" 
        />
        <StatCard 
          title="Tổng đặt phòng" 
          value="482" 
          icon={TrendingUp} 
          trend="up" 
          trendValue="+8.2%" 
        />
        <StatCard 
          title="Tỷ lệ lấp đầy" 
          value="84%" 
          icon={HomeIcon} 
          trend="down" 
          trendValue="-2.4%" 
        />
        <StatCard 
          title="Khách mới" 
          value="124" 
          icon={Users} 
          trend="up" 
          trendValue="+18.7%" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[24px] shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold tracking-tight">Biểu đồ doanh thu</h3>
            <select className="bg-gray-50 border-none rounded-lg px-4 py-2 text-sm font-medium">
              <option>7 ngày qua</option>
              <option>30 ngày qua</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#000" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#000" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 12, fill: '#9CA3AF' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' 
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#000" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[24px] shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold tracking-tight mb-6">Hoạt động gần đây</h3>
          <div className="space-y-6">
            {[
              { user: 'Anh Tuấn', action: 'vừa đặt phòng', time: '5 phút trước', color: 'bg-blue-500' },
              { user: 'Chị Lan', action: 'đã check-out', time: '12 phút trước', color: 'bg-green-500' },
              { user: 'Minh Đức', action: 'hủy đặt phòng', time: '45 phút trước', color: 'bg-red-500' },
              { user: 'Quốc Bảo', action: 'vừa check-in', time: '1 giờ trước', color: 'bg-orange-500' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4">
                <div className={`w-10 h-10 rounded-full ${activity.color} flex-shrink-0 flex items-center justify-center text-white font-bold text-xs`}>
                  {activity.user[0]}
                </div>
                <div>
                  <p className="text-sm">
                    <span className="font-bold">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 rounded-xl border border-gray-100 text-sm font-semibold hover:bg-gray-50 transition-colors">
            Xem tất cả hoạt động
          </button>
        </div>
      </div>
    </div>
  );
}
