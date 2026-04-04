'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 12 },
  title: { fontSize: 18, marginBottom: 20, textAlign: 'center', fontWeight: 'bold' },
  header: { flexDirection: 'row', borderBottom: '1px solid black', paddingBottom: 8, marginBottom: 15 },
  row: { flexDirection: 'row', marginBottom: 6 },
  col1: { width: '25%' },
  col2: { width: '30%' },
  col3: { width: '25%' },
  col4: { width: '20%' },
});

const AttendancePDF = ({ records }: { records: any[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>MoCheck Attendance Report</Text>
      <Text style={{ textAlign: 'center', marginBottom: 20 }}>
        Date: {new Date().toLocaleDateString('en-GB')}
      </Text>

      <View style={styles.header}>
        <Text style={styles.col1}>Employee ID</Text>
        <Text style={styles.col2}>Name</Text>
        <Text style={styles.col3}>Sign In</Text>
        <Text style={styles.col4}>Sign Out</Text>
      </View>

      {records.map((record, index) => (
        <View key={index} style={styles.row}>
          <Text style={styles.col1}>{record.user.employeeId}</Text>
          <Text style={styles.col2}>
            {record.user.firstName} {record.user.lastName}
          </Text>
          <Text style={styles.col3}>
            {record.signInTime 
              ? new Date(record.signInTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) 
              : '-'}
          </Text>
          <Text style={styles.col4}>
            {record.signOutTime 
              ? new Date(record.signOutTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) 
              : '-'}
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
      });
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading report...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow p-10">
        <h1 className="text-4xl font-bold text-center mb-10">Attendance Report</h1>

        <div className="text-center mb-12">
          <PDFDownloadLink 
            document={<AttendancePDF records={records} />} 
            fileName={`attendance-${new Date().toISOString().split('T')[0]}.pdf`}
          >
            {({ loading }) => (
              <button className="bg-purple-600 hover:bg-purple-700 text-white text-xl font-semibold px-16 py-5 rounded-2xl transition">
                {loading ? 'Generating PDF...' : '📥 Download Attendance PDF'}
              </button>
            )}
          </PDFDownloadLink>
        </div>

        <button 
          onClick={() => router.push('/admin')}
          className="block mx-auto text-gray-500 underline"
        >
          ← Back to Admin Dashboard
        </button>
      </div>
    </div>
  );
}
