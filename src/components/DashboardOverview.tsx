import { Users, Clock, CheckCircle2, DollarSign, Activity, Building, ArrowUpRight } from 'lucide-react';
import type { PatientAppointment, Chamber, Slot } from '../types';
import { toBengaliNumber, formatSerial } from '../utils/bengali';
import { LiveQueueBar } from './LiveQueueBar';

interface DashboardOverviewProps {
  appointments: PatientAppointment[];
  chambers: Chamber[];
  slots: Slot[];
  currentSerial: number;
  onCallNext: () => void;
  onCallPrev: () => void;
  onReset: () => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  appointments,
  slots,
  currentSerial,
  onCallNext,
  onCallPrev,
  onReset,
  onNavigateTab,
}) => {
  const totalBooked = appointments.length;
  const waitingCount = appointments.filter((a) => a.status === 'waiting').length;
  const completedCount = appointments.filter((a) => a.status === 'completed').length;
  const estimatedRevenue = completedCount * 800;

  const currentPatient = appointments.find((a) => a.serialNumber === currentSerial);
  const nextPatients = appointments
    .filter((a) => a.status === 'waiting' && a.serialNumber > currentSerial)
    .slice(0, 5);

  return (
    <div>
      {/* Live Queue Hero Bar */}
      <LiveQueueBar
        currentSerial={currentSerial}
        currentPatient={currentPatient}
        totalWaitingCount={waitingCount}
        onCallNext={onCallNext}
        onCallPrev={onCallPrev}
        onReset={onReset}
      />

      {/* KPI Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        {/* Total Booked */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>আজকের মোট বুকিং</span>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#E8F4F8', color: '#0D5C75' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#073A4B' }}>
            {toBengaliNumber(totalBooked)} <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B' }}>জন</span>
          </div>
          <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>মিলিসেকেন্ড FCFS ট্র্যাকিং</span>
        </div>

        {/* Waiting */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>অপেক্ষমান রোগী</span>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#FEF3C7', color: '#D97706' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#073A4B' }}>
            {toBengaliNumber(waitingCount)} <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B' }}>জন</span>
          </div>
          <span style={{ fontSize: '12px', color: '#D97706', fontWeight: 600 }}>চেম্বারে উপস্থিতির অপেক্ষায়</span>
        </div>

        {/* Completed */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>চিকিৎসা সম্পন্ন</span>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#DCFCE7', color: '#16A34A' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#073A4B' }}>
            {toBengaliNumber(completedCount)} <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B' }}>জন</span>
          </div>
          <span style={{ fontSize: '12px', color: '#16A34A', fontWeight: 600 }}>পরামর্শ প্রদান শেষ</span>
        </div>

        {/* Revenue */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: '20px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B' }}>আনুমানিক ফি কালেকশন</span>
            <div style={{ padding: '8px', borderRadius: '10px', backgroundColor: '#EDE9FE', color: '#7C3AED' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#073A4B' }}>
            ৳ {toBengaliNumber(estimatedRevenue.toLocaleString())}
          </div>
          <span style={{ fontSize: '12px', color: '#7C3AED', fontWeight: 600 }}>চেম্বার পরামর্শ ফি হিসাব</span>
        </div>
      </div>

      {/* Two Column Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        {/* Next Patients Queue */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          padding: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} color="#0D5C75" />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#073A4B', margin: 0 }}>
                পরবর্তী অপেক্ষমান রোগী তালিকা
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('roster')}
              style={{
                background: 'none',
                color: '#0D5C75',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>সম্পূর্ণ তালিকা</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          {nextPatients.length === 0 ? (
            <p style={{ color: '#94A3B8', fontSize: '14px', textAlign: 'center', padding: '24px 0' }}>
              এই মুহূর্তে কোনো অতিরিক্ত অপেক্ষমান রোগী নেই।
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {nextPatients.map((patient) => (
                <div
                  key={patient.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #EDF2F7'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      backgroundColor: '#E8F4F8',
                      color: '#0D5C75',
                      fontWeight: 800,
                      fontSize: '14px'
                    }}>
                      {formatSerial(patient.serialNumber)}
                    </span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>
                        {patient.patientName}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>
                        {patient.patientPhone} • {toBengaliNumber(patient.patientAge)} বছর ({patient.patientGender})
                      </div>
                    </div>
                  </div>

                  <span style={{
                    fontSize: '11px',
                    color: '#0D5C75',
                    backgroundColor: '#E8F4F8',
                    padding: '3px 8px',
                    borderRadius: '6px',
                    fontWeight: 600
                  }}>
                    {patient.slotTime}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chambers & Slots Live Overview */}
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '18px',
          padding: '24px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building size={18} color="#0D5C75" />
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#073A4B', margin: 0 }}>
                রংপুর চেম্বার ও স্লট পরিস্থিতি
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('limits')}
              style={{
                background: 'none',
                color: '#0D5C75',
                fontSize: '13px',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>লিমিট পরিবর্তন</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {slots.map((slot) => {
              const booked = appointments.filter((a) => a.slotId === slot.id && a.status !== 'cancelled').length;
              const limit = slot.defaultLimit;
              const isFull = booked >= limit;

              return (
                <div
                  key={slot.id}
                  style={{
                    padding: '14px',
                    borderRadius: '12px',
                    border: `1px solid ${isFull ? '#FECDD3' : '#E2E8F0'}`,
                    backgroundColor: isFull ? '#FFF1F2' : '#ffffff'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>
                      {slot.timeRange}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: isFull ? '#BE123C' : '#059669',
                      backgroundColor: isFull ? '#FFE4E6' : '#DCFCE7',
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}>
                      {isFull ? 'স্লট পূর্ণ (Locked)' : `খালি: ${toBengaliNumber(limit - booked)} জন`}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    {slot.chamberName} • বুকিং: {toBengaliNumber(booked)}/{toBengaliNumber(limit)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
