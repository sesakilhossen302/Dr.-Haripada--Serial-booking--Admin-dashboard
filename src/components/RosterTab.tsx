import { useState } from 'react';
import { Search, Printer, Plus } from 'lucide-react';
import type { PatientAppointment, AppointmentStatus } from '../types';
import { formatSerial, toBengaliNumber, formatTimeWithMs, formatBengaliDate } from '../utils/bengali';

interface RosterTabProps {
  appointments: PatientAppointment[];
  selectedDate: string;
  onUpdateStatus: (appointmentId: string, status: AppointmentStatus) => void;
  onAddWalkInPatient: (newPatient: Omit<PatientAppointment, 'id' | 'tokenCode' | 'bookedAt'>) => void;
}

export const RosterTab: React.FC<RosterTabProps> = ({
  appointments,
  selectedDate,
  onUpdateStatus,
  onAddWalkInPatient,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Walk-in form state
  const [newPatient, setNewPatient] = useState({
    patientName: '',
    patientPhone: '',
    patientAge: 40,
    patientGender: 'পুরুষ' as 'পুরুষ' | 'মহিলা' | 'অন্যান্য',
    problemDescription: '',
    slotId: 'slot_1',
    slotTime: 'বিকাল ৪:০০ – ৫:০০',
    chamberName: 'সেন্ট্রাল স্পেশালাইজড হাসপাতাল',
    chamberLocation: 'ধাপ, রংপুর',
    status: 'waiting' as AppointmentStatus,
    serialNumber: appointments.length + 1,
    dateKey: selectedDate,
  });

  const filtered = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientPhone.includes(searchQuery) ||
      String(apt.serialNumber).includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.patientName || !newPatient.patientPhone) return;

    onAddWalkInPatient({
      ...newPatient,
      dateKey: selectedDate,
      serialNumber: appointments.length + 1,
    });

    setShowAddModal(false);
    setNewPatient({
      patientName: '',
      patientPhone: '',
      patientAge: 40,
      patientGender: 'পুরুষ',
      problemDescription: '',
      slotId: 'slot_1',
      slotTime: 'বিকাল ৪:০০ – ৫:০০',
      chamberName: 'সেন্ট্রাল স্পেশালাইজড হাসপাতাল',
      chamberLocation: 'ধাপ, রংপুর',
      status: 'waiting',
      serialNumber: appointments.length + 2,
      dateKey: selectedDate,
    });
  };

  return (
    <div>
      {/* Header & Controls */}
      <div className="no-print" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#073A4B', margin: 0 }}>
            সিরিয়াল রোস্টার ও রোগী তালিকা (FCFS)
          </h2>
          <p style={{ fontSize: '13.5px', color: '#64748B', margin: '4px 0 0 0' }}>
            তারিখ: <strong>{formatBengaliDate(selectedDate)}</strong> • মিলিসেকেন্ড নির্ভুল সময় অনুসারে সংগৃহীত
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handlePrint}
            style={{
              backgroundColor: '#F1F5F9',
              color: '#334155',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '13.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid #CBD5E1'
            }}
          >
            <Printer size={16} />
            <span>প্রিন্ট সিরিয়াল শিট</span>
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            style={{
              backgroundColor: '#0D5C75',
              color: '#ffffff',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '13.5px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 10px rgba(13, 92, 117, 0.2)'
            }}
          >
            <Plus size={16} />
            <span>জরুরি রোগী এন্ট্রি (Walk-in)</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="no-print" style={{
        backgroundColor: '#ffffff',
        padding: '16px 20px',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '20px'
      }}>
        {/* Search */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: '#F8FAFC',
          border: '1px solid #CBD5E1',
          padding: '8px 14px',
          borderRadius: '10px',
          minWidth: '280px'
        }}>
          <Search size={16} color="#64748B" />
          <input
            type="text"
            placeholder="রোগীর নাম, ফোন বা সিরিয়াল নং খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ border: 'none', background: 'transparent', width: '100%', fontSize: '13.5px' }}
          />
        </div>

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'সকল রোগী' },
            { id: 'waiting', label: 'অপেক্ষমান' },
            { id: 'in_chamber', label: 'কক্ষে চিকিৎসাধীন' },
            { id: 'completed', label: 'সম্পন্ন' },
            { id: 'cancelled', label: 'বাতিল' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={{
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 600,
                backgroundColor: statusFilter === tab.id ? '#0D5C75' : '#F1F5F9',
                color: statusFilter === tab.id ? '#ffffff' : '#475569',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Printable Sheet Header (visible when printing) */}
      <div className="print-only" style={{ display: 'none', textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '22px', margin: 0 }}>ডা. হরিপদ - চেম্বার রোগী সিরিয়াল শিট</h1>
        <p style={{ fontSize: '14px', color: '#555', margin: '4px 0' }}>
          হৃদরোগ ও কার্ডিওলজি বিশেষজ্ঞ | তারিখ: {formatBengaliDate(selectedDate)}
        </p>
      </div>

      {/* Roster Table */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        overflow: 'hidden',
        boxShadow: '0 4px 14px rgba(0,0,0,0.02)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13.5px' }}>
          <thead>
            <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1.5px solid #E2E8F0', color: '#475569' }}>
              <th style={{ padding: '14px 18px', fontWeight: 700 }}>সিরিয়াল</th>
              <th style={{ padding: '14px 18px', fontWeight: 700 }}>রোগীর নাম ও টোকেন</th>
              <th style={{ padding: '14px 18px', fontWeight: 700 }}>বয়স ও লিঙ্গ</th>
              <th style={{ padding: '14px 18px', fontWeight: 700 }}>মোবাইল নম্বর</th>
              <th style={{ padding: '14px 18px', fontWeight: 700 }}>বুকিং সময় (MS FCFS)</th>
              <th style={{ padding: '14px 18px', fontWeight: 700 }}>সমস্যার বিবরণ</th>
              <th style={{ padding: '14px 18px', fontWeight: 700 }}>স্ট্যাটাস</th>
              <th className="no-print" style={{ padding: '14px 18px', fontWeight: 700, textAlign: 'center' }}>অ্যাকশন</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: '36px', textAlign: 'center', color: '#94A3B8' }}>
                  কোনো রোগী পাওয়া যায়নি।
                </td>
              </tr>
            ) : (
              filtered.map((apt) => {
                return (
                  <tr
                    key={apt.id}
                    style={{
                      borderBottom: '1px solid #F1F5F9',
                      backgroundColor: apt.status === 'in_chamber' ? '#F0FDF4' : 'transparent',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    {/* Serial */}
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        backgroundColor: apt.status === 'in_chamber' ? '#2A9D8F' : '#0D5C75',
                        color: '#ffffff',
                        fontWeight: 900,
                        fontSize: '16px'
                      }}>
                        {formatSerial(apt.serialNumber)}
                      </span>
                    </td>

                    {/* Patient Name & Token */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '14px' }}>
                        {apt.patientName}
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748B', fontFamily: 'monospace' }}>
                        {apt.tokenCode}
                      </div>
                    </td>

                    {/* Age / Gender */}
                    <td style={{ padding: '14px 18px', color: '#334155' }}>
                      {toBengaliNumber(apt.patientAge)} বছর ({apt.patientGender})
                    </td>

                    {/* Phone */}
                    <td style={{ padding: '14px 18px', fontWeight: 600, color: '#0D5C75' }}>
                      {apt.patientPhone}
                    </td>

                    {/* Millisecond Timestamp */}
                    <td style={{ padding: '14px 18px', color: '#0F172A', fontFamily: 'monospace', fontSize: '12px' }}>
                      <span style={{
                        backgroundColor: '#E8F4F8',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        color: '#073A4B',
                        fontWeight: 600
                      }}>
                        {formatTimeWithMs(apt.bookedAt)}
                      </span>
                    </td>

                    {/* Problem */}
                    <td style={{ padding: '14px 18px', color: '#475569', maxWidth: '200px' }}>
                      {apt.problemDescription || '—'}
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '14px 18px' }}>
                      <span className={`badge badge-${apt.status.replace('_', '-')}`}>
                        {apt.status === 'waiting' && 'অপেক্ষমান'}
                        {apt.status === 'in_chamber' && 'কক্ষে আছেন'}
                        {apt.status === 'completed' && 'সম্পন্ন'}
                        {apt.status === 'cancelled' && 'বাতিল'}
                      </span>
                    </td>

                    {/* Action Dropdown */}
                    <td className="no-print" style={{ padding: '14px 18px', textAlign: 'center' }}>
                      <select
                        value={apt.status}
                        onChange={(e) => onUpdateStatus(apt.id, e.target.value as AppointmentStatus)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          border: '1px solid #CBD5E1',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#334155',
                          backgroundColor: '#ffffff',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="waiting">অপেক্ষমান</option>
                        <option value="in_chamber">ডাক্তারের কক্ষে ডাকুন</option>
                        <option value="completed">চিকিৎসা সম্পন্ন</option>
                        <option value="cancelled">সিরিয়াল বাতিল</option>
                      </select>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Manual Walk-in Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            width: '100%',
            maxWidth: '500px',
            padding: '26px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#073A4B', marginBottom: '16px' }}>
              চেম্বারে সরাসরি আসা রোগী এন্ট্রি (Walk-in Serial)
            </h3>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  রোগীর নাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মো. কামরুল হাসান"
                  value={newPatient.patientName}
                  onChange={(e) => setNewPatient({ ...newPatient, patientName: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  মোবাইল নম্বর *
                </label>
                <input
                  type="text"
                  required
                  placeholder="০১৭xxxxxxxx"
                  value={newPatient.patientPhone}
                  onChange={(e) => setNewPatient({ ...newPatient, patientPhone: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    বয়স
                  </label>
                  <input
                    type="number"
                    value={newPatient.patientAge}
                    onChange={(e) => setNewPatient({ ...newPatient, patientAge: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    লিঙ্গ
                  </label>
                  <select
                    value={newPatient.patientGender}
                    onChange={(e) => setNewPatient({ ...newPatient, patientGender: e.target.value as any })}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                  >
                    <option value="পুরুষ">পুরুষ</option>
                    <option value="মহিলা">মহিলা</option>
                    <option value="অন্যান্য">অন্যান্য</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  সমস্যার সংক্ষিপ্ত বিবরণ (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: তীব্র বুকে ব্যথা / ইমার্জেন্সি"
                  value={newPatient.problemDescription}
                  onChange={(e) => setNewPatient({ ...newPatient, problemDescription: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #CBD5E1' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '10px 18px', borderRadius: '8px', backgroundColor: '#F1F5F9', color: '#475569', fontWeight: 600 }}
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  style={{ padding: '10px 22px', borderRadius: '8px', backgroundColor: '#0D5C75', color: '#ffffff', fontWeight: 700 }}
                >
                  সিরিয়াল নিশ্চিত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
