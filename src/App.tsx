import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { ChambersTab } from './components/ChambersTab';
import { SlotLimitsTab } from './components/SlotLimitsTab';
import { RosterTab } from './components/RosterTab';
import { ProfileTab } from './components/ProfileTab';

import { 
  initialDoctorProfile, 
  initialChambers, 
  initialSlots, 
  initialAppointments 
} from './mockData';

import type { 
  PatientAppointment, 
  Chamber, 
  Slot, 
  DoctorProfile, 
  AppointmentStatus 
} from './types';

import { formatBengaliDate } from './utils/bengali';
import { Calendar, Megaphone } from 'lucide-react';
import { collection, onSnapshot, doc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

export function App() {
  // Load or fallback to initial data
  const [appointments, setAppointments] = useState<PatientAppointment[]>(() => {
    const saved = localStorage.getItem('dr_haripada_appointments');
    return saved ? JSON.parse(saved) : initialAppointments;
  });

  const [chambers, setChambers] = useState<Chamber[]>(() => {
    const saved = localStorage.getItem('dr_haripada_chambers');
    return saved ? JSON.parse(saved) : initialChambers;
  });

  const [slots, setSlots] = useState<Slot[]>(() => {
    const saved = localStorage.getItem('dr_haripada_slots');
    return saved ? JSON.parse(saved) : initialSlots;
  });

  const [doctor, setDoctor] = useState<DoctorProfile>(() => {
    const saved = localStorage.getItem('dr_haripada_profile');
    return saved ? JSON.parse(saved) : initialDoctorProfile;
  });

  const [customLimits, setCustomLimits] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('dr_haripada_limits');
    return saved ? JSON.parse(saved) : {};
  });

  const [currentSerial, setCurrentSerial] = useState<number>(3);
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isDoctorOnLeave, setIsDoctorOnLeave] = useState<boolean>(false);
  const [noticeText, setNoticeText] = useState<string>('চেম্বারে রোগী দেখা যথারীতি চলমান রয়েছে।');

  const todayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const [selectedDate, setSelectedDate] = useState<string>(todayStr());

  // Save to localStorage on changes
  useEffect(() => {
    localStorage.setItem('dr_haripada_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('dr_haripada_chambers', JSON.stringify(chambers));
  }, [chambers]);

  useEffect(() => {
    localStorage.setItem('dr_haripada_slots', JSON.stringify(slots));
  }, [slots]);

  useEffect(() => {
    localStorage.setItem('dr_haripada_profile', JSON.stringify(doctor));
  }, [doctor]);

  useEffect(() => {
    localStorage.setItem('dr_haripada_limits', JSON.stringify(customLimits));
  }, [customLimits]);

  // Real-time Cloud Firestore synchronization
  useEffect(() => {
    try {
      const unsubAppointments = onSnapshot(collection(db, 'appointments'), (snapshot) => {
        if (!snapshot.empty) {
          const remoteList: PatientAppointment[] = [];
          snapshot.forEach((docSnap) => {
            remoteList.push(docSnap.data() as PatientAppointment);
          });
          remoteList.sort((a, b) => new Date(a.bookedAt).getTime() - new Date(b.bookedAt).getTime());
          setAppointments(remoteList);
        }
      });

      const unsubQueue = onSnapshot(doc(db, 'settings', 'queue'), (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (typeof data.currentSerial === 'number') {
            setCurrentSerial(data.currentSerial);
          }
        }
      });

      const unsubLimits = onSnapshot(doc(db, 'settings', 'limits'), (docSnap) => {
        if (docSnap.exists()) {
          setCustomLimits(docSnap.data() as Record<string, number>);
        }
      });

      return () => {
        unsubAppointments();
        unsubQueue();
        unsubLimits();
      };
    } catch (e) {
      console.warn('Firestore subscription:', e);
    }
  }, []);

  // Queue actions
  const handleCallNext = () => {
    const nextSerial = currentSerial + 1;
    setCurrentSerial(nextSerial);

    // Update Firestore queue setting
    setDoc(doc(db, 'settings', 'queue'), { currentSerial: nextSerial }, { merge: true }).catch(console.error);

    // Update appointment status: current to completed, next to in_chamber
    setAppointments((prev) =>
      prev.map((apt) => {
        if (apt.dateKey === selectedDate) {
          if (apt.serialNumber === currentSerial) {
            updateDoc(doc(db, 'appointments', apt.id), { status: 'completed' }).catch(() => {});
            return { ...apt, status: 'completed' };
          }
          if (apt.serialNumber === nextSerial) {
            updateDoc(doc(db, 'appointments', apt.id), { status: 'in_chamber' }).catch(() => {});
            return { ...apt, status: 'in_chamber' };
          }
        }
        return apt;
      })
    );
  };

  const handleCallPrev = () => {
    if (currentSerial > 1) {
      const prevSerial = currentSerial - 1;
      setCurrentSerial(prevSerial);
      setDoc(doc(db, 'settings', 'queue'), { currentSerial: prevSerial }, { merge: true }).catch(console.error);
    }
  };

  const handleResetSerial = () => {
    setCurrentSerial(1);
    setDoc(doc(db, 'settings', 'queue'), { currentSerial: 1 }, { merge: true }).catch(console.error);
  };

  // Limit action
  const handleUpdateLimit = (slotId: string, newLimit: number) => {
    const key = `${selectedDate}_${slotId}`;
    setCustomLimits((prev) => ({ ...prev, [key]: newLimit }));
    setDoc(doc(db, 'settings', 'limits'), { [key]: newLimit }, { merge: true }).catch(console.error);
  };

  const handleToggleSlot = (slotId: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === slotId ? { ...s, isActive: !s.isActive } : s))
    );
  };

  const handleUpdateStatus = (appointmentId: string, newStatus: AppointmentStatus) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === appointmentId ? { ...a, status: newStatus } : a))
    );
    updateDoc(doc(db, 'appointments', appointmentId), { status: newStatus }).catch(console.error);
  };

  const handleAddWalkInPatient = (newPatient: Omit<PatientAppointment, 'id' | 'tokenCode' | 'bookedAt'>) => {
    const now = new Date();
    const token = `HP-${selectedDate.replace(/-/g, '')}-${String(newPatient.serialNumber).padStart(3, '0')}`;
    const added: PatientAppointment = {
      ...newPatient,
      id: `apt_${Date.now()}`,
      tokenCode: token,
      bookedAt: now.toISOString(),
    };
    setAppointments((prev) => [...prev, added]);
    setDoc(doc(db, 'appointments', added.id), added).catch(console.error);
  };

  const getBookedCountForSlot = (slotId: string) => {
    return appointments.filter(
      (a) => a.dateKey === selectedDate && a.slotId === slotId && a.status !== 'cancelled'
    ).length;
  };

  const appointmentsForSelectedDate = appointments.filter((a) => a.dateKey === selectedDate);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F5F8FB' }}>
      {/* 1. Left Sidebar */}
      <div className="no-print">
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          todayPatientCount={appointmentsForSelectedDate.length}
        />
      </div>

      {/* 2. Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <header className="no-print" style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #E2E8F0',
          padding: '16px 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div>
            <h1 style={{ fontSize: '19px', fontWeight: 800, color: '#073A4B', margin: 0 }}>
              {doctor.name} - চেম্বার অ্যাডমিন কন্ট্রোল সিস্টেম
            </h1>
            <p style={{ fontSize: '12.5px', color: '#64748B', margin: '2px 0 0 0' }}>
              {doctor.title} • রংপুর
            </p>
          </div>

          {/* Quick Info & Notice Banner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {isDoctorOnLeave ? (
              <div style={{
                backgroundColor: '#FFE4E6',
                color: '#BE123C',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#E11D48' }}></span>
                <span>ডাক্তার আজ ছুটিতে আছেন</span>
              </div>
            ) : (
              <div style={{
                backgroundColor: '#E8F4F8',
                color: '#0D5C75',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Calendar size={14} />
                <span>{formatBengaliDate(selectedDate)}</span>
              </div>
            )}

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              paddingLeft: '16px',
              borderLeft: '1px solid #E2E8F0'
            }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                backgroundColor: '#0D5C75',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '14px'
              }}>
                ডাঃ
              </div>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', display: 'block' }}>
                  চেম্বার সহকারী
                </span>
                <span style={{ fontSize: '11px', color: '#16A34A', fontWeight: 600 }}>
                  ● লাইভ কানেক্টেড
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Notice Strip */}
        {noticeText && (
          <div className="no-print" style={{
            backgroundColor: '#073A4B',
            color: '#E0F2FE',
            padding: '8px 32px',
            fontSize: '12.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Megaphone size={14} color="#38BDF8" />
            <span style={{ fontWeight: 600, color: '#38BDF8' }}>চেম্বার বার্তা:</span>
            <span>{noticeText}</span>
          </div>
        )}

        {/* Tab Content View */}
        <main style={{ flex: 1, padding: '28px 32px' }}>
          {currentTab === 'dashboard' && (
            <DashboardOverview
              appointments={appointmentsForSelectedDate}
              chambers={chambers}
              slots={slots}
              currentSerial={currentSerial}
              onCallNext={handleCallNext}
              onCallPrev={handleCallPrev}
              onReset={handleResetSerial}
              onNavigateTab={setCurrentTab}
            />
          )}

          {currentTab === 'chambers' && (
            <ChambersTab
              chambers={chambers}
              onUpdateChambers={setChambers}
            />
          )}

          {currentTab === 'limits' && (
            <SlotLimitsTab
              slots={slots}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              customLimits={customLimits}
              onUpdateLimit={handleUpdateLimit}
              getBookedCount={getBookedCountForSlot}
              onToggleSlot={handleToggleSlot}
            />
          )}

          {currentTab === 'roster' && (
            <RosterTab
              appointments={appointmentsForSelectedDate}
              selectedDate={selectedDate}
              onUpdateStatus={handleUpdateStatus}
              onAddWalkInPatient={handleAddWalkInPatient}
            />
          )}

          {currentTab === 'profile' && (
            <ProfileTab
              doctor={doctor}
              onUpdateDoctor={setDoctor}
              noticeText={noticeText}
              onUpdateNotice={setNoticeText}
              isDoctorOnLeave={isDoctorOnLeave}
              onToggleLeave={setIsDoctorOnLeave}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
