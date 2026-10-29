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
  useEffect(() => {
    if (!isLoggedIn) return;

    const loadData = async () => {
      setIsLoading(true);
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
      } catch (err: any) {
        console.error('Failed to load data from Supabase:', err);
        setLoadError(err?.message ?? 'Failed to connect to database. Please check your connection.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [isLoggedIn]);

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

    if (loadError) {
      return (
        <div style={{ maxWidth: '512px', margin: '48px auto', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '24px', textAlign: 'center' }}>
          <span style={{ fontSize: '40px' }}>⚠️</span>
          <h2 style={{ color: '#b91c1c', fontSize: '20px', fontWeight: 'bold', marginTop: '12px' }}>Database Connection Error</h2>
          <p style={{ color: '#dc2626', marginTop: '8px', fontSize: '14px' }}>{loadError}</p>
          <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '12px' }}>
            Tiyaking na-run na ang SQL migration sa Supabase dashboard at tama ang mga keys sa .env file.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{ marginTop: '16px', padding: '8px 24px', background: '#dc2626', color: '#ffffff', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '600' }}
          >
            Retry
          </button>
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
        <div style={{ padding: '24px' }}>
          {renderContent()}
        </div>
      </main>
    </div>
  );
}


