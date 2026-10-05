import { useState } from 'react';
import { ShieldCheck, Save } from 'lucide-react';
import type { DoctorProfile } from '../types';

interface ProfileTabProps {
  doctor: DoctorProfile;
  onUpdateDoctor: (updated: DoctorProfile) => void;
  noticeText: string;
  onUpdateNotice: (notice: string) => void;
  isDoctorOnLeave: boolean;
  onToggleLeave: (leave: boolean) => void;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  doctor,
  onUpdateDoctor,
  noticeText,
  onUpdateNotice,
  isDoctorOnLeave,
  onToggleLeave,
}) => {
  const [formData, setFormData] = useState<DoctorProfile>(doctor);
  const [currentNotice, setCurrentNotice] = useState(noticeText);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateDoctor(formData);
    onUpdateNotice(currentNotice);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#073A4B', margin: 0 }}>
          ডাক্তারের প্রোফাইল ও চেম্বার সেটিংস
        </h2>
        <p style={{ fontSize: '14px', color: '#64748B', margin: '4px 0 0 0' }}>
          ডা. হরিপদ এর পরিচিতি, ডিগ্রি, জরুরি নোটিশ এবং ছুটির স্ট্যাটাস কনফিগার করুন।
        </p>
      </div>

      {savedSuccess && (
        <div style={{
          backgroundColor: '#DCFCE7',
          color: '#15803D',
          padding: '12px 18px',
          borderRadius: '12px',
          fontWeight: 600,
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <ShieldCheck size={20} />
          <span>সকল তথ্য সফলভাবে সংরক্ষণ ও আপডেট করা হয়েছে!</span>
        </div>
      )}

      {/* Emergency Leave / Holiday Switch */}
      <div style={{
        backgroundColor: isDoctorOnLeave ? '#FFE4E6' : '#ffffff',
        borderRadius: '16px',
        padding: '20px 24px',
        border: `1.5px solid ${isDoctorOnLeave ? '#FECDD3' : '#E2E8F0'}`,
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <h4 style={{ fontSize: '16px', fontWeight: 700, color: isDoctorOnLeave ? '#BE123C' : '#073A4B', margin: 0 }}>
            {isDoctorOnLeave ? '🚨 ডাক্তার বর্তমানে ছুটিতে আছেন (চেম্বার বন্ধ)' : 'ডাক্তার নিয়মিত চেম্বারে উপস্থিত আছেন'}
          </h4>
          <p style={{ fontSize: '13px', color: '#64748B', margin: '4px 0 0 0' }}>
            জরুরি প্রয়োজনে বা ছুটিতে থাকলে এটি অন করুন, তাহলে রোগী অ্যাপে নতুন সিরিয়াল বুকিং বন্ধ থাকবে।
          </p>
        </div>
        <button
          type="button"
          onClick={() => onToggleLeave(!isDoctorOnLeave)}
          style={{
            backgroundColor: isDoctorOnLeave ? '#E11D48' : '#0D5C75',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: '20px',
            fontWeight: 700,
            fontSize: '13px'
          }}
        >
          {isDoctorOnLeave ? 'ছুটি বাতিল করুন (চেম্বার চালু)' : 'ছুটি সক্রিয় করুন'}
        </button>
      </div>

      {/* Doctor Profile Form */}
      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#ffffff',
        borderRadius: '18px',
        padding: '24px 28px',
        border: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {/* Name */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
              ডাক্তারের পূর্ণ নাম (বাংলা)
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
              ইংরেজি নাম
            </label>
            <input
              type="text"
              value={formData.englishName}
              onChange={(e) => setFormData({ ...formData, englishName: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
            />
          </div>
        </div>

        {/* Title & Degrees */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
            বিশেষজ্ঞ পদবি ও স্পেশালিটি
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
          />
        </div>

        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
            ডিগ্রিসমূহ
          </label>
          <input
            type="text"
            value={formData.degrees}
            onChange={(e) => setFormData({ ...formData, degrees: e.target.value })}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
              অভিজ্ঞতা
            </label>
            <input
              type="text"
              value={formData.experience}
              onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
              সহকারী হেল্পলাইন
            </label>
            <input
              type="text"
              value={formData.helpline}
              onChange={(e) => setFormData({ ...formData, helpline: e.target.value })}
              style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
            />
          </div>
        </div>

        {/* Bio */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
            ডাক্তার সম্পর্কে সংক্ষিপ্ত পরিচিতি (Bio)
          </label>
          <textarea
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
          />
        </div>

        {/* Chamber Notice for Patients */}
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
            চেম্বার নোটিশ বোর্ড (রোগীদের অ্যাপে দেখানোর জন্য বার্তা)
          </label>
          <input
            type="text"
            placeholder="যেমন: জরুরি অপারেশনের জন্য আজ বিকাল ৪:৩০ টায় রোগী দেখা শুরু হবে।"
            value={currentNotice}
            onChange={(e) => setCurrentNotice(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #CBD5E1', fontSize: '14px' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button
            type="submit"
            style={{
              backgroundColor: '#0D5C75',
              color: '#ffffff',
              padding: '12px 28px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(13, 92, 117, 0.2)'
            }}
          >
            <Save size={18} />
            <span>প্রোফাইল আপডেট করুন</span>
          </button>
        </div>
      </form>
    </div>
  );
};
