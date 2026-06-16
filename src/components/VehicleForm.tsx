import { useState } from 'react';
import { Vehicle, RIZAL_LGUS, LGUCode } from '../types';

interface VehicleFormProps {
  onSubmit: (data: Omit<Vehicle, 'id' | 'dateAdded'>) => void;
  currentUserLguCode: LGUCode;
  isAdmin: boolean;
}

const vehicleTypes = [
  'Ambulance',
  'Fire Truck',
  'Rescue Vehicle',
  'Water Tanker',
  'Cargo Truck',
  'Service Vehicle',
  'Mobile Command Center',
  'Other',
];

const conditions: Vehicle['condition'][] = ['Good', 'Fair', 'Poor', 'Needs Repair', 'Under Repair'];

export default function VehicleForm({ onSubmit, currentUserLguCode, isAdmin }: VehicleFormProps) {
  const defaultLgu = RIZAL_LGUS.find(l => l.code === currentUserLguCode) || RIZAL_LGUS[0];

  const [formData, setFormData] = useState({
    plateNumber: '',
    type: '',
    brand: '',
    model: '',
    capacity: '',
    quantity: 1,
    condition: 'Good' as Vehicle['condition'],
    location: '',
    lat: defaultLgu.lat as number,
    lng: defaultLgu.lng as number,
    agency: currentUserLguCode as Vehicle['agency'],
  });

  const [submitted, setSubmitted] = useState(false);

  const handleAgencyChange = (agencyCode: string) => {
    const lgu = RIZAL_LGUS.find(l => l.code === agencyCode);
    setFormData({
      ...formData,
      agency: agencyCode as Vehicle['agency'],
      lat: lgu?.lat ?? formData.lat,
      lng: lgu?.lng ?? formData.lng,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  // 🔥 ADD THIS VALIDATION
  if (!formData.plateNumber || formData.plateNumber.trim() === '') {
    alert("Required ang Plate Number");
    return;
  }

  onSubmit({
    ...formData,
    plateNumber: formData.plateNumber.trim(),
  });

  setSubmitted(true);
  setTimeout(() => setSubmitted(false), 3000);

  const defaultLgu = RIZAL_LGUS.find(l => l.code === currentUserLguCode) || RIZAL_LGUS[0];

  setFormData({
    plateNumber: '',
    type: '',
    brand: '',
    model: '',
    capacity: '',
    quantity: 1,
    condition: 'Good',
    location: '',
    lat: defaultLgu.lat,
    lng: defaultLgu.lng,
    agency: currentUserLguCode as Vehicle['agency'],
  });
};

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Add New Vehicle</h1>
        <p className="text-gray-500 mt-1">Register vehicle to the resource management database</p>
      </div>

      {submitted && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <span>✅</span>
          <span>Vehicle successfully added to the database!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Plate Number
            </label>
            <input
              type="text"
              value={formData.plateNumber}
              onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., ABC-1234"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vehicle Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select type...</option>
              {vehicleTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand
            </label>
            <input
              type="text"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Toyota, Isuzu, Mitsubishi"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Model
            </label>
            <input
              type="text"
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Hi-Ace, NQR, L300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Capacity
            </label>
            <input
              type="text"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 10 Passengers, 1000 Gallons"
            />
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
              placeholder="e.g., 1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Condition
            </label>
            <select
              value={formData.condition}
              onChange={(e) => setFormData({ ...formData, condition: e.target.value as Vehicle['condition'] })}
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
              Current Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Municipal Garage, Fire Station"
            />
          </div>

        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => {
              const defaultLgu = RIZAL_LGUS.find(l => l.code === currentUserLguCode) || RIZAL_LGUS[0];
              setFormData({
                plateNumber: '',
                type: '',
                brand: '',
                model: '',
                capacity: '',
                quantity: 1,
                condition: 'Good',
                location: '',
                lat: defaultLgu.lat,
                lng: defaultLgu.lng,
                agency: currentUserLguCode as Vehicle['agency'],
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
            <span>💾</span> Save Vehicle
          </button>
        </div>
      </form>
    </div>
  );
}
