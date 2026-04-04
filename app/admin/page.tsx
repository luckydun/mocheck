'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [firstName, setFirstName] = useState('');
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN') {
      router.push('/');
    } else {
      const name = localStorage.getItem('firstName') || 'Admin';
      setFirstName(name);
    }
  }, [router]);

  const logout = () => {
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    localStorage.clear();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Welcome, {firstName}</h1>
            <p className="text-gray-600 mt-2">Admin Dashboard • Geo-Location Attendance & Billing System</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Employee Management */}
          <div className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition cursor-pointer"
               onClick={() => router.push('/admin/employees')}>
            <div className="text-5xl mb-6">👥</div>
            <h3 className="text-2xl font-semibold mb-3">Employee Management</h3>
            <p className="text-gray-600 mb-8">Add, Edit, View, Remove employees • Set Net Salary • Choose HR</p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-2xl transition">
              Manage Employees
            </button>
          </div>

          {/* Live Attendance */}
          <div className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition cursor-pointer"
               onClick={() => router.push('/admin/attendance')}>
            <div className="text-5xl mb-6">📍</div>
            <h3 className="text-2xl font-semibold mb-3">Live Attendance</h3>
            <p className="text-gray-600 mb-8">View who is currently signed in with geo-location and selfie</p>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-2xl transition">
              View Live Attendance
            </button>
          </div>

          {/* Download PDF */}
          <div className="bg-white p-8 rounded-3xl shadow hover:shadow-xl transition cursor-pointer"
               onClick={() => router.push('/admin/pdf')}>
            <div className="text-5xl mb-6">📄</div>
            <h3 className="text-2xl font-semibold mb-3">Attendance Report</h3>
            <p className="text-gray-600 mb-8">Download full attendance PDF report</p>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-4 rounded-2xl transition">
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
