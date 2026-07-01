import { useState, useEffect } from 'react';
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
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-lg">Loading data from database...</p>
        </div>
      );
    }

    if (loadError) {
      return (
        <div className="max-w-lg mx-auto mt-12 bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <span className="text-4xl">⚠️</span>
          <h2 className="text-xl font-bold text-red-700 mt-3">Database Connection Error</h2>
          <p className="text-red-600 mt-2 text-sm">{loadError}</p>
          <p className="text-gray-500 text-xs mt-3">
            Tiyaking na-run na ang SQL migration sa Supabase dashboard at tama ang mga keys sa .env file.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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
    <div className="flex h-screen bg-gray-100">
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
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} currentUser={currentUser} isAdmin={isAdmin} isViewer={isViewer} onLogout={handleLogout} />
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}


