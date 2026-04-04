'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LiveAttendancePage() {
  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadAttendance = async () => {
    const res = await fetch('/api/admin/attendance');
    const data = await res.json();
    setAttendance(data);
    setLoading(false);
  };

  useEffect(() => {
    loadAttendance();
    const interval = setInterval(loadAttendance, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Live Attendance</h1>
          <button
            onClick={() => router.push('/admin')}
            className="px-6 py-2 text-blue-600 hover:bg-blue-100 rounded-lg"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-xl font-semibold">Today’s Attendance ({attendance.length} signed in)</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-5">Employee ID</th>
                  <th className="text-left p-5">Name</th>
                  <th className="text-left p-5">Role</th>
                  <th className="text-left p-5">Sign In Time</th>
                  <th className="text-left p-5">Selfie</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {attendance.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="p-5 font-mono">{record.user.employeeId}</td>
                    <td className="p-5">{record.user.firstName} {record.user.lastName}</td>
                    <td className="p-5">
                      <span className="px-3 py-1 rounded-full text-xs bg-gray-100">
                        {record.user.role}
                      </span>
                    </td>
                    <td className="p-5">
                      {new Date(record.signInTime).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </td>
                    <td className="p-5">
                      {record.selfieUrl && (
                        <img src={record.selfieUrl} alt="Selfie" className="w-12 h-12 object-cover rounded-lg" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
