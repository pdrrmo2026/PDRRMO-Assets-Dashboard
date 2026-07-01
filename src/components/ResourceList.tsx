import { useState } from 'react';
import { Equipment, Vehicle, Personnel, RIZAL_LGUS, LGUCode, HADR_TEAMS } from '../types';

const EDIT_PASSWORD = 'pdrrmo0926';

const equipmentTypes = [
  'Water Rescue', 'Safety Equipment', 'Power Equipment', 'Rescue Equipment',
  'Medical Equipment', 'Communication Equipment', 'Search Equipment', 'Shelter Equipment', 'Other',
];

const vehicleTypes = [
  'Ambulance', 'Fire Truck', 'Rescue Vehicle', 'Water Tanker', 'Cargo Truck',
  'Service Vehicle', 'Mobile Command Center', 'Other',
];

const positions = [
  'Rescue Team Leader', 'Rescue Team Member', 'Medical Responder', 'Driver/Ambulance Driver',
  'Communication Officer', 'Communication Staff', 'Incident Commander', 'Logistics Officer',
  'Logistics Staff', 'Planning Officer', 'Planning Staff', 'Operations Officer',
  'Operations Staff', 'Admin and Training Officer', 'Admin and Training Staff',
  'Volunteer', 'Other',
];

const availableTrainings = [
  'Basic Life Support', 'First Aid', 'Swift Water Rescue', 'High Angle Rescue',
  'Incident Command System', 'Search and Rescue', 'Defensive Driving', 'Radio Communication',
  'Crisis Communication', 'Trauma Care', 'Fire Suppression', 'Hazmat Response',
  'Earthquake Response', 'Flood Response',
  'Incident Management Teams (IMT)', 'RDANA', 'EOC',
  'Water / Flood Search and Rescue Teams', 'Mountain / Wilderness SRR', 'Generalist SRR',
  'Network and Infrastructure', 'IT / Data Management', 'Procurement / Supply Management',
  'Transport / Fleet Management', 'DRRM-H', 'Medical Emergency Response',
  'Epidemiology', 'MHPSS', 'WASH Team', 'Police / Security',
  'Traffic Management Control', 'Public Order and Safety', 'MDM',
  'Recovery and Retrieval', 'Forensic / Identification', 'Psychosocial Support',
  'Debris Removal / Clearance', 'Civil Engineering / Repair', 'Heavy Equipment / Machinery',
  'Camp Management Committee (CMC)', 'Camp Management Team (CMT)', 'IDP Protection',
  'Information and Monitoring', 'Women Friendly Spaces', 'Child Friendly Spaces',
  'Humanitarian Supply Chain Management',
];



const conditions = ['Good', 'Fair', 'Poor', 'Needs Repair', 'Under Repair'];
const statuses = ['Active', 'On Leave', 'Deployed'];interface ResourceListProps {
  type: 'equipment' | 'vehicles' | 'personnel';
  data: Equipment[] | Vehicle[] | Personnel[];
  onUpdate?: (updatedData: any) => void;
  onDelete?: (id: string) => void;
  currentUserLguCode: LGUCode;
  isAdmin: boolean;
  isViewer?: boolean;
}

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
}

