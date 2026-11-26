import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import EquipmentForm from './components/EquipmentForm';
import VehicleForm from './components/VehicleForm';
import PersonnelForm from './components/PersonnelForm';
import ResourceList, { PasswordModal } from './components/ResourceList';
import GISMap from './components/GISMap';
import AgencyDownloads from './components/AgencyDownloads';
import ACDVForm from './components/ACDVForm';
import ACDVList from './components/ACDVList';
import Login from './components/Login';
import { Equipment, Vehicle, Personnel, ACDV, TabType, LGUCode } from './types';
import {
  fetchEquipment, insertEquipment, updateEquipmentInDB, deleteEquipment,
  fetchVehicles, insertVehicle, updateVehicleInDB, deleteVehicle,
  fetchPersonnel, insertPersonnel, updatePersonnelInDB, deletePersonnel,
  fetchACDV, insertACDV, updateACDVInDB, deleteACDV,
} from './lib/db';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('isLoggedIn') === 'true');
  const [currentUser, setCurrentUser] = useState<string>(() => localStorage.getItem('currentUser') || '');
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true');
  const [isViewer, setIsViewer] = useState(() => localStorage.getItem('isViewer') === 'true');
  const [currentUserLguCode, setCurrentUserLguCode] = useState<LGUCode>(() => (localStorage.getItem('currentUserLguCode') as LGUCode) || 'PDRRMO');
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [acdvData, setACDVData] = useState<ACDV[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dbOffline, setDbOffline] = useState(false);   // soft offline — shows app with empty data
  const [retryCount, setRetryCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Add confirmation states
  const [showAddPasswordModal, setShowAddPasswordModal] = useState(false);
  const [pendingAddAction, setPendingAddAction] = useState<{ type: 'equipment' | 'vehicle' | 'personnel' | 'acdv', data: any } | null>(null);

  // ── Persist session ──────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem('isLoggedIn', String(isLoggedIn));
    localStorage.setItem('currentUser', currentUser);
    localStorage.setItem('isAdmin', String(isAdmin));
    localStorage.setItem('isViewer', String(isViewer));
    localStorage.setItem('currentUserLguCode', currentUserLguCode);
  }, [isLoggedIn, currentUser, isAdmin, isViewer, currentUserLguCode]);

  // ── Load all data from Supabase on login ─────────────────────
  const loadData = useCallback(async (silent = false) => {
    if (!silent) setIsLoading(true);
    setLoadError(null);
    try {
      const [eq, veh, pers, acdv] = await Promise.all([
        fetchEquipment(),
        fetchVehicles(),
        fetchPersonnel(),
        fetchACDV(),
      ]);
      setEquipment(eq);
      setVehicles(veh);
      setPersonnel(pers);
      setACDVData(acdv);
      setDbOffline(false);
      setRetryCount(0);
    } catch (err: any) {
      console.error('Failed to load data from Supabase:', err);
      const msg: string = err?.message ?? String(err);
      const isFetchError = msg.includes('fetch') || msg.includes('network') || msg.includes('abort');

      if (isFetchError) {
        // Network/timeout error — show app with empty data, auto-retry in background
        setDbOffline(true);
        setLoadError(null); // Don't block the app
        setRetryCount(c => c + 1);
      } else {
        // Auth/schema error — show non-blocking banner, still let user see UI
        setLoadError(msg);
        setDbOffline(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    loadData();
  }, [isLoggedIn, loadData]);

  // Auto-retry with exponential backoff (max 5 attempts, up to 30s apart)
  useEffect(() => {
    if (!isLoggedIn || !dbOffline || retryCount === 0 || retryCount > 5) return;
    const delay = Math.min(5000 * retryCount, 30000);
    const timer = setTimeout(() => loadData(true), delay);
    return () => clearTimeout(timer);
  }, [isLoggedIn, dbOffline, retryCount, loadData]);

  // ── Auth handlers ─────────────────────────────────────────────
  const handleLogin = (username: string, admin: boolean, lguCode: LGUCode, viewer: boolean = false) => {
    setCurrentUser(username);
    setIsAdmin(admin);
    setIsViewer(viewer);
    setCurrentUserLguCode(lguCode);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser('');
    setIsAdmin(false);
    setIsViewer(false);
    setCurrentUserLguCode('PDRRMO');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('isViewer');
    localStorage.removeItem('currentUserLguCode');
  };

  // ── Add Handlers (intercepted with password check) ──────────
  const executePendingAdd = async () => {
    if (!pendingAddAction) return;
    const { type, data } = pendingAddAction;
    setShowAddPasswordModal(false);
    setPendingAddAction(null);

    try {
      if (type === 'equipment') {
        const saved = await insertEquipment(data);
        setEquipment((prev) => [saved, ...prev]);
      } else if (type === 'vehicle') {
        const saved = await insertVehicle(data);
        setVehicles((prev) => [saved, ...prev]);
      } else if (type === 'personnel') {
        const saved = await insertPersonnel(data);
        setPersonnel((prev) => [saved, ...prev]);
      } else if (type === 'acdv') {
        const saved = await insertACDV(data);
        setACDVData((prev) => [saved, ...prev]);
      }
    } catch (err: any) {
      alert(`Error saving ${type}: ` + (err?.message ?? err));
    }
  };

  const addEquipment = async (item: Omit<Equipment, 'id' | 'dateAdded'>) => {
    try {
      const saved = await insertEquipment(item);
      setEquipment((prev) => [saved, ...prev]);
    } catch (err: any) {
      alert(`Error saving equipment: ` + (err?.message ?? err));
    }
  };

  const addVehicle = async (item: Omit<Vehicle, 'id' | 'dateAdded'>) => {
    try {
      const saved = await insertVehicle(item);
      setVehicles((prev) => [saved, ...prev]);
    } catch (err: any) {
      alert(`Error saving vehicle: ` + (err?.message ?? err));
    }
  };

  const addPersonnel = async (item: Omit<Personnel, 'id' | 'dateAdded'>) => {
    try {
      const saved = await insertPersonnel(item);
      setPersonnel((prev) => [saved, ...prev]);
    } catch (err: any) {
      alert(`Error saving personnel: ` + (err?.message ?? err));
    }
  };

  const addACDV = async (item: Omit<ACDV, 'id' | 'dateAdded'>) => {
    try {
      const saved = await insertACDV(item);
      setACDVData((prev) => [saved, ...prev]);
    } catch (err: any) {
      alert(`Error saving acdv: ` + (err?.message ?? err));
    }
  };

  // ── Update handlers (save edits to Supabase + update local state) ──
  const updateEquipment = async (updatedItem: Equipment) => {
    try {
      const saved = await updateEquipmentInDB(updatedItem);
      setEquipment((prev) => prev.map((item) => item.id === saved.id ? saved : item));
    } catch (err: any) {
      alert('Error updating equipment: ' + (err?.message ?? err));
    }
  };

  const updateVehicle = async (updatedItem: Vehicle) => {
    try {
      const saved = await updateVehicleInDB(updatedItem);
      setVehicles((prev) => prev.map((item) => item.id === saved.id ? saved : item));
    } catch (err: any) {
      alert('Error updating vehicle: ' + (err?.message ?? err));
    }
  };

  const updatePersonnel = async (updatedItem: Personnel) => {
    try {
      const saved = await updatePersonnelInDB(updatedItem);
      setPersonnel((prev) => prev.map((item) => item.id === saved.id ? saved : item));
    } catch (err: any) {
      alert('Error updating personnel: ' + (err?.message ?? err));
    }
  };

  const updateACDV = async (updatedItem: ACDV) => {
    try {
      const saved = await updateACDVInDB(updatedItem);
      setACDVData((prev) => prev.map((item) => item.id === saved.id ? saved : item));
    } catch (err: any) {
      alert('Error updating ACDV: ' + (err?.message ?? err));
    }
  };

  const deleteEquipmentItem = async (id: string) => {
    try {
      await deleteEquipment(id);
      setEquipment((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert('Error deleting equipment: ' + (err?.message ?? err));
    }
  };

  const deleteVehicleItem = async (id: string) => {
    try {
      await deleteVehicle(id);
      setVehicles((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert('Error deleting vehicle: ' + (err?.message ?? err));
    }
  };

  const deletePersonnelItem = async (id: string) => {
    try {
      await deletePersonnel(id);
      setPersonnel((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert('Error deleting personnel: ' + (err?.message ?? err));
    }
  };

  const deleteACDVItem = async (id: string) => {
    try {
      await deleteACDV(id);
      setACDVData((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      alert('Error deleting ACDV: ' + (err?.message ?? err));
    }
  };

  // ── Render ─────────────────────────────────────────────────────
  const renderContent = () => {
    if (isLoading) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '256px', gap: '16px' }}>
          <div className="spinner" />
          <p style={{ color: '#6b7280', fontSize: '18px' }}>Loading data from database...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard equipment={equipment} vehicles={vehicles} personnel={personnel} />;
      case 'equipment-form':
        return <EquipmentForm onSubmit={addEquipment} currentUserLguCode={currentUserLguCode} isAdmin={isAdmin} />;
      case 'vehicle-form':
        return <VehicleForm onSubmit={addVehicle} currentUserLguCode={currentUserLguCode} isAdmin={isAdmin} />;
      case 'personnel-form':
        return <PersonnelForm onSubmit={addPersonnel} currentUserLguCode={currentUserLguCode} isAdmin={isAdmin} />;
      case 'equipment-list':
        return <ResourceList type="equipment" data={equipment} onUpdate={updateEquipment} onDelete={deleteEquipmentItem} currentUserLguCode={currentUserLguCode} isAdmin={isAdmin} isViewer={isViewer} />;
      case 'vehicle-list':
        return <ResourceList type="vehicles" data={vehicles} onUpdate={updateVehicle} onDelete={deleteVehicleItem} currentUserLguCode={currentUserLguCode} isAdmin={isAdmin} isViewer={isViewer} />;
      case 'personnel-list':
        return <ResourceList type="personnel" data={personnel} onUpdate={updatePersonnel} onDelete={deletePersonnelItem} currentUserLguCode={currentUserLguCode} isAdmin={isAdmin} isViewer={isViewer} />;
      case 'gis-map':
        return <GISMap equipment={equipment} vehicles={vehicles} personnel={personnel} acdvData={acdvData} />;
      case 'agency-downloads':
        return <AgencyDownloads equipment={equipment} vehicles={vehicles} personnel={personnel} acdvData={acdvData} isViewer={isViewer} />;
      case 'acdv-form':
        return <ACDVForm onSubmit={addACDV} currentUserLguCode={currentUserLguCode} isAdmin={isAdmin} />;
      case 'acdv-list':
        return <ACDVList acdvData={acdvData} onUpdate={updateACDV} onDelete={deleteACDVItem} currentUserLguCode={currentUserLguCode} isAdmin={isAdmin} isViewer={isViewer} />;
      default:
        return <Dashboard equipment={equipment} vehicles={vehicles} personnel={personnel} />;
    }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-layout">
      {/* Mobile hamburger button */}
      <button
        className="hamburger-btn"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* Sidebar overlay (mobile) */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      <PasswordModal
        isOpen={showAddPasswordModal}
        onClose={() => {
          setShowAddPasswordModal(false);
          setPendingAddAction(null);
        }}
        onConfirm={executePendingAdd}
        title="⚠️ Action Required Admin Authorization"
        message="Enter Admin Password to add this new entry to database"
      />

      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => { setActiveTab(tab); setSidebarOpen(false); }}
        currentUser={currentUser}
        isAdmin={isAdmin}
        isViewer={isViewer}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="main-content">
        {/* Non-blocking DB offline banner — auto-retrying in background */}
        {dbOffline && !isLoading && (
          <div style={{
            background: '#fff7ed', borderBottom: '2px solid #fed7aa',
            padding: '10px 20px', display: 'flex', alignItems: 'center',
            justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px',
            fontSize: '13px', color: '#92400e'
          }}>
            <span>
              ⚠️ <strong>Database connection issue.</strong>&nbsp;
              {retryCount <= 5
                ? `Auto-retrying... (attempt ${retryCount}/5). Dashboard shows last loaded data.`
                : 'Could not reach database. Check your internet or Supabase project status.'}
            </span>
            <button
              onClick={() => loadData()}
              style={{ padding: '4px 16px', background: '#ea580c', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}
            >
              🔄 Retry Now
            </button>
          </div>
        )}
        <div style={{ padding: '24px' }}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}


