// src/components/layout/DashboardLayout.jsx
import { useState } from 'react';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout({ children, title = 'Dashboard' }) {

  return (
    <div className="flex">
      
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar (optional, remove if not needed) */}
      {/* If you want mobile, tell me and I'll add toggle */}
      
      <main className="flex-1 ml-0 md:ml-64 p-6 md:p-10">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        {children}
      </main>
    </div>
  );
}
