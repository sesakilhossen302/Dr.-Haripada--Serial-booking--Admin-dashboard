import { useState } from 'react';
import { Building2, MapPin, Clock, Phone, Plus, CheckCircle2, XCircle, Edit3, DollarSign, Calendar } from 'lucide-react';
import type { Chamber } from '../types';

interface ChambersTabProps {
  chambers: Chamber[];
  onUpdateChambers: (chambers: Chamber[]) => void;
}

export const ChambersTab: React.FC<ChambersTabProps> = ({ chambers, onUpdateChambers }) => {
  const [editingChamber, setEditingChamber] = useState<Chamber | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState<Partial<Chamber>>({
    name: '',
    location: '',
    contactNumber: '',
    visitingDays: 'শনিবার - বৃহস্পতিবার',
    visitingHours: 'বিকাল ৪:০০ টা - সন্ধ্যা ৬:৩০ টা',
    consultationFee: '৳ ৮০০',
    followUpFee: '৳ ৫০০',
    isActive: true,
  });

  const toggleStatus = (id: string) => {
    const updated = chambers.map((c) =>
      c.id === id ? { ...c, isActive: !c.isActive } : c
    );
    onUpdateChambers(updated);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.location) return;

    if (editingChamber) {
      const updated = chambers.map((c) =>
        c.id === editingChamber.id ? { ...c, ...formData } as Chamber : c
      );
      onUpdateChambers(updated);
      setEditingChamber(null);
    } else {
      const newChamber: Chamber = {
        id: `chamber_${Date.now()}`,
        name: formData.name!,
        location: formData.location!,
        contactNumber: formData.contactNumber || '০১৭০০-০০০০০০',
        visitingDays: formData.visitingDays || 'শনিবার - বৃহস্পতিবার',
        visitingHours: formData.visitingHours || 'বিকাল ৪:০০ টা – রাত ৯:০০ টা',
        consultationFee: formData.consultationFee || '৳ ৮০০',
        followUpFee: formData.followUpFee || '৳ ৫০০',
        isActive: formData.isActive ?? true,
      };
      onUpdateChambers([...chambers, newChamber]);
      setShowAddModal(false);
    }
  };

  const startEdit = (chamber: Chamber) => {
    setEditingChamber(chamber);
    setFormData(chamber);
    setShowAddModal(true);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#073A4B', margin: 0 }}>
            চেম্বার ও সময়সূচী নিয়ন্ত্রণ
          </h2>
          <p style={{ fontSize: '14px', color: '#64748B', margin: '4px 0 0 0' }}>
            ডা. হরিপদ রংপুর শহরের কোন হাসপাতালে কোন সময়ে রোগী দেখবেন তা এখান থেকে সম্পূর্ণ নিয়ন্ত্রণ করুন।
          </p>
        </div>
        <button
          onClick={() => {
            setEditingChamber(null);
            setFormData({
              name: '',
              location: '',
              contactNumber: '',
              visitingDays: 'শনিবার - বৃহস্পতিবার',
              visitingHours: 'বিকাল ৪:০০ টা - সন্ধ্যা ৬:৩০ টা',
              consultationFee: '৳ ৮০০',
              followUpFee: '৳ ৫০০',
              isActive: true,
            });
            setShowAddModal(true);
          }}
          style={{
            backgroundColor: '#0D5C75',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontWeight: 600,
            fontSize: '14px',
            boxShadow: '0 4px 12px rgba(13, 92, 117, 0.2)'
          }}
        >
          <Plus size={18} />
          <span>নতুন চেম্বার যোগ করুন</span>
        </button>
      </div>

      {/* Chamber Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
        {chambers.map((chamber) => (
          <div
            key={chamber.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '18px',
              padding: '24px',
              border: `1.5px solid ${chamber.isActive ? '#E2E8F0' : '#FECDD3'}`,
              boxShadow: '0 4px 16px rgba(0,0,0,0.03)',
              position: 'relative',
              opacity: chamber.isActive ? 1 : 0.85
            }}
          >
            {/* Top Row: Name & Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: chamber.isActive ? '#E8F4F8' : '#FFE4E6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: chamber.isActive ? '#0D5C75' : '#E11D48'
                }}>
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#073A4B', margin: 0 }}>
                    {chamber.name}
                  </h3>
                  <span style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: chamber.isActive ? '#059669' : '#DC2626',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    marginTop: '2px'
                  }}>
                    {chamber.isActive ? <CheckCircle2 size={13} /> : <XCircle size={13} />}
                    {chamber.isActive ? 'রোগী দেখা সক্রিয় (Open)' : 'আজ বন্ধ রাখা হয়েছে (Closed)'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => startEdit(chamber)}
                style={{
                  backgroundColor: '#F1F5F9',
                  color: '#475569',
                  padding: '8px',
                  borderRadius: '10px',
                }}
                title="চেম্বার এডিট করুন"
              >
                <Edit3 size={16} />
              </button>
            </div>

            {/* Details List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: '#475569' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <MapPin size={16} color="#0D5C75" />
                <span>{chamber.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={16} color="#0D5C75" />
                <span style={{ fontWeight: 600, color: '#0F172A' }}>{chamber.visitingHours}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={16} color="#0D5C75" />
                <span>ভিজিটিং দিন: {chamber.visitingDays}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="#0D5C75" />
                <span>সহকারী হেল্পলাইন: {chamber.contactNumber}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <DollarSign size={16} color="#0D5C75" />
                <span>নতুন ফি: <strong>{chamber.consultationFee}</strong> • ফলো-আপ: <strong>{chamber.followUpFee}</strong></span>
              </div>
            </div>

            {/* Action Bar */}
            <div style={{
              marginTop: '18px',
              paddingTop: '16px',
              borderTop: '1px solid #F1F5F9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '12px', color: '#64748B' }}>
                চেম্বার স্ট্যাটাস পরিবর্তন:
              </span>
              <button
                onClick={() => toggleStatus(chamber.id)}
                style={{
                  backgroundColor: chamber.isActive ? '#FFE4E6' : '#DCFCE7',
                  color: chamber.isActive ? '#BE123C' : '#15803D',
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                {chamber.isActive ? 'আজকের জন্য বন্ধ করুন' : 'পুনরায় চালু করুন'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Chamber Modal */}
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
            maxWidth: '520px',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#073A4B', marginBottom: '16px' }}>
              {editingChamber ? 'চেম্বার তথ্য আপডেট করুন' : 'নতুন চেম্বার যুক্ত করুন'}
            </h3>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  হাসপাতাল / চেম্বারের নাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: সেন্ট্রাল স্পেশালাইজড হাসপাতাল"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  চেম্বারের অবস্থান ও ঠিকানা *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: ধাপ মোড়, জেল রোড, রংপুর"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    ভিজিটিং সময় *
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: বিকাল ৪:০০ - ৬:৩০"
                    value={formData.visitingHours || ''}
                    onChange={(e) => setFormData({ ...formData, visitingHours: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    ভিজিটের দিন *
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: শনি - বৃহস্পতি"
                    value={formData.visitingDays || ''}
                    onChange={(e) => setFormData({ ...formData, visitingDays: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    পরামর্শ ফি (নতুন)
                  </label>
                  <input
                    type="text"
                    value={formData.consultationFee || '৳ ৮০০'}
                    onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '14px'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    মোবাইল নম্বর
                  </label>
                  <input
                    type="text"
                    placeholder="০১৭xxxxxxxx"
                    value={formData.contactNumber || ''}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      fontSize: '14px'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: '10px',
                    backgroundColor: '#F1F5F9',
                    color: '#475569',
                    fontWeight: 600
                  }}
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 22px',
                    borderRadius: '10px',
                    backgroundColor: '#0D5C75',
                    color: '#ffffff',
                    fontWeight: 700
                  }}
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
