import { useState } from 'react';
import { ACDV, RIZAL_LGUS, LGUCode } from '../types';

const EDIT_PASSWORD = 'pdrrmo0926';

interface ACDVListProps {
  acdvData: ACDV[];
  onUpdate?: (updatedData: ACDV) => void;
  currentUserLguCode: LGUCode;
  isAdmin: boolean;
}

interface PasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function PasswordModal({ isOpen, onClose, onConfirm }: PasswordModalProps) {
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
            <h3 className="font-semibold text-gray-800">Authentication Required</h3>
            <p className="text-sm text-gray-500">Enter password to edit</p>
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

export default function ACDVList({ acdvData, onUpdate, currentUserLguCode, isAdmin }: ACDVListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLGU, setFilterLGU] = useState<string>(isAdmin ? 'all' : currentUserLguCode);
  const [selectedACDV, setSelectedACDV] = useState<ACDV | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [editFormData, setEditFormData] = useState<ACDV | null>(null);
  const [newPersonnel, setNewPersonnel] = useState({ name: '', age: 18, gender: 'Male' as const, address: '' });

  const filteredData = acdvData.filter((acdv) => {
    const matchesSearch = 
      acdv.organizationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acdv.officeAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acdv.personnel.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesLGU = filterLGU === 'all' || acdv.registeredLGU === filterLGU;

    return matchesSearch && matchesLGU;
  });

  const getLGUName = (code: string) => {
    const lgu = RIZAL_LGUS.find(l => l.code === code);
    return lgu ? lgu.name.replace('Municipality of ', '').replace('City of ', '').replace('PDRRMO - ', '') : code;
  };

  const handleCardClick = (acdv: ACDV) => {
    setSelectedACDV(acdv);
    setEditFormData({ ...acdv });
    setIsEditing(false);
    setNewPersonnel({ name: '', age: 18, gender: 'Male', address: '' });
  };

  const closeModal = () => {
    setSelectedACDV(null);
    setIsEditing(false);
    setEditFormData(null);
    setNewPersonnel({ name: '', age: 18, gender: 'Male', address: '' });
  };

  const handleEditClick = () => {
    setShowPasswordModal(true);
  };

  const handlePasswordConfirmed = () => {
    setShowPasswordModal(false);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (onUpdate && selectedACDV && editFormData) {
      onUpdate(editFormData);
    }
    setSelectedACDV(editFormData);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditFormData({ ...selectedACDV! });
    setIsEditing(false);
    setNewPersonnel({ name: '', age: 18, gender: 'Male', address: '' });
  };

  const addPersonnel = () => {
    if (!editFormData || !newPersonnel.name || !newPersonnel.address) return;
    const personnelToAdd = {
      id: Date.now().toString(),
      ...newPersonnel,
    };
    setEditFormData({ ...editFormData, personnel: [...editFormData.personnel, personnelToAdd] });
    setNewPersonnel({ name: '', age: 18, gender: 'Male', address: '' });
  };

  const updatePersonnel = (personnelId: string, field: string, value: string | number) => {
    if (!editFormData) return;
    const updatedPersonnel = editFormData.personnel.map(p => 
      p.id === personnelId ? { ...p, [field]: value } : p
    );
    setEditFormData({ ...editFormData, personnel: updatedPersonnel });
  };

  const removePersonnel = (personnelId: string) => {
    if (!editFormData) return;
    const updatedPersonnel = editFormData.personnel.filter(p => p.id !== personnelId);
    setEditFormData({ ...editFormData, personnel: updatedPersonnel });
  };

