import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Users2, 
  ListOrdered, 
  Settings, 
  HeartPulse, 
  MapPin
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  todayPatientCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, todayPatientCount }) => {
  const navItems = [
    { id: 'dashboard', label: 'লাইভ ড্যাশবোর্ড ও কিউ', icon: LayoutDashboard },
    { id: 'chambers', label: 'চেম্বার ও সময়সূচী', icon: Building2 },
    { id: 'limits', label: 'দৈনিক রোগী লিমিট ও স্লট', icon: Users2 },
    { id: 'roster', label: 'সিরিয়াল তালিকা (FCFS)', icon: ListOrdered, badge: todayPatientCount },
    { id: 'profile', label: 'ডাক্তারের প্রোফাইল ও তথ্য', icon: Settings },
  ];

  return (
    <aside style={{
      width: '280px',
      backgroundColor: '#073A4B',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      boxShadow: '4px 0 15px rgba(0,0,0,0.05)',
      zIndex: 20
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '24px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          backgroundColor: '#E63946',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(230, 57, 70, 0.4)'
        }}>
          <HeartPulse size={26} color="#ffffff" />
        </div>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, letterSpacing: '0.3px' }}>
            ডা. হরিপদ
          </h2>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', margin: '2px 0 0 0' }}>
            চেম্বার অ্যাডমিন ও কন্ট্রোল
          </p>
        </div>
      </div>

      {/* Location Badge */}
      <div style={{ padding: '14px 20px 8px 20px' }}>
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.08)',
          borderRadius: '10px',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          color: '#93C5FD'
        }}>
          <MapPin size={14} color="#60A5FA" />
          <span>ধাপ মোড় ও জেল রোড, রংপুর</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '12px',
                backgroundColor: isActive ? '#0D5C75' : 'transparent',
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.75)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '14px',
                textAlign: 'left',
                border: 'none',
                position: 'relative',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Icon size={19} color={isActive ? '#38BDF8' : 'rgba(255,255,255,0.7)'} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge !== undefined && (
                <span style={{
                  backgroundColor: isActive ? '#E63946' : 'rgba(255,255,255,0.15)',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '10px'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer System Status */}
      <div style={{
        padding: '16px 20px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        fontSize: '12px',
        color: 'rgba(255,255,255,0.6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22C55E' }}></span>
          <span style={{ color: '#E2E8F0', fontWeight: 600 }}>লাইভ সিস্টেম সক্রিয়</span>
        </div>
        <p style={{ margin: 0, fontSize: '11px' }}>FCFS মিলিসেকেন্ড ল্যাচিং অন</p>
      </div>
    </aside>
  );
};
