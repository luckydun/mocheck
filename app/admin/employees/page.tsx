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

  // Load all employees
  const loadEmployees = async () => {
    const res = await fetch('/api/admin/employees');
    const data = await res.json();
    setEmployees(data);
    setLoading(false);
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

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setForm({ firstName: '', lastName: '', employeeId: '', netSalary: 0 });
    setEditingId(null);
    loadEmployees();
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
    if (!confirm('Remove this employee?')) return;
    await fetch(`/api/admin/employees/${id}`, { method: 'DELETE' });
    loadEmployees();
  };

  const makeHR = async (id: string) => {
    await fetch(`/api/admin/employees/${id}/make-hr`, { method: 'POST' });
    loadEmployees();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Employee Management</h1>
          <button
            onClick={() => router.push('/admin')}
            className="text-blue-600 hover:underline"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Add / Edit Form */}
        <div className="bg-white p-8 rounded-2xl shadow mb-10">
          <h2 className="text-xl font-semibold mb-6">
            {editingId ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              type="text"
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              className="border p-3 rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              className="border p-3 rounded-lg"
              required
            />
            <input
              type="text"
              placeholder="Employee ID"
              value={form.employeeId}
              onChange={(e) => setForm({ ...form, employeeId: e.target.value })}
              className="border p-3 rounded-lg"
              required
            />
            <input
              type="number"
              placeholder="Net Salary (UGX)"
              value={form.netSalary}
              onChange={(e) => setForm({ ...form, netSalary: Number(e.target.value) })}
              className="border p-3 rounded-lg"
              required
            />

            <button
              type="submit"
              className="md:col-span-2 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              {editingId ? 'Update Employee' : 'Add Employee'}
            </button>
          </form>
        </div>

        {/* Employees List */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">All Employees ({employees.length})</h2>
          </div>
          <table className="w-full">
  <thead className="bg-gray-100">
    <tr>
      <th className="text-left p-4">Employee ID</th>
      <th className="text-left p-4">Name</th>
      <th className="text-left p-4">Role</th>
      <th className="text-right p-4">Net Salary</th>
      <th className="text-right p-4">Payable Salary</th>
      <th className="p-4">Actions</th>
    </tr>
  </thead>
  <tbody>
    {employees.map((emp) => (
      <tr key={emp.id} className="border-t hover:bg-gray-50">
        <td className="p-4 font-mono">{emp.employeeId}</td>
        <td className="p-4">{emp.firstName} {emp.lastName}</td>
        <td className="p-4">
          <span className={`px-3 py-1 rounded-full text-xs ${emp.role === 'ADMIN' ? 'bg-red-100 text-red-700' : emp.role === 'HR' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
            {emp.role}
          </span>
        </td>
        <td className="p-4 text-right font-semibold">UGX {emp.netSalary.toLocaleString()}</td>
        <td className="p-4 text-right font-semibold text-green-600">UGX {emp.payableSalary.toLocaleString()}</td>
        <td className="p-4">
          <button onClick={() => handleEdit(emp)} className="text-blue-600 hover:underline mr-4">Edit</button>
          {emp.role !== 'ADMIN' && (
            <button onClick={() => makeHR(emp.id)} className="text-purple-600 hover:underline mr-4">Make HR</button>
          )}
          {emp.role !== 'ADMIN' && (
            <button onClick={() => handleDelete(emp.id)} className="text-red-600 hover:underline">Remove</button>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>
        </div>
    </div>
  );
}      </div>
              ))}
