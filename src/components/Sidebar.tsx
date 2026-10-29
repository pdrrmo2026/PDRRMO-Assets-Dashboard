import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  currentUser?: string;
  isAdmin?: boolean;
  isViewer?: boolean;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const getMenuItems = (isViewer: boolean) => {
  const baseItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: '📊' },
    { id: 'gis-map' as TabType, label: 'GIS Map', icon: '🗺️' },
    { id: 'agency-downloads' as TabType, label: 'Downloads', icon: '📥' },
    { divider: true },
  ];

  const dataEntryItems = isViewer ? [] : [
    { id: 'equipment-form' as TabType, label: 'Add Equipment', icon: '🔧', section: 'Data Entry' },
    { id: 'vehicle-form' as TabType, label: 'Add Vehicle', icon: '🚗', section: 'Data Entry' },
    { id: 'personnel-form' as TabType, label: 'Add Personnel', icon: '👤', section: 'Data Entry' },
    { id: 'acdv-form' as TabType, label: 'Registered ACDV', icon: '🤝', section: 'Data Entry' },
    { divider: true },
  ];

  const recordItems = [
    { id: 'equipment-list' as TabType, label: 'Equipment List', icon: '📋', section: 'Records' },
    { id: 'vehicle-list' as TabType, label: 'Vehicle List', icon: '🚛', section: 'Records' },
    { id: 'personnel-list' as TabType, label: 'Personnel List', icon: '👥', section: 'Records' },
    { id: 'acdv-list' as TabType, label: 'ACDV Registry', icon: '📜', section: 'Records' },
  ];

  return [...baseItems, ...dataEntryItems, ...recordItems];
};

export default function Sidebar({ activeTab, setActiveTab, currentUser, isAdmin, isViewer, onLogout, isOpen, onClose }: SidebarProps) {
  const currentMenuItems = getMenuItems(!!isViewer);

  const activeStyle: React.CSSProperties = {
    backgroundColor: '#f97316',
    color: '#ffffff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.2)',
  };

  const inactiveStyle: React.CSSProperties = {
    color: '#bfdbfe',
    backgroundColor: 'transparent',
  };

  return (
    <aside className={`sidebar${isOpen ? ' open' : ''}`}>
      {/* Close button (mobile only) */}
      <button
        onClick={onClose}
        style={{
          display: 'none',
          position: 'absolute',
          top: '12px',
          right: '12px',
          background: 'rgba(255,255,255,0.15)',
          border: 'none',
          color: '#fff',
          borderRadius: '6px',
          width: '32px',
          height: '32px',
          fontSize: '18px',
          cursor: 'pointer',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        className="sidebar-close-btn"
        aria-label="Close menu"
      >
        ✕
      </button>

      {/* Header */}
      <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '48px', height: '48px', minWidth: '48px',
            backgroundColor: '#f97316', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '24px', fontWeight: 'bold',
          }}>
            🏛️
          </div>
          <div>
            <h1 style={{ fontWeight: 'bold', fontSize: '17px', lineHeight: '1.2', margin: 0, color: '#fff' }}>DRRM Resource</h1>
            <p style={{ color: '#93c5fd', fontSize: '13px', margin: 0 }}>Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px', overflowY: 'auto', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {currentMenuItems.map((item, index) => {
            if ('divider' in item) {
              return <div key={index} style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.15)', margin: '8px 0' }} />;
            }

            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id!)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                  WebkitTapHighlightColor: 'transparent',
                  ...(isActive ? activeStyle : inactiveStyle),
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'rgba(255,255,255,0.15)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                }}
              >
                <span style={{ fontSize: '18px', minWidth: '22px', textAlign: 'center' }}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* User info + logout */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '8px', padding: '12px' }}>
          <p style={{ fontSize: '12px', color: '#93c5fd', margin: '0 0 4px 0' }}>Logged in as:</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontWeight: '600', margin: 0, color: '#fff', textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {currentUser || 'Guest'}
              </p>
              <p style={{ fontSize: '11px', color: '#7dd3fc', margin: '2px 0 0 0' }}>
                {isViewer ? '👁️ Viewer' : isAdmin ? '🔴 PDRRMO Admin' : 'LGU User'}
              </p>
            </div>
            <button
              onClick={onLogout}
              style={{
                fontSize: '12px', backgroundColor: '#ef4444', color: '#ffffff',
                padding: '4px 10px', borderRadius: '6px', border: 'none',
                cursor: 'pointer', whiteSpace: 'nowrap', fontWeight: '500',
                flexShrink: 0,
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-close-btn {
            display: flex !important;
          }
        }
      `}</style>
    </aside>
  );
}
