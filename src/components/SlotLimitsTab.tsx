import { useState } from 'react';
import { CheckCircle, Lock, Unlock, Calendar, SlidersHorizontal } from 'lucide-react';
import type { Slot } from '../types';
import { toBengaliNumber, formatBengaliDate } from '../utils/bengali';

interface SlotLimitsTabProps {
  slots: Slot[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  customLimits: Record<string, number>;
  onUpdateLimit: (slotId: string, newLimit: number) => void;
  getBookedCount: (slotId: string) => number;
  onToggleSlot: (slotId: string) => void;
}

export const SlotLimitsTab: React.FC<SlotLimitsTabProps> = ({
  slots,
  selectedDate,
  onSelectDate,
  customLimits,
  onUpdateLimit,
  getBookedCount,
  onToggleSlot,
}) => {
  const [editingSlotId, setEditingSlotId] = useState<string | null>(null);
  const [tempLimit, setTempLimit] = useState<number>(20);

  const getLimitForSlot = (slot: Slot) => {
    const key = `${selectedDate}_${slot.id}`;
    return customLimits[key] ?? slot.defaultLimit;
  };

  const startEdit = (slot: Slot) => {
    setEditingSlotId(slot.id);
    setTempLimit(getLimitForSlot(slot));
  };

  const saveLimit = (slotId: string) => {
    onUpdateLimit(slotId, tempLimit);
    setEditingSlotId(null);
  };

  return (
    <div>
      {/* Header & Date Controller */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#073A4B', margin: 0 }}>
            দৈনিক রোগী লিমিট ও স্লট কোটা নিয়ন্ত্রণ
          </h2>
          <p style={{ fontSize: '14px', color: '#64748B', margin: '4px 0 0 0' }}>
            ডাক্তার প্রতি স্লটে বা দিনে ঠিক কতজন রোগী দেখবেন তা নির্ধারণ করুন। নির্ধারিত সংখ্যা পূর্ণ হলে অ্যাপে স্লট স্বয়ংক্রিয়ভাবে লক হয়ে যাবে।
          </p>
        </div>

        {/* Date Picker Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: '#ffffff',
          padding: '8px 16px',
          borderRadius: '14px',
          border: '1px solid #CBD5E1',
          boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
        }}>
          <Calendar size={18} color="#0D5C75" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>তারিখ:</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onSelectDate(e.target.value)}
            style={{
              border: 'none',
              fontSize: '14px',
              fontWeight: 600,
              color: '#073A4B',
              cursor: 'pointer'
            }}
          />
        </div>
      </div>

      {/* Date Banner */}
      <div style={{
        backgroundColor: '#E8F4F8',
        borderRadius: '12px',
        padding: '12px 18px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0D5C75', fontWeight: 600 }}>
          <CheckCircle size={18} />
          <span>নির্বাচিত কর্মদিবস: {formatBengaliDate(selectedDate)}</span>
        </div>
        <span style={{ fontSize: '12px', color: '#073A4B', fontWeight: 500 }}>
          ⚡ লিমিট পরিবর্তনের সাথে সাথে রোগীর মোবাইল অ্যাপে লাইভ আপডেট প্রতিফলিত হবে
        </span>
      </div>

      {/* Slots List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {slots.map((slot) => {
          const booked = getBookedCount(slot.id);
          const limit = getLimitForSlot(slot);
          const remaining = limit - booked;
          const isFull = booked >= limit;
          const percentage = Math.min(100, Math.round((booked / limit) * 100));

          return (
            <div
              key={slot.id}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                padding: '20px 24px',
                border: `1.5px solid ${isFull ? '#FECDD3' : '#E2E8F0'}`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px',
                marginBottom: '14px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#073A4B', margin: 0 }}>
                      {slot.timeRange}
                    </h3>
                    <span style={{ fontSize: '13px', color: '#64748B' }}>
                      ({slot.chamberName})
                    </span>
                    {isFull ? (
                      <span style={{
                        backgroundColor: '#FFE4E6',
                        color: '#BE123C',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 700
                      }}>
                        🔒 আজকের বুকিং পূর্ণ (Full)
                      </span>
                    ) : (
                      <span style={{
                        backgroundColor: '#DCFCE7',
                        color: '#15803D',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 700
                      }}>
                        সক্রিয় বুকিং
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={() => startEdit(slot)}
                    style={{
                      backgroundColor: '#E8F4F8',
                      color: '#0D5C75',
                      padding: '8px 16px',
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <SlidersHorizontal size={15} />
                    <span>লিমিট পরিবর্তন</span>
                  </button>

                  <button
                    onClick={() => onToggleSlot(slot.id)}
                    style={{
                      backgroundColor: slot.isActive ? '#FEE2E2' : '#E0E7FF',
                      color: slot.isActive ? '#991B1B' : '#3730A3',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontWeight: 600,
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {slot.isActive ? <Lock size={14} /> : <Unlock size={14} />}
                    <span>{slot.isActive ? 'স্লট বন্ধ করুন' : 'স্লট খুলুন'}</span>
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: '10px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '13px',
                  fontWeight: 600,
                  marginBottom: '6px'
                }}>
                  <span style={{ color: '#334155' }}>
                    বুকিং অগ্রগতি: {toBengaliNumber(booked)} / {toBengaliNumber(limit)} জন রোগী ({toBengaliNumber(percentage)}%)
                  </span>
                  <span style={{ color: remaining > 5 ? '#059669' : (remaining > 0 ? '#D97706' : '#DC2626') }}>
                    {remaining > 0 ? `অবশিষ্ট সিট: ${toBengaliNumber(remaining)} জন` : 'কোনো আসন খালি নেই'}
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '10px',
                  backgroundColor: '#F1F5F9',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    backgroundColor: isFull ? '#E63946' : (percentage > 75 ? '#F4A261' : '#2A9D8F'),
                    borderRadius: '10px',
                    transition: 'width 0.3s ease'
                  }}></div>
                </div>
              </div>

              {/* In-line Quick Editor */}
              {editingSlotId === slot.id && (
                <div style={{
                  marginTop: '16px',
                  padding: '16px',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '12px',
                  border: '1px solid #CBD5E1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                    সর্বোচ্চ রোগী সংখ্যা সেট করুন:
                  </span>
                  <input
                    type="number"
                    value={tempLimit}
                    onChange={(e) => setTempLimit(Number(e.target.value))}
                    min={1}
                    max={200}
                    style={{
                      width: '90px',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1.5px solid #0D5C75',
                      fontWeight: 700,
                      fontSize: '15px',
                      textAlign: 'center'
                    }}
                  />
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[15, 20, 25, 30, 50, 100].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setTempLimit(preset)}
                        style={{
                          padding: '6px 10px',
                          borderRadius: '8px',
                          backgroundColor: tempLimit === preset ? '#0D5C75' : '#ffffff',
                          color: tempLimit === preset ? '#ffffff' : '#334155',
                          border: '1px solid #CBD5E1',
                          fontSize: '12px',
                          fontWeight: 600
                        }}
                      >
                        {toBengaliNumber(preset)} জন
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => saveLimit(slot.id)}
                    style={{
                      backgroundColor: '#2A9D8F',
                      color: '#ffffff',
                      padding: '8px 18px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '13px'
                    }}
                  >
                    আপডেট করুন
                  </button>
                  <button
                    onClick={() => setEditingSlotId(null)}
                    style={{
                      backgroundColor: 'transparent',
                      color: '#64748B',
                      padding: '8px 12px',
                      fontWeight: 600,
                      fontSize: '13px'
                    }}
                  >
                    বাতিল
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