export function PasswordModal({ isOpen, onClose, onConfirm, title = "Authentication Required", message = "Enter password to edit" }: PasswordModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === EDIT_PASSWORD) {
      setError('');
      setPassword('');
      onConfirm();
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60]" onClick={onClose}>
      <div className="bg-white rounded-xl p-6 w-96 shadow-2xl border-2 border-amber-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">🔒</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-500">{message}</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            autoFocus
          />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setPassword('');
                setError('');
                onClose();
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
            >
              Unlock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ResourceList({ type, data, onUpdate, onDelete, currentUserLguCode, isAdmin, isViewer }: ResourceListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAgency, setFilterAgency] = useState<string>(isAdmin ? 'all' : currentUserLguCode);
  const [filterCondition, setFilterCondition] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordAction, setPasswordAction] = useState<'edit' | 'delete'>('edit');
  const [editFormData, setEditFormData] = useState<any>({});
  const [customTraining, setCustomTraining] = useState('');

  const filteredData = data.filter((item) => {
    const matchesSearch = type === 'equipment'
      ? (item as Equipment).name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item as Equipment).type.toLowerCase().includes(searchTerm.toLowerCase())
      : type === 'vehicles'
      ? (item as Vehicle).plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item as Vehicle).brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item as Vehicle).type.toLowerCase().includes(searchTerm.toLowerCase())
      : (item as Personnel).name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item as Personnel).position.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAgency = filterAgency === 'all' || item.agency === filterAgency;

    const matchesCondition = filterCondition === 'all' || 
      (type === 'equipment' && (item as Equipment).condition === filterCondition) ||
      (type === 'vehicles' && (item as Vehicle).condition === filterCondition) ||
      (type === 'personnel' && (item as Personnel).status === filterCondition);

    return matchesSearch && matchesAgency && matchesCondition;
  });

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Good': case 'Active': return 'bg-green-100 text-green-700';
      case 'Fair': case 'On Leave': return 'bg-yellow-100 text-yellow-700';
      case 'Poor': case 'Deployed': return 'bg-orange-100 text-orange-700';
      case 'Needs Repair': return 'bg-red-100 text-red-700';
      case 'Under Repair': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAgencyColor = (agency: string) => {
    const lgu = RIZAL_LGUS.find(l => l.code === agency);
    if (lgu?.type === 'provincial') return 'bg-purple-100 text-purple-700';
    if (lgu?.type === 'city') return 'bg-blue-100 text-blue-700';
    if (lgu?.type === 'agency') return 'bg-indigo-100 text-indigo-700';
    return 'bg-green-100 text-green-700';
  };

  const getAgencyShortName = (agency: string) => {
    const lgu = RIZAL_LGUS.find(l => l.code === agency);
    if (!lgu) return agency;
    return lgu.name.replace('Municipality of ', '').replace('City of ', '').replace('PDRRMO - ', '');
  };

  const handleRowClick = (item: any) => {
    setSelectedItem(item);
    setEditFormData({ ...item });
    setIsEditing(false);
    setCustomTraining('');
  };

  const closeModal = () => {
    setSelectedItem(null);
    setIsEditing(false);
    setEditFormData({});
    setCustomTraining('');
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDeleteClick = () => {
    setPasswordAction('delete');
    setShowPasswordModal(true);
  };

  const handlePasswordConfirmed = () => {
    setShowPasswordModal(false);
    if (passwordAction === 'edit') {
      setIsEditing(true);
    } else if (passwordAction === 'delete') {
      if (onDelete && selectedItem) {
        if (confirm(`Are you sure you want to delete this ${type === 'equipment' ? 'equipment' : type === 'vehicles' ? 'vehicle' : 'personnel'}?`)) {
          onDelete(selectedItem.id);
          closeModal();
        }
      }
    }
  };

  const handleSaveEdit = () => {
    if (onUpdate && selectedItem) {
      onUpdate(editFormData);
    }
    setSelectedItem(editFormData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditFormData({ ...selectedItem });
    setIsEditing(false);
    setCustomTraining('');
  };

  const toggleTraining = (training: string) => {
    const currentTrainings = editFormData.trainings || [];
    const newTrainings = currentTrainings.includes(training)
      ? currentTrainings.filter((t: string) => t !== training)
      : [...currentTrainings, training];
    setEditFormData({ ...editFormData, trainings: newTrainings });
  };

  const addCustomTraining = () => {
    if (customTraining && !editFormData.trainings?.includes(customTraining)) {
      setEditFormData({ 
        ...editFormData, 
        trainings: [...(editFormData.trainings || []), customTraining] 
      });
      setCustomTraining('');
    }
  };

  const titleMap = {
    equipment: 'Equipment Inventory',
    vehicles: 'Vehicle Inventory',
    personnel: 'Personnel Directory',
  };

  const iconMap = {
    equipment: '🔧',
    vehicles: '🚗',
    personnel: '👥',
  };

  // Equipment Edit Form
  const renderEquipmentEditForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Name <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={editFormData.name || ''} 
            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Rescue Boat, Generator Set"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Equipment Type <span className="text-red-500">*</span></label>
          <select 
            value={editFormData.type || ''} 
            onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select type...</option>
            {equipmentTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity <span className="text-red-500">*</span></label>
          <input 
            type="number" 
            min="1"
            value={editFormData.quantity || 1} 
            onChange={(e) => setEditFormData({ ...editFormData, quantity: parseInt(e.target.value) || 1 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Condition <span className="text-red-500">*</span></label>
          <select 
            value={editFormData.condition || 'Good'} 
            onChange={(e) => setEditFormData({ ...editFormData, condition: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {conditions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">LGU / Agency <span className="text-red-500">*</span></label>
          <select 
            value={editFormData.agency || 'ANTIPOLO'} 
            onChange={(e) => setEditFormData({ ...editFormData, agency: e.target.value })}
            disabled={!isAdmin}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {RIZAL_LGUS.map(lgu => <option key={lgu.code} value={lgu.code}>{lgu.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={editFormData.location || ''} 
            onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Municipal Warehouse, Bodega A"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
          <input 
            type="number" 
            step="0.0001"
            value={editFormData.lat || 0} 
            onChange={(e) => setEditFormData({ ...editFormData, lat: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
          <input 
            type="number" 
            step="0.0001"
            value={editFormData.lng || 0} 
            onChange={(e) => setEditFormData({ ...editFormData, lng: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
        </div>
      </div>
    </div>
  );

  // Vehicle Edit Form
  const renderVehicleEditForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Plate Number</label>
          <input 
            type="text" 
            value={editFormData.plateNumber || ''} 
            onChange={(e) => setEditFormData({ ...editFormData, plateNumber: e.target.value.toUpperCase() })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., ABC-1234"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
          <select 
            value={editFormData.type || ''} 
            onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="">Select type...</option>
            {vehicleTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
          <input 
            type="text" 
            value={editFormData.brand || ''} 
            onChange={(e) => setEditFormData({ ...editFormData, brand: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., Toyota, Isuzu, Mitsubishi"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
          <input 
            type="text" 
            value={editFormData.model || ''} 
            onChange={(e) => setEditFormData({ ...editFormData, model: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., Hi-Ace, NQR, L300"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
          <input 
            type="text" 
            value={editFormData.capacity || ''} 
            onChange={(e) => setEditFormData({ ...editFormData, capacity: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., 10 Passengers, 1000 Gallons"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
          <input 
            type="number" 
            min="1"
            value={editFormData.quantity || 1} 
            onChange={(e) => setEditFormData({ ...editFormData, quantity: parseInt(e.target.value) || 1 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
          <select 
            value={editFormData.condition || 'Good'} 
            onChange={(e) => setEditFormData({ ...editFormData, condition: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            {conditions.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">LGU / Agency</label>
          <select 
            value={editFormData.agency || 'ANTIPOLO'} 
            onChange={(e) => setEditFormData({ ...editFormData, agency: e.target.value })}
            disabled={!isAdmin}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {RIZAL_LGUS.map(lgu => <option key={lgu.code} value={lgu.code}>{lgu.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
          <input 
            type="text" 
            value={editFormData.location || ''} 
            onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="e.g., Municipal Garage, Fire Station"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
          <input 
            type="number" 
            step="0.0001"
            value={editFormData.lat || 0} 
            onChange={(e) => setEditFormData({ ...editFormData, lat: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
          <input 
            type="number" 
            step="0.0001"
            value={editFormData.lng || 0} 
            onChange={(e) => setEditFormData({ ...editFormData, lng: parseFloat(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
          />
        </div>
      </div>
    </div>
  );

  // Personnel Edit Form
  const renderPersonnelEditForm = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={editFormData.name || ''} 
            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="e.g., Juan Dela Cruz"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Position <span className="text-red-500">*</span></label>
          <select 
            value={editFormData.position || ''} 
            onChange={(e) => setEditFormData({ ...editFormData, position: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">Select position...</option>
            {positions.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">LGU / Agency <span className="text-red-500">*</span></label>
          <select 
            value={editFormData.agency || 'ANTIPOLO'} 
            onChange={(e) => setEditFormData({ ...editFormData, agency: e.target.value })}
            disabled={!isAdmin}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {RIZAL_LGUS.map(lgu => <option key={lgu.code} value={lgu.code}>{lgu.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={editFormData.contact || ''} 
            onChange={(e) => setEditFormData({ ...editFormData, contact: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="e.g., 0917-123-4567"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status <span className="text-red-500">*</span></label>
          <select 
            value={editFormData.status || 'Active'} 
            onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">HADR Team <span className="text-red-500">*</span></label>
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                const el = document.getElementById('hadr-dropdown-edit');
                if (el) el.classList.toggle('hidden');
              }}
              className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 flex justify-between items-center"
            >
              <span className="truncate">
                {editFormData.hadrTeam?.length > 0 
                  ? `${editFormData.hadrTeam.length} selected` 
                  : 'Select HADR Teams...'}
              </span>
              <span className="text-gray-500 text-xs">▼</span>
            </button>
            <div id="hadr-dropdown-edit" className="hidden absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {HADR_TEAMS.map(team => (
                <label key={team} className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editFormData.hadrTeam?.includes(team) || false}
                    onChange={() => {
                      const current = editFormData.hadrTeam || [];
                      const next = current.includes(team) ? current.filter((t: string) => t !== team) : [...current, team];
                      setEditFormData({ ...editFormData, hadrTeam: next });
                    }}
                    className="mr-3 rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">{team}</span>
                </label>
              ))}
            </div>
            {editFormData.hadrTeam?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {editFormData.hadrTeam.map((team: string) => (
                  <span key={team} className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-orange-100 text-orange-700">
                    {team}
                    <button type="button" onClick={() => setEditFormData({...editFormData, hadrTeam: editFormData.hadrTeam.filter((t: string) => t !== team)})} className="hover:text-orange-900 font-bold">&times;</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Training & Certifications */}
      <div className="border-t pt-4 mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-3">Training & Certifications</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
          {availableTrainings.map((training) => (
            <label
              key={training}
              className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                editFormData.trainings?.includes(training)
                  ? 'bg-purple-50 border-purple-300 text-purple-700'
                  : 'bg-white border-gray-200 hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                checked={editFormData.trainings?.includes(training) || false}
                onChange={() => toggleTraining(training)}
                className="rounded text-purple-600"
              />
              <span className="text-sm">{training}</span>
            </label>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={customTraining}
            onChange={(e) => setCustomTraining(e.target.value)}
            placeholder="Add custom training..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          />
          <button
            type="button"
            onClick={addCustomTraining}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Add
          </button>
        </div>
        {editFormData.trainings?.length > 0 && (
          <div className="mt-3">
            <p className="text-sm text-gray-500 mb-2">Selected trainings:</p>
            <div className="flex flex-wrap gap-2">
              {editFormData.trainings.map((training: string) => (
                <span
                  key={training}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1"
                >
                  {training}
                  <button
                    type="button"
                    onClick={() => toggleTraining(training)}
                    className="ml-1 hover:text-purple-900"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Detail Modal
  const renderDetailModal = () => {
    if (!selectedItem) return null;

    const headerGradient = type === 'equipment' ? 'from-blue-600 to-blue-700' : 
                          type === 'vehicles' ? 'from-green-600 to-green-700' : 
                          'from-orange-500 to-orange-600';

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className={`bg-gradient-to-r ${headerGradient} text-white p-6 rounded-t-2xl`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-3xl">
                  {iconMap[type]}
                </div>
                <div>
                  {!isEditing ? (
                    <>
                      <h2 className="text-2xl font-bold">
                        {type === 'equipment' ? selectedItem.name : 
                         type === 'vehicles' ? `${selectedItem.brand} ${selectedItem.model}` : 
                         selectedItem.name}
                      </h2>
                      <p className="text-white/80 text-sm mt-1">
                        {type === 'equipment' ? 'Equipment Details' : 
                         type === 'vehicles' ? 'Vehicle Details' : 'Personnel Details'}
                      </p>
                    </>
                  ) : (
                    <h2 className="text-2xl font-bold">✏️ Edit {type === 'equipment' ? 'Equipment' : type === 'vehicles' ? 'Vehicle' : 'Personnel'}</h2>
                  )}
                </div>
              </div>
              <button onClick={closeModal} className="text-white/80 hover:text-white text-2xl">&times;</button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {!isEditing ? (
              // View Mode
              <div className="space-y-4">
                {type === 'equipment' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Type</p><p className="font-semibold">{selectedItem.type}</p></div>
                      <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Quantity</p><p className="font-semibold">{selectedItem.quantity} units</p></div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Condition</p><span className={`inline-block px-3 py-1 rounded-full text-sm mt-1 ${getConditionColor(selectedItem.condition)}`}>{selectedItem.condition}</span></div>
                    <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Location</p><p className="font-semibold">{selectedItem.location}</p></div>
                    <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">LGU / Agency</p><span className={`inline-block px-3 py-1 rounded-full text-sm mt-1 ${getAgencyColor(selectedItem.agency)}`}>{getAgencyShortName(selectedItem.agency)}</span></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Coordinates</p><p className="font-mono text-sm">{selectedItem.lat?.toFixed(4) || 0}, {selectedItem.lng?.toFixed(4) || 0}</p></div>
                      <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Date Added</p><p className="font-semibold">{selectedItem.dateAdded}</p></div>
                    </div>
                  </>
                )}

                {type === 'vehicles' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Plate Number</p><p className="font-mono font-semibold">{selectedItem.plateNumber}</p></div>
                      <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Vehicle Type</p><p className="font-semibold">{selectedItem.type}</p></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Brand</p><p className="font-semibold">{selectedItem.brand}</p></div>
                      <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Model</p><p className="font-semibold">{selectedItem.model}</p></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Capacity</p><p className="font-semibold">{selectedItem.capacity}</p></div>
                      <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Quantity</p><p className="font-semibold">{selectedItem.quantity || 1}</p></div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Condition</p><span className={`inline-block px-3 py-1 rounded-full text-sm mt-1 ${getConditionColor(selectedItem.condition)}`}>{selectedItem.condition}</span></div>
                    <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Location</p><p className="font-semibold">{selectedItem.location}</p></div>
                    <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">LGU / Agency</p><span className={`inline-block px-3 py-1 rounded-full text-sm mt-1 ${getAgencyColor(selectedItem.agency)}`}>{getAgencyShortName(selectedItem.agency)}</span></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Coordinates</p><p className="font-mono text-sm">{selectedItem.lat?.toFixed(4) || 0}, {selectedItem.lng?.toFixed(4) || 0}</p></div>
                      <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Date Added</p><p className="font-semibold">{selectedItem.dateAdded}</p></div>
                    </div>
                  </>
                )}

                {type === 'personnel' && (
                  <>
                    <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Full Name</p><p className="font-semibold text-lg">{selectedItem.name}</p></div>
                    <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Position</p><p className="font-semibold">{selectedItem.position}</p></div>
                    <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Contact Number</p><a href={`tel:${selectedItem.contact}`} className="font-semibold text-blue-600">{selectedItem.contact}</a></div>
                    <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Status</p><span className={`inline-block px-3 py-1 rounded-full text-sm mt-1 ${getConditionColor(selectedItem.status)}`}>{selectedItem.status}</span></div>
                    <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">LGU / Agency</p><span className={`inline-block px-3 py-1 rounded-full text-sm mt-1 ${getAgencyColor(selectedItem.agency)}`}>{getAgencyShortName(selectedItem.agency)}</span></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">HADR Teams</p><p className="font-semibold">{(selectedItem.hadrTeam || []).join(', ') || 'None'}</p></div>
                      <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Date Added</p><p className="font-semibold">{selectedItem.dateAdded}</p></div>
                    </div>
                    {selectedItem.trainings?.length > 0 && (
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-500 text-sm mb-2">Trainings & Certifications</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedItem.trainings.map((t: string) => (
                            <span key={t} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {!isViewer && (
                  <div className="flex gap-3 mt-6 pt-4 border-t">
                    <button onClick={handleEditClick} className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center justify-center gap-2 font-semibold transition-colors">
                      <span>✏️</span> Edit Entry
                    </button>
                    <button onClick={handleDeleteClick} className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 font-semibold transition-colors">
                      <span>🗑️</span> Delete Entry
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Edit Mode - Full Form like Add Form
              <>
                {type === 'equipment' && renderEquipmentEditForm()}
                {type === 'vehicles' && renderVehicleEditForm()}
                {type === 'personnel' && renderPersonnelEditForm()}
                
                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 pt-4 border-t">
                  <button onClick={handleSaveEdit} className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 font-semibold">
                    <span>💾</span> Save Changes
                  </button>
                  <button onClick={handleCancelEdit} className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 flex items-center justify-center gap-2 font-semibold">
                    <span>✕</span> Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onConfirm={handlePasswordConfirmed}
        title={passwordAction === 'delete' ? '⚠️ Deletion Required Admin Authorization' : '🔒 Authentication Required'}
        message={passwordAction === 'delete' ? 'Enter Admin Password to delete this entry' : 'Enter Admin Password to edit this entry'}
      />

      {renderDetailModal()}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span>{iconMap[type]}</span>
          {titleMap[type]}
        </h1>
        <p className="text-gray-500 mt-1">{filteredData.length} {filteredData.length === 1 ? 'record' : 'records'} found</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search..." className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">LGU / Agency</label>
            <select 
              value={filterAgency} 
              onChange={(e) => setFilterAgency(e.target.value)} 
              disabled={!isAdmin}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="all">All LGU/Agencies</option>
              {RIZAL_LGUS.map(lgu => <option key={lgu.code} value={lgu.code}>{lgu.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{type === 'personnel' ? 'Status' : 'Condition'}</label>
            <select value={filterCondition} onChange={(e) => setFilterCondition(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option value="all">All</option>
              {type === 'personnel' ? statuses.map(s => <option key={s} value={s}>{s}</option>) : conditions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={() => { setSearchTerm(''); setFilterAgency(isAdmin ? 'all' : currentUserLguCode); setFilterCondition('all'); }} className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Clear Filters</button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {type === 'equipment' && <><th className="px-4 py-4 text-left">Equipment</th><th className="px-4 py-4 text-left">Type</th><th className="px-4 py-4 text-left">Qty</th><th className="px-4 py-4 text-left">Condition</th><th className="px-4 py-4 text-left">LGU/AGENCY</th></>}
                {type === 'vehicles' && <><th className="px-4 py-4 text-left">Vehicle</th><th className="px-4 py-4 text-left">Type</th><th className="px-4 py-4 text-left">Qty</th><th className="px-4 py-4 text-left">Plate</th><th className="px-4 py-4 text-left">Condition</th><th className="px-4 py-4 text-left">LGU/AGENCY</th></>}
                {type === 'personnel' && <><th className="px-4 py-4 text-left">Name</th><th className="px-4 py-4 text-left">Position</th><th className="px-4 py-4 text-left">Contact</th><th className="px-4 py-4 text-left">Status</th><th className="px-4 py-4 text-left">LGU/AGENCY</th></>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleRowClick(item)}>
                  {type === 'equipment' && <><td className="px-4 py-4 font-medium">{(item as Equipment).name}</td><td className="px-4 py-4 text-gray-600">{(item as Equipment).type}</td><td className="px-4 py-4">{(item as Equipment).quantity}</td><td className="px-4 py-4"><span className={`px-2 py-1 rounded-full text-xs ${getConditionColor((item as Equipment).condition)}`}>{(item as Equipment).condition}</span></td><td className="px-4 py-4"><span className={`px-2 py-1 rounded-full text-xs ${getAgencyColor(item.agency)}`}>{getAgencyShortName(item.agency)}</span></td></>}
                  {type === 'vehicles' && <><td className="px-4 py-4 font-medium">{(item as Vehicle).brand || '—'} {(item as Vehicle).model}</td><td className="px-4 py-4 text-gray-600">{(item as Vehicle).type || '—'}</td><td className="px-4 py-4">{(item as Vehicle).quantity || 1}</td><td className="px-4 py-4">{(item as Vehicle).plateNumber || '—'}</td><td className="px-4 py-4"><span className={`px-2 py-1 rounded-full text-xs ${getConditionColor((item as Vehicle).condition)}`}>{(item as Vehicle).condition}</span></td><td className="px-4 py-4"><span className={`px-2 py-1 rounded-full text-xs ${getAgencyColor(item.agency)}`}>{getAgencyShortName(item.agency)}</span></td></>}
                  {type === 'personnel' && <><td className="px-4 py-4 font-medium">{(item as Personnel).name}</td><td className="px-4 py-4 text-gray-600">{(item as Personnel).position}</td><td className="px-4 py-4 text-blue-600">{(item as Personnel).contact}</td><td className="px-4 py-4"><span className={`px-2 py-1 rounded-full text-xs ${getConditionColor((item as Personnel).status)}`}>{(item as Personnel).status}</span></td><td className="px-4 py-4"><span className={`px-2 py-1 rounded-full text-xs ${getAgencyColor(item.agency)}`}>{getAgencyShortName(item.agency)}</span></td></>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredData.length === 0 && <div className="text-center py-12"><div className="text-4xl mb-3">📭</div><p className="text-gray-500">No records found</p></div>}
      </div>
    </div>
  );
}
