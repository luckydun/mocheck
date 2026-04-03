'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'ADMIN') {
      router.push('/');
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
            <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Geo-Location Attendance & Billing System</p>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-4">Employee Management</h3>
            <p className="text-gray-600">Add, Edit, View & Remove Employees + Set Net Salary</p>
            <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg w-full">
              Manage Employees
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-4">Live Attendance</h3>
            <p className="text-gray-600">View who is currently signed in</p>
            <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg w-full">
              View Live Attendance
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-4">Download Report</h3>
            <p className="text-gray-600">Download Attendance PDF</p>
            <button className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg w-full">
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
