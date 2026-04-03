'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EmployeeDashboard() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role !== 'EMPLOYEE') {
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
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Employee Dashboard</h1>
          <button onClick={logout} className="bg-red-600 text-white px-6 py-3 rounded-xl">
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl shadow">
            <h3 className="text-2xl font-semibold mb-6">Sign In / Sign Out</h3>
            <div className="space-y-4">
              <button 
                onClick={() => router.push('/employee/signin')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl text-lg font-semibold"
              >
                Sign In (5:00am - 12:00pm)
              </button>
              <button 
                onClick={() => router.push('/employee/signout')}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-4 rounded-2xl text-lg font-semibold"
              >
                Sign Out (8:00pm - 11:30pm)
              </button>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow">
            <h3 className="text-2xl font-semibold mb-6">My Details</h3>
            <div className="space-y-4 text-lg">
              <p><strong>Name:</strong> {user?.firstName} {user?.lastName}</p>
              <p><strong>Net Salary:</strong> UGX {user?.netSalary?.toLocaleString()}</p>
              <p className="text-green-600"><strong>Payable Salary:</strong> UGX {user?.payableSalary?.toLocaleString()}</p>
            </div>
            <button className="mt-8 w-full bg-blue-600 text-white py-3 rounded-xl">
              Change Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
