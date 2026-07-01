import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  currentUser?: string;
  isAdmin?: boolean;
  isViewer?: boolean;
  onLogout: () => void;
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

export default function Sidebar({ activeTab, setActiveTab, currentUser, isAdmin, isViewer, onLogout }: SidebarProps) {
  const currentMenuItems = getMenuItems(!!isViewer);
  
  return (
    <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white flex flex-col">
      <div className="p-6 border-b border-blue-700">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center text-2xl font-bold">
            🏛️
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight">DRRM Resource</h1>
            <p className="text-blue-300 text-sm">Management System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {currentMenuItems.map((item, index) => {
            if ('divider' in item) {
              return <div key={index} className="h-px bg-blue-700 my-4" />;
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id!)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${activeTab === item.id
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'text-blue-100 hover:bg-blue-700/50'
                  }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t border-blue-700">
        <div className="bg-blue-700/50 rounded-lg p-4">
          <p className="text-sm text-blue-300">Logged in as:</p>
          <div className="flex justify-between items-center mt-1">
            <div>
              <p className="font-semibold capitalize leading-tight">{currentUser || 'Guest'}</p>
              <p className="text-xs text-blue-400 mt-0.5">
                {isViewer ? '👁️ Viewer' : isAdmin ? '🔴 PDRRMO Admin' : 'LGU User'}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors"
              title="Sign Out"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
