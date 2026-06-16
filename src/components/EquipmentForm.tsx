import { useState } from 'react';
import { Equipment, RIZAL_LGUS, LGUCode } from '../types';

interface EquipmentFormProps {
  onSubmit: (data: Omit<Equipment, 'id' | 'dateAdded'>) => void;
  currentUserLguCode: LGUCode;
  isAdmin: boolean;
}

const equipmentTypes = [
  'Water Rescue',
  'Safety Equipment',
  'Power Equipment',
  'Rescue Equipment',
  'Medical Equipment',
  'Communication Equipment',
  'Search Equipment',
  'Shelter Equipment',
  'Other',
];

const conditions: Equipment['condition'][] = ['Good', 'Fair', 'Poor', 'Needs Repair', 'Under Repair'];

export default function EquipmentForm({ onSubmit, currentUserLguCode, isAdmin }: EquipmentFormProps) {
  const defaultLgu = RIZAL_LGUS.find(l => l.code === currentUserLguCode) || RIZAL_LGUS[0];

  const [formData, setFormData] = useState({
    name: '',
    type: '',
    quantity: 1,
    condition: 'Good' as Equipment['condition'],
    location: '',
    lat: defaultLgu.lat as number,
    lng: defaultLgu.lng as number,
    agency: currentUserLguCode as Equipment['agency'],
  });

  const [submitted, setSubmitted] = useState(false);

  const handleAgencyChange = (agencyCode: string) => {
    const lgu = RIZAL_LGUS.find(l => l.code === agencyCode);
    setFormData({
      ...formData,
      agency: agencyCode as Equipment['agency'],
      lat: lgu?.lat ?? formData.lat,
      lng: lgu?.lng ?? formData.lng,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    const defaultLgu = RIZAL_LGUS.find(l => l.code === currentUserLguCode) || RIZAL_LGUS[0];
    setFormData({
      name: '',
      type: '',
      quantity: 1,
      condition: 'Good',
      location: '',
      lat: defaultLgu.lat,
      lng: defaultLgu.lng,
      agency: currentUserLguCode as Equipment['agency'],
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Add New Equipment</h1>
        <p className="text-gray-500 mt-1">Register equipment to the resource management database</p>
      </div>

      {submitted && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <span>✅</span>
          <span>Equipment successfully added to the database!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipment Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Rescue Boat, Generator Set"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equipment Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select type...</option>
              {equipmentTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition
            </label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value as Equipment['condition'] })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {conditions.map((condition) => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LGU / Agency
            </label>
            <select
              value={formData.agency}
              onChange={(e) => handleAgencyChange(e.target.value)}
              disabled={!isAdmin}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <optgroup label="Provincial">
                {RIZAL_LGUS.filter(l => l.type === 'provincial').map(lgu => (
                  <option key={lgu.code} value={lgu.code}>{lgu.name}</option>
                ))}
              </optgroup>
              <optgroup label="City">
                {RIZAL_LGUS.filter(l => l.type === 'city').map(lgu => (
                  <option key={lgu.code} value={lgu.code}>{lgu.name}</option>
                ))}
              </optgroup>
              <optgroup label="Municipalities">
                {RIZAL_LGUS.filter(l => l.type === 'municipality').map(lgu => (
                  <option key={lgu.code} value={lgu.code}>{lgu.name}</option>
                ))}
              </optgroup>
              <optgroup label="Agencies">
                {RIZAL_LGUS.filter(l => l.type === 'agency').map(lgu => (
                  <option key={lgu.code} value={lgu.code}>{lgu.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Storage Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Municipal Warehouse, Bodega A"
            />
          </div>

        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => {
              const defaultLgu = RIZAL_LGUS.find(l => l.code === currentUserLguCode) || RIZAL_LGUS[0];
              setFormData({
                name: '',
                type: '',
                quantity: 1,
                condition: 'Good',
                location: '',
                lat: defaultLgu.lat,
                lng: defaultLgu.lng,
                agency: currentUserLguCode as Equipment['agency'],
              });
            }}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Clear Form
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>💾</span> Save Equipment
          </button>
        </div>
      </form>
    </div>
  );
}
