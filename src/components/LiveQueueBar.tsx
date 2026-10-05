import { Megaphone, ArrowRight, RotateCcw } from 'lucide-react';
import type { PatientAppointment } from '../types';
import { formatSerial, toBengaliNumber } from '../utils/bengali';

interface LiveQueueBarProps {
  currentSerial: number;
  currentPatient?: PatientAppointment;
  totalWaitingCount: number;
  onCallNext: () => void;
  onCallPrev: () => void;
  onReset: () => void;
}

export const LiveQueueBar: React.FC<LiveQueueBarProps> = ({
  currentSerial,
  currentPatient,
  totalWaitingCount,
  onCallNext,
  onCallPrev,
  onReset,
}) => {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #073A4B 0%, #0D5C75 100%)',
      borderRadius: '20px',
      padding: '24px 28px',
      color: '#ffffff',
      boxShadow: '0 8px 24px rgba(7, 58, 75, 0.25)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '24px',
      flexWrap: 'wrap',
      marginBottom: '28px'
    }}>
      {/* Left: Current Running Serial Callout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          width: '74px',
          height: '74px',
          borderRadius: '18px',
          backgroundColor: '#ffffff',
          color: '#073A4B',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
          border: '3px solid #38BDF8'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase' }}>
            সিরিয়াল
          </span>
          <span style={{ fontSize: '32px', fontWeight: 900, lineHeight: 1 }}>
            {formatSerial(currentSerial)}
          </span>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: '#22C55E',
              display: 'inline-block',
              animation: 'pulse-ring 1.8s infinite'
            }}></span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#38BDF8', letterSpacing: '0.5px' }}>
              বর্তমানে ডাক্তারের কক্ষে চিকিৎসাধীন
            </span>
          </div>
          {currentPatient ? (
            <div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, margin: 0 }}>
                {currentPatient.patientName}
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', margin: '2px 0 0 0' }}>
                {currentPatient.patientPhone} • বয়স: {toBengaliNumber(currentPatient.patientAge)} বছর ({currentPatient.patientGender}) • সমস্যা: {currentPatient.problemDescription || 'নিয়মিত চেকআপ'}
              </p>
            </div>
          ) : (
            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>
              চেম্বারের সিরিয়াল প্রস্তুত। পরবর্তী রোগীকে ডাকতে ডানের বাটনে চাপুন।
            </p>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.12)',
          borderRadius: '12px',
          padding: '10px 16px',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', display: 'block' }}>
            অপেক্ষমান রোগী
          </span>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#FDE047' }}>
            {toBengaliNumber(totalWaitingCount)} জন
          </span>
        </div>

        <button
          onClick={onCallPrev}
          disabled={currentSerial <= 1}
          style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            color: '#ffffff',
            padding: '12px 14px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontWeight: 600,
            fontSize: '13px',
            opacity: currentSerial <= 1 ? 0.4 : 1,
            cursor: currentSerial <= 1 ? 'not-allowed' : 'pointer'
          }}
          title="পূর্ববর্তী সিরিয়াল"
        >
          পূর্বের (-১)
        </button>

        <button
          onClick={onCallNext}
          style={{
            backgroundColor: '#ffffff',
            color: '#073A4B',
            padding: '12px 22px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 800,
            fontSize: '15px',
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            transform: 'scale(1)',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Megaphone size={18} color="#0D5C75" />
          <span>পরবর্তী রোগী ডাকুন (+১)</span>
          <ArrowRight size={16} />
        </button>

        <button
          onClick={onReset}
          style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.7)',
            padding: '12px',
            borderRadius: '12px',
          }}
          title="সিরিয়াল ০১ এ রিসেট করুন"
        >
          <RotateCcw size={16} />
        </button>
      </div>
    </div>
  );
};