  return (
    <div>
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onConfirm={handlePasswordConfirmed}
      />

      {/* Detail Modal */}
      {selectedACDV && editFormData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center text-3xl">🤝</div>
                  <div>
                    {!isEditing ? (
                      <>
                        <h2 className="text-2xl font-bold">{selectedACDV.organizationName}</h2>
                        <p className="text-purple-100 text-sm mt-1">ACDV Organization Details</p>
                      </>
                    ) : (
                      <h2 className="text-2xl font-bold">✏️ Edit ACDV Organization</h2>
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
                <>
                  <div className="space-y-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Office Address</p><p className="font-semibold">{selectedACDV.officeAddress}</p></div>
                    <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Registered LGU</p><span className={`inline-block px-3 py-1 rounded-full text-sm mt-1 ${RIZAL_LGUS.find(l => l.code === selectedACDV.registeredLGU)?.type === 'provincial' ? 'bg-purple-100 text-purple-700' : RIZAL_LGUS.find(l => l.code === selectedACDV.registeredLGU)?.type === 'city' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>{getLGUName(selectedACDV.registeredLGU)}</span></div>
                    <div className="bg-gray-50 rounded-lg p-4"><p className="text-gray-500 text-sm">Date Registered</p><p className="font-semibold">{selectedACDV.dateAdded}</p></div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Personnel Roster ({selectedACDV.personnel.length} members)</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                          <tr><th className="px-3 py-2 text-left">#</th><th className="px-3 py-2 text-left">Name</th><th className="px-3 py-2 text-center">Age</th><th className="px-3 py-2 text-center">Gender</th><th className="px-3 py-2 text-left">Address</th></tr>
                        </thead>
                        <tbody className="divide-y bg-white">
                          {selectedACDV.personnel.map((p, index) => (
                            <tr key={p.id}><td className="px-3 py-3 text-gray-500">{index + 1}</td><td className="px-3 py-3 font-medium">{p.name}</td><td className="px-3 py-3 text-center">{p.age}</td><td className="px-3 py-3 text-center"><span className={`px-2 py-1 rounded-full text-xs ${p.gender === 'Male' ? 'bg-blue-100 text-blue-700' : p.gender === 'Female' ? 'bg-pink-100 text-pink-700' : 'bg-gray-100 text-gray-700'}`}>{p.gender}</span></td><td className="px-3 py-3 text-gray-600">{p.address}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 flex gap-6 text-sm bg-gray-50 rounded-lg p-4">
                      <div><span className="text-gray-500">Male:</span> <span className="font-semibold text-blue-600">{selectedACDV.personnel.filter(p => p.gender === 'Male').length}</span></div>
                      <div><span className="text-gray-500">Female:</span> <span className="font-semibold text-pink-600">{selectedACDV.personnel.filter(p => p.gender === 'Female').length}</span></div>
                      <div><span className="text-gray-500">Average Age:</span> <span className="font-semibold text-gray-800">{Math.round(selectedACDV.personnel.reduce((sum, p) => sum + p.age, 0) / selectedACDV.personnel.length) || 0}</span></div>
                    </div>
                  </div>

                  <button onClick={handleEditClick} className="w-full mt-6 px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 flex items-center justify-center gap-2 font-semibold">
                    <span>🔒</span> Edit Organization
                  </button>
                </>
              ) : (
                // Edit Mode - Full Form like Add Form
                <div className="space-y-6">
                  {/* Organization Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="text-xl">🏢</span> Organization Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name <span className="text-red-500">*</span></label>
                        <input 
                          type="text" 
                          value={editFormData.organizationName}
                          onChange={(e) => setEditFormData({ ...editFormData, organizationName: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          placeholder="e.g., Barangay Rescue Volunteers Association"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Registered LGU <span className="text-red-500">*</span></label>
                        <select 
                          value={editFormData.registeredLGU}
                          onChange={(e) => setEditFormData({ ...editFormData, registeredLGU: e.target.value as any })}
                          disabled={!isAdmin}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          {RIZAL_LGUS.map(lgu => <option key={lgu.code} value={lgu.code}>{lgu.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Office Address <span className="text-red-500">*</span></label>
                      <textarea 
                        value={editFormData.officeAddress}
                        onChange={(e) => setEditFormData({ ...editFormData, officeAddress: e.target.value })}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Complete address of ACDV office"
                      />
                    </div>
                  </div>

                  <hr className="border-gray-200" />

                  {/* Personnel Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="text-xl">👥</span> Personnel Information
                      <span className="text-sm font-normal text-gray-500">({editFormData.personnel.length} member{editFormData.personnel.length !== 1 ? 's' : ''} added)</span>
                    </h3>

                    {/* Add Personnel Form */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Add Personnel Member</h4>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="md:col-span-2">
                          <input 
                            type="text"
                            value={newPersonnel.name}
                            onChange={(e) => setNewPersonnel({ ...newPersonnel, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Full Name"
                          />
                        </div>
                        <div>
                          <input 
                            type="number"
                            min="18"
                            max="100"
                            value={newPersonnel.age}
                            onChange={(e) => setNewPersonnel({ ...newPersonnel, age: parseInt(e.target.value) || 18 })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <select 
                            value={newPersonnel.gender}
                            onChange={(e) => setNewPersonnel({ ...newPersonnel, gender: e.target.value as any })}
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
                            value={newPersonnel.address}
                            onChange={(e) => setNewPersonnel({ ...newPersonnel, address: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            placeholder="Complete Address"
                          />
                        </div>
                        <div>
                          <button
                            type="button"
                            onClick={addPersonnel}
                            disabled={!newPersonnel.name || !newPersonnel.address}
                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                          >
                            + Add Member
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Personnel List */}
                    {editFormData.personnel.length > 0 ? (
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-4 py-3 text-left font-medium text-gray-600">#</th>
                              <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                              <th className="px-4 py-3 text-center font-medium text-gray-600">Age</th>
                              <th className="px-4 py-3 text-center font-medium text-gray-600">Gender</th>
                              <th className="px-4 py-3 text-left font-medium text-gray-600">Address</th>
                              <th className="px-4 py-3 text-center font-medium text-gray-600">Action</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y bg-white">
                            {editFormData.personnel.map((p, index) => (
                              <tr key={p.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                                <td className="px-4 py-3">
                                  <input 
                                    type="text"
                                    value={p.name}
                                    onChange={(e) => updatePersonnel(p.id, 'name', e.target.value)}
                                    className="w-full px-2 py-1 border rounded text-sm"
                                  />
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <input 
                                    type="number"
                                    value={p.age}
                                    onChange={(e) => updatePersonnel(p.id, 'age', parseInt(e.target.value) || 0)}
                                    className="w-16 px-2 py-1 border rounded text-sm text-center"
                                  />
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <select 
                                    value={p.gender}
                                    onChange={(e) => updatePersonnel(p.id, 'gender', e.target.value)}
                                    className="w-full px-2 py-1 border rounded text-sm"
                                  >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </td>
                                <td className="px-4 py-3">
                                  <input 
                                    type="text"
                                    value={p.address}
                                    onChange={(e) => updatePersonnel(p.id, 'address', e.target.value)}
                                    className="w-full px-2 py-1 border rounded text-sm"
                                  />
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <button onClick={() => removePersonnel(p.id)} className="text-red-500 hover:text-red-700">🗑️</button>
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

                  <hr className="border-gray-200" />

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button onClick={handleCancelEdit} className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold">
                      Clear Form
                    </button>
                    <button onClick={handleSaveEdit} className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 font-semibold">
                      <span>💾</span> Save ACDV Registration
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span>🤝</span>
          Accredited Community Disaster Volunteers (ACDV)
        </h1>
        <p className="text-gray-500 mt-1">
          {filteredData.length} registered organization{filteredData.length !== 1 ? 's' : ''} • {filteredData.reduce((sum, a) => sum + a.personnel.length, 0)} total volunteers
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search organization or personnel..." className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Registered LGU</label>
            <select 
              value={filterLGU} 
              onChange={(e) => setFilterLGU(e.target.value)} 
              disabled={!isAdmin}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="all">All LGUs</option>
              {RIZAL_LGUS.map(lgu => <option key={lgu.code} value={lgu.code}>{lgu.name}</option>)}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={() => { setSearchTerm(''); setFilterLGU(isAdmin ? 'all' : currentUserLguCode); }} className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg">Clear Filters</button>
          </div>
        </div>
      </div>

      {/* ACDV Cards */}
      <div className="space-y-4">
        {filteredData.length === 0 && <div className="text-center py-12 bg-white rounded-xl"><div className="text-4xl mb-3">📭</div><p className="text-gray-500">No ACDV organizations found</p></div>}
        {filteredData.map((acdv) => {
          const lgu = RIZAL_LGUS.find(l => l.code === acdv.registeredLGU);
          return (
            <div key={acdv.id} className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick(acdv)}>
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">🤝</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{acdv.organizationName}</h3>
                      <p className="text-gray-500 text-sm mt-1">📍 {acdv.officeAddress}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`px-3 py-1 rounded-full text-xs ${lgu?.type === 'provincial' ? 'bg-purple-100 text-purple-700' : lgu?.type === 'city' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>Registered: {getLGUName(acdv.registeredLGU)}</span>
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{acdv.personnel.length} Member{acdv.personnel.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-gray-400">▶</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Stats */}
      {filteredData.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4"><p className="text-blue-600 text-sm">Total Organizations</p><p className="text-2xl font-bold text-blue-800">{filteredData.length}</p></div>
          <div className="bg-green-50 rounded-lg p-4"><p className="text-green-600 text-sm">Total Volunteers</p><p className="text-2xl font-bold text-green-800">{filteredData.reduce((sum, a) => sum + a.personnel.length, 0)}</p></div>
          <div className="bg-purple-50 rounded-lg p-4"><p className="text-purple-600 text-sm">Male Volunteers</p><p className="text-2xl font-bold text-purple-800">{filteredData.reduce((sum, a) => sum + a.personnel.filter(p => p.gender === 'Male').length, 0)}</p></div>
          <div className="bg-pink-50 rounded-lg p-4"><p className="text-pink-600 text-sm">Female Volunteers</p><p className="text-2xl font-bold text-pink-800">{filteredData.reduce((sum, a) => sum + a.personnel.filter(p => p.gender === 'Female').length, 0)}</p></div>
        </div>
      )}
    </div>
  );
}
