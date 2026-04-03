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
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    employeeId: '',
    netSalary: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const router = useRouter();

  const loadEmployees = async () => {
    try {
      const res = await fetch('/api/admin/employees');
      if (res.ok) {
        const data = await res.json();
        setEmployees(data);
      }
    } catch (error) {
      console.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingId 
      ? `/api/admin/employees/${editingId}` 
      : '/api/admin/employees';

    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({ firstName: '', lastName: '', employeeId: '', netSalary: 0 });
      setEditingId(null);
      loadEmployees();
    }
  };

  const handleEdit = (emp: Employee) => {
    setForm({
      firstName: emp.firstName,
      lastName: emp.lastName,
      employeeId: emp.employeeId,
      netSalary: emp.netSalary,
    });
    setEditingId(emp.id);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this employee?')) return;
    
    await fetch(`/api/admin/employees/${id}`, { method: 'DELETE' });
    loadEmployees();
  };

  const makeHR = async (id: string) => {
    if (!confirm('Make this employee HR?')) return;
    
    await fetch(`/api/admin/employees/${id}/make-hr`, { method: 'POST' });
    loadEmployees();
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading employees...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
            <p className="text-gray-600 mt-1">Add, Edit, View & Remove Employees • Net Salary Management</p>
          </div>
          <button
            onClick={() => router.push('/admin')}
            ← Back to Admin Dashboard
          </button>
            <div>
              <label className="block text-sm font-medium mb-2">First Name</label>
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last Name</label>
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Employee ID</label>
              <input
                type="text"
                value={form.employeeId}
                onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Net Salary (UGX)</label>
              <input
                type="number"
                value={form.netSalary}
                onChange={(e) => setForm({ ...form, netSalary: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition"
            >
              {editingId ? 'Update Employee' : 'Add Employee'}
            </button>
          </form>
        </div>

        {/* Employees Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="p-6 border-b bg-gray-50">
            <h2 className="text-xl font-semibold">All Employees ({employees.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-5 font-medium">Employee ID</th>
                  <th className="text-left p-5 font-medium">Full Name</th>
                  <th className="text-left p-5 font-medium">Role</th>
                  <th className="text-right p-5 font-medium">Net Salary</th>
                  <th className="text-right p-5 font-medium">Payable Salary</th>
                  <th className="p-5 font-medium text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="p-5 font-mono">{emp.employeeId}</td>
                    <td className="p-5">{emp.firstName} {emp.lastName}</td>
                    <td className="p-5">
                      <span className={`inline-block px-4 py-1 rounded-full text-xs font-medium
                        ${emp.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 
                          emp.role === 'HR' ? 'bg-purple-100 text-purple-700' : 
                          'bg-gray-100 text-gray-700'}`}>
                        {emp.role}
                      </span>
                    </td>
                    <td className="p-5 text-right font-semibold">UGX {emp.netSalary.toLocaleString()}</td>
                    <td className="p-5 text-right font-semibold text-green-600">UGX {emp.payableSalary.toLocaleString()}</td>
                    <td className="p-5 text-center space-x-4">
                      <button 
                        onClick={() => handleEdit(emp)} 
                        className="text-blue-600 hover:underline font-medium"
                      >
                        Edit
                      </button>
                      {emp.role !== 'ADMIN' && (
                        <>
                          <button 
                            onClick={() => makeHR(emp.id)} 
                            className="text-purple-600 hover:underline font-medium"
                          >
                            Make HR
                          </button>
                          <button 
                            onClick={() => handleDelete(emp.id)} 
                            className="text-red-600 hover:underline font-medium"
                          >
                            Remove
                          </button>
                        </>
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
