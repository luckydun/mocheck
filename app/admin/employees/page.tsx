'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  role: string;
  netSalary: number;
  payableSalary: number;
}

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ firstName: '', lastName: '', employeeId: '', netSalary: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState('');
  const router = useRouter();

  const loadEmployees = async () => {
    const res = await fetch('/api/admin/employees');
    if (res.ok) {
      const data = await res.json();
      setEmployees(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadEmployees();
    const role = localStorage.getItem('role') || '';
    setCurrentRole(role);
  }, []);

  // ... (handleSubmit, handleEdit, handleDelete remain the same as before)

  const handleSubmit = async (e: React.FormEvent) => { /* same as previous clean version */ };
  const handleEdit = (emp: Employee) => { /* same */ };
  const handleDelete = async (id: string) => { /* same */ };

  const makeHR = async (id: string) => {
    if (currentRole !== 'ADMIN') return; // HR cannot promote
    if (!confirm('Make this employee HR?')) return;
    await fetch(`/api/admin/employees/${id}/make-hr`, { method: 'POST' });
    loadEmployees();
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Employee Management</h1>
          </div>
          <button
            onClick={() => router.push(currentRole === 'ADMIN' ? '/admin' : '/hr')}
            className="px-6 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Form and Table - same as the clean version you had before */}
        {/* (keep the form and table exactly as in the last clean version I gave you) */}

      </div>
    </div>
  );
}
