import { useState } from 'react';
import { ACDV, ACDVPersonnel, RIZAL_LGUS, LGUCode } from '../types';

interface ACDVFormProps {
  onSubmit: (data: Omit<ACDV, 'id' | 'dateAdded'>) => void;
  currentUserLguCode: LGUCode;
  isAdmin: boolean;
}

export default function ACDVForm({ onSubmit, currentUserLguCode, isAdmin }: ACDVFormProps) {
  const [formData, setFormData] = useState({
    organizationName: '',
    officeAddress: '',
    registeredLGU: currentUserLguCode as ACDV['registeredLGU'],
    personnel: [] as ACDVPersonnel[],
  });

  const [currentPersonnel, setCurrentPersonnel] = useState({
    name: '',
    age: 18,
    gender: 'Male' as ACDVPersonnel['gender'],
    address: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const addPersonnel = () => {
    if (currentPersonnel.name && currentPersonnel.address) {
      const newPersonnel: ACDVPersonnel = {
        id: Date.now().toString(),
        ...currentPersonnel,
      };
      setFormData({
        ...formData,
        personnel: [...formData.personnel, newPersonnel],
      });
      setCurrentPersonnel({
        name: '',
        age: 18,
        gender: 'Male',
        address: '',
      });
    }
  };

  const removePersonnel = (id: string) => {
    setFormData({
      ...formData,
      personnel: formData.personnel.filter(p => p.id !== id),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.personnel.length === 0) {
      alert('Please add at least one personnel member.');
      return;
    }
    onSubmit(formData);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({
      organizationName: '',
      officeAddress: '',
      registeredLGU: currentUserLguCode as ACDV['registeredLGU'],
      personnel: [],
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Register ACDV</h1>
        <p className="text-gray-500 mt-1">Accredited Community Disaster Volunteers Registration</p>
      </div>

      {submitted && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
          <span>✅</span>
          <span>ACDV successfully registered!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        {/* Organization Details */}
        <div className="border-b pb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>🏢</span> Organization Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.organizationName}
                onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Barangay Rescue Volunteers Association"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Registered LGU/AGENCY <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.registeredLGU}
                onChange={(e) => setFormData({ ...formData, registeredLGU: e.target.value as ACDV['registeredLGU'] })}
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Office Address <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={formData.officeAddress}
                onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Complete address of ACDV office"
              />
            </div>
          </div>
        </div>

        {/* Personnel Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>👥</span> Personnel Information
            <span className="text-sm font-normal text-gray-500">
              ({formData.personnel.length} member{formData.personnel.length !== 1 ? 's' : ''} added)
            </span>
          </h2>

          {/* Add Personnel Form */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Add Personnel Member</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <input
                  type="text"
                  value={currentPersonnel.name}
                  onChange={(e) => setCurrentPersonnel({ ...currentPersonnel, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Full Name"
                />
              </div>
              <div>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={currentPersonnel.age}
                  onChange={(e) => setCurrentPersonnel({ ...currentPersonnel, age: parseInt(e.target.value) || 18 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Age"
                />
              </div>
              <div>
                <select
                  value={currentPersonnel.gender}
                  onChange={(e) => setCurrentPersonnel({ ...currentPersonnel, gender: e.target.value as ACDVPersonnel['gender'] })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="md:col-span-3">
                <input
                  type="text"
                  value={currentPersonnel.address}
                  onChange={(e) => setCurrentPersonnel({ ...currentPersonnel, address: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Complete Address"
                />
              </div>
              <div>
                <button
                  type="button"
                  onClick={addPersonnel}
                  disabled={!currentPersonnel.name || !currentPersonnel.address}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  + Add Member
                </button>
              </div>
            </div>
          </div>

          {/* Personnel List */}
          {formData.personnel.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">#</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-center">Age</th>
                    <th className="px-4 py-2 text-center">Gender</th>
                    <th className="px-4 py-2 text-left">Address</th>
                    <th className="px-4 py-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {formData.personnel.map((p, index) => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-gray-500">{index + 1}</td>
                      <td className="px-4 py-2 font-medium">{p.name}</td>
                      <td className="px-4 py-2 text-center">{p.age}</td>
                      <td className="px-4 py-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          p.gender === 'Male' ? 'bg-blue-100 text-blue-700' :
                          p.gender === 'Female' ? 'bg-pink-100 text-pink-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {p.gender}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-600">{p.address}</td>
                      <td className="px-4 py-2 text-center">
                        <button
                          type="button"
                          onClick={() => removePersonnel(p.id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <p className="text-gray-400">No personnel added yet. Add members using the form above.</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={() => {
              setFormData({
                organizationName: '',
                officeAddress: '',
                registeredLGU: currentUserLguCode as ACDV['registeredLGU'],
                personnel: [],
              });
              setCurrentPersonnel({
                name: '',
                age: 18,
                gender: 'Male',
                address: '',
              });
            }}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Clear Form
          </button>
          <button
            type="submit"
            disabled={formData.personnel.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            <span>💾</span> Save ACDV Registration
          </button>
        </div>
      </form>
    </div>
  );
}
