'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { 
    padding: 40, 
    fontSize: 12,
    backgroundColor: '#ffffff'
  },
  title: { 
    fontSize: 20, 
    marginBottom: 15, 
    textAlign: 'center', 
    fontWeight: 'bold' 
  },
  subtitle: { 
    fontSize: 14, 
    marginBottom: 25, 
    textAlign: 'center',
    color: '#666'
  },
  header: { 
    flexDirection: 'row', 
    borderBottom: '2px solid #000', 
    paddingBottom: 8, 
    marginBottom: 15,
    fontWeight: 'bold'
  },
  row: { 
    flexDirection: 'row', 
    marginBottom: 8,
    borderBottom: '1px solid #eee',
    paddingBottom: 6
  },
  col1: { width: '22%' },
  col2: { width: '30%' },
  col3: { width: '24%' },
  col4: { width: '24%' },
});

const AttendancePDF = ({ records }: { records: any[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>MoCheck Attendance Report</Text>
      <Text style={styles.subtitle}>
        Generated on: {new Date().toLocaleDateString('en-GB')} | Kampala Office
      </Text>

      <View style={styles.header}>
        <Text style={styles.col1}>Employee ID</Text>
        <Text style={styles.col2}>Name</Text>
        <Text style={styles.col3}>Sign In Time</Text>
        <Text style={styles.col4}>Sign Out Time</Text>
      </View>

      {records.length === 0 && (
        <Text style={{ textAlign: 'center', marginTop: 40, color: '#999' }}>
          No attendance records for today
        </Text>
      )}

      {records.map((record, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.col1}>{record.user.employeeId}</Text>
          <Text style={styles.col2}>
            {record.user.firstName} {record.user.lastName}
          </Text>
          <Text style={styles.col3}>
            {record.signInTime 
              ? new Date(record.signInTime).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }) 
              : '-'}
          </Text>
          <Text style={styles.col4}>
            {record.signOutTime 
              ? new Date(record.signOutTime).toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }) 
              : 'Not signed out'}
          </Text>
        </View>
      ))}
    </Page>
  </Document>
);

export default function PDFPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/attendance')
      .then(res => res.json())
      .then(data => {
        setRecords(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading attendance data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-12">
        <h1 className="text-4xl font-bold text-center mb-4">Attendance Report</h1>
        <p className="text-center text-gray-600 mb-12">
          {new Date().toLocaleDateString('en-GB')} • Kampala Office
        </p>

        <div className="text-center mb-16">
          <PDFDownloadLink 
            document={<AttendancePDF records={records} />} 
            fileName={`mocheck-attendance-${new Date().toISOString().split('T')[0]}.pdf`}
          >
            {({ loading }) => (
              <button 
                className="bg-purple-600 hover:bg-purple-700 text-white text-2xl font-semibold px-20 py-6 rounded-3xl transition-all active:scale-95"
                disabled={loading}
              >
                {loading ? 'Generating PDF...' : '📥 Download Attendance PDF'}
              </button>
            )}
          </PDFDownloadLink>
        </div>

        <button 
          onClick={() => router.push('/admin')}
          className="block mx-auto px-8 py-3 text-gray-600 hover:text-gray-900 underline"
        >
          ← Back to Admin Dashboard
        </button>
      </div>
    </div>
  );
}
