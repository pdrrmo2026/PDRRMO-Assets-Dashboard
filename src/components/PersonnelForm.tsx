import { useState } from 'react';
import { Personnel, RIZAL_LGUS, LGUCode } from '../types';

interface PersonnelFormProps {
  onSubmit: (data: Omit<Personnel, 'id' | 'dateAdded'>) => void;
  currentUserLguCode: LGUCode;
  isAdmin: boolean;
}

const positions = [
  'Rescue Team Leader',
  'Rescue Team Member',
  'Medical Responder',
  'Driver/Rescuer',
  'Communication Officer',
  'Incident Commander',
  'Logistics Officer',
  'Planning Officer',
  'Operations Officer',
  'Volunteer',
  'Other',
];

const availableTrainings = [
  'Basic Life Support',
  'First Aid',
  'Swift Water Rescue',
  'High Angle Rescue',
  'Incident Command System',
  'Search and Rescue',
  'Defensive Driving',
  'Radio Communication',
  'Crisis Communication',
  'Trauma Care',
  'Fire Suppression',
  'Hazmat Response',
  'Earthquake Response',
  'Flood Response',
  'Incident Management Teams (IMT)',
  'RDANA',
  'EOC',
  'Water / Flood Search and Rescue Teams',
  'Mountain / Wilderness SRR',
  'Generalist SRR',
  'Network and Infrastructure',
  'IT / Data Management',
  'Procurement / Supply Management',
  'Transport / Fleet Management',
  'DRRM-H',
  'Medical Emergency Response',
  'Epidemiology',
  'MHPSS',
  'WASH Team',
  'Police / Security',
  'Traffic Management Control',
  'Public Order and Safety',
  'MDM',
  'Recovery and Retrieval',
  'Forensic / Identification',
  'Psychosocial Support',
  'Debris Removal / Clearance',
  'Civil Engineering / Repair',
  'Heavy Equipment / Machinery',
  'Camp Management Committee (CMC)',
  'Camp Management Team (CMT)',
  'IDP Protection',
  'Information and Monitoring',
  'Women Friendly Spaces',
  'Child Friendly Spaces',
  'Humanitarian Supply Chain Management',
];

const hadrTeams = [
  'Incident Management Teams (IMT)',
  'RDANA',
  'EOC',
  'Water / Flood Search and Rescue Teams',
  'Mountain / Wilderness SRR',
  'Generalist SRR',
  'Network and Infrastructure',
  'IT / Data Management',
  'Procurement / Supply Management',
  'Transport / Fleet Management',
  'DRRM-H',
  'Medical Emergency Response',
  'Epidemiology',
  'MHPSS',
  'WASH Team',
  'Police / Security',
  'Traffic Management Control',
  'Public Order and Safety',
  'MDM',
  'Recovery and Retrieval',
  'Forensic / Identification',
  'Psychosocial Support',
  'Debris Removal / Clearance',
  'Civil Engineering / Repair',
  'Heavy Equipment / Machinery',
  'Camp Management Committee (CMC)',
  'Camp Management Team (CMT)',
  'IDP Protection',
  'Information and Monitoring',
  'Women Friendly Spaces',
  'Child Friendly Spaces',
  'Humanitarian Supply Chain Management',
];

export default function PersonnelForm({ onSubmit, currentUserLguCode, isAdmin }: PersonnelFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    agency: currentUserLguCode as Personnel['agency'],
    contact: '',
    trainings: [] as string[],
    status: 'Active' as Personnel['status'],
    hadrTeam: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [customTraining, setCustomTraining] = useState('');

  const handleAgencyChange = (agencyCode: string) => {
    setFormData({
      ...formData,
      agency: agencyCode as Personnel['agency'],
    });
  };

  const toggleTraining = (training: string) => {
    setFormData({
      ...formData,
      trainings: formData.trainings.includes(training)
        ? formData.trainings.filter((t) => t !== training)
        : [...formData.trainings, training],
    });
  };

  const addCustomTraining = () => {
    if (customTraining && !formData.trainings.includes(customTraining)) {
      setFormData({
        ...formData,
        trainings: [...formData.trainings, customTraining],
      });
      setCustomTraining('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
      setFormData({
      name: '',
      position: '',
      agency: currentUserLguCode as Personnel['agency'],
      contact: '',
      trainings: [],
      status: 'Active',
      hadrTeam: '',
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Add New Personnel</h1>
        <p className="text-gray-500 mt-1">Register personnel to the resource management database</p>
      </div>

      {submitted && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <span>✅</span>
          <span>Personnel successfully added to the database!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Juan Dela Cruz"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Position <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select position...</option>
              {positions.map((pos) => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              LGU / Agency <span className="text-red-500">*</span>
            </label>
            <select
              required
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
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., 0917-123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as Personnel['status'] })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Deployed">Deployed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HADR Team <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.hadrTeam}
              onChange={(e) => setFormData({ ...formData, hadrTeam: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select HADR Team...</option>
              {hadrTeams.map((team) => (
                <option key={team} value={team}>{team}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Training Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Training & Certifications
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-3">
            {availableTrainings.map((training) => (
              <label
                key={training}
                className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${
                  formData.trainings.includes(training)
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={formData.trainings.includes(training)}
                  onChange={() => toggleTraining(training)}
                  className="rounded text-blue-600"
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
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="button"
              onClick={addCustomTraining}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Add
            </button>
          </div>
          {formData.trainings.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-500 mb-2">Selected trainings:</p>
              <div className="flex flex-wrap gap-2">
                {formData.trainings.map((training) => (
                  <span
                    key={training}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1"
                  >
                    {training}
                    <button
                      type="button"
                      onClick={() => toggleTraining(training)}
                      className="ml-1 hover:text-blue-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => setFormData({
              name: '',
              position: '',
              agency: currentUserLguCode as Personnel['agency'],
              contact: '',
              trainings: [],
              status: 'Active',
              hadrTeam: '',
            })}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Clear Form
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <span>💾</span> Save Personnel
          </button>
        </div>
      </form>
    </div>
  );
}
