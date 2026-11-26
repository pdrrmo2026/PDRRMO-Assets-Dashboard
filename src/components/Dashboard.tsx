import { useState } from 'react';
import { Equipment, Vehicle, Personnel, RIZAL_LGUS, ActivityLog } from '../types';

interface DashboardProps {
  equipment: Equipment[];
  vehicles: Vehicle[];
  personnel: Personnel[];
  activityLogs?: ActivityLog[];
}

export default function Dashboard({ equipment, vehicles, personnel, activityLogs = [] }: DashboardProps) {
  const [showAllLogsModal, setShowAllLogsModal] = useState(false);
  const [logSearchQuery, setLogSearchQuery] = useState('');
  const [logTypeFilter, setLogTypeFilter] = useState<'all' | 'equipment' | 'vehicle' | 'personnel'>('all');

  const totalEquipment = equipment.reduce((sum, e) => sum + e.quantity, 0);
  const activePersonnel = personnel.filter(p => p.status === 'Active').length;
  const goodConditionVehicles = vehicles.filter(v => v.condition === 'Good').reduce((sum, v) => sum + (v.quantity || 1), 0);

  // Group by LGU
  const pdrEquipment = equipment.filter(e => e.agency === 'PDRRMO').reduce((sum, e) => sum + e.quantity, 0);
  const pdrVehicles = vehicles.filter(v => v.agency === 'PDRRMO').reduce((sum, v) => sum + (v.quantity || 1), 0);
  const pdrPersonnel = personnel.filter(p => p.agency === 'PDRRMO').length;
  
  // Municipal/City LGUs (all except PDRRMO)
  const muniEquipment = equipment.filter(e => e.agency !== 'PDRRMO').reduce((sum, e) => sum + e.quantity, 0);
  const muniVehicles = vehicles.filter(v => v.agency !== 'PDRRMO').reduce((sum, v) => sum + (v.quantity || 1), 0);
  const muniPersonnel = personnel.filter(p => p.agency !== 'PDRRMO').length;

  const allTrainings = personnel.flatMap(p => p.trainings);
  const trainingCounts = allTrainings.reduce((acc, training) => {
    acc[training] = (acc[training] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topTrainings = Object.entries(trainingCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  // Synthesize complete historical activity logs (including both created & updated logs)
  const allLogs: ActivityLog[] = (() => {
    if (activityLogs && activityLogs.length > 0) {
      // Deduplicate activity logs by key
      const seen = new Set<string>();
      const deduped: ActivityLog[] = [];
      for (const log of activityLogs) {
        const key = `${log.type}_${log.action}_${(log.name || '').trim().toLowerCase()}_${log.date}`;
        if (!seen.has(key)) {
          seen.add(key);
          deduped.push(log);
        }
      }
      return deduped.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    // Baseline historical logs from all records
    const fallbackLogs: ActivityLog[] = [
      ...equipment.map((e, idx) => ({ id: `eq-${idx}`, type: 'equipment' as const, action: 'Added' as const, name: e.name.trim(), agency: e.agency, date: e.dateAdded })),
      ...vehicles.map((v, idx) => ({ id: `vh-${idx}`, type: 'vehicle' as const, action: 'Added' as const, name: `${v.brand} ${v.model}`.trim(), agency: v.agency, date: v.dateAdded })),
      ...personnel.map((p, idx) => ({ id: `pe-${idx}`, type: 'personnel' as const, action: 'Added' as const, name: p.name.trim(), agency: p.agency, date: p.dateAdded })),
    ];

    const seen = new Set<string>();
    const cleanList: ActivityLog[] = [];
    for (const item of fallbackLogs) {
      const key = `${item.type}_${item.name.toLowerCase()}_${item.date}`;
      if (!seen.has(key)) {
        seen.add(key);
        cleanList.push(item);
      }
    }
    return cleanList.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  })();

  // Top 7 most recent logs for widget
  const recentLogs = allLogs.slice(0, 7);

  // Filtered logs for "View All Logs" modal
  const modalFilteredLogs = allLogs.filter(log => {
    const matchType = logTypeFilter === 'all' || log.type === logTypeFilter;
    const matchSearch = !logSearchQuery || 
      (log.name && log.name.toLowerCase().includes(logSearchQuery.toLowerCase())) ||
      (log.agency && log.agency.toLowerCase().includes(logSearchQuery.toLowerCase())) ||
      (log.date && log.date.includes(logSearchQuery));
    return matchType && matchSearch;
  });

  // LGU breakdown
  const lguStats = RIZAL_LGUS.map(lgu => ({
    name: lgu.name.replace('Municipality of ', '').replace('City of ', '').replace('PDRRMO - ', ''),
    type: lgu.type,
    equipment: equipment.filter(e => e.agency === lgu.code).reduce((sum, e) => sum + e.quantity, 0),
    vehicles: vehicles.filter(v => v.agency === lgu.code).reduce((sum, v) => sum + (v.quantity || 1), 0),
    personnel: personnel.filter(p => p.agency === lgu.code).length,
  })).filter(l => l.equipment > 0 || l.vehicles > 0 || l.personnel > 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Resource Management Dashboard</h1>
          <p className="text-gray-500 mt-1">Province of Rizal - DRRM Resource Overview</p>
        </div>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <span>📅</span>
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Equipment</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{totalEquipment}</p>
              <p className="text-sm text-gray-400">{equipment.length} types</p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
              🔧
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Vehicles</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{vehicles.reduce((sum, v) => sum + (v.quantity || 1), 0)}</p>
              <p className="text-sm text-green-500">{goodConditionVehicles} operational</p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center text-2xl">
              🚗
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Personnel</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{personnel.length}</p>
              <p className="text-sm text-green-500">{activePersonnel} active</p>
            </div>
            <div className="w-14 h-14 bg-orange-100 rounded-full flex items-center justify-center text-2xl">
              👥
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Training Programs</p>
              <p className="text-3xl font-bold text-gray-800 mt-1">{Object.keys(trainingCounts).length}</p>
              <p className="text-sm text-gray-400">unique trainings</p>
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
              📚
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Agency Distribution */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>🏛️</span> Agency Distribution
          </h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">PDRRMO (Provincial)</span>
                <span className="text-gray-500">{pdrEquipment + pdrVehicles + pdrPersonnel} resources</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-blue-50 rounded p-2 text-center">
                  <p className="font-semibold text-blue-600">{pdrEquipment}</p>
                  <p className="text-gray-500">Equipment</p>
                </div>
                <div className="bg-green-50 rounded p-2 text-center">
                  <p className="font-semibold text-green-600">{pdrVehicles}</p>
                  <p className="text-gray-500">Vehicles</p>
                </div>
                <div className="bg-orange-50 rounded p-2 text-center">
                  <p className="font-semibold text-orange-600">{pdrPersonnel}</p>
                  <p className="text-gray-500">Personnel</p>
                </div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-gray-700">Municipal/City LGUs</span>
                <span className="text-gray-500">{muniEquipment + muniVehicles + muniPersonnel} resources</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-blue-50 rounded p-2 text-center">
                  <p className="font-semibold text-blue-600">{muniEquipment}</p>
                  <p className="text-gray-500">Equipment</p>
                </div>
                <div className="bg-green-50 rounded p-2 text-center">
                  <p className="font-semibold text-green-600">{muniVehicles}</p>
                  <p className="text-gray-500">Vehicles</p>
                </div>
                <div className="bg-orange-50 rounded p-2 text-center">
                  <p className="font-semibold text-orange-600">{muniPersonnel}</p>
                  <p className="text-gray-500">Personnel</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Trainings */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>🎯</span> Top Training Programs
          </h2>
          <div className="space-y-3">
            {topTrainings.map(([training, count], index) => (
              <div key={training} className="flex items-center gap-3">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{training}</p>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1">
                    <div
                      className="bg-purple-500 h-1.5 rounded-full"
                      style={{ width: `${(count / personnel.length) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm text-gray-500">{count}</span>
              </div>
            ))}
            {topTrainings.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">No training data available</p>
            )}
          </div>
        </div>

        {/* Recent Activity / Logs */}
        <div className="bg-white rounded-xl shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <span>📝</span> Recent Activity & Logs
              </h2>
              <button
                type="button"
                onClick={() => setShowAllLogsModal(true)}
                className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold px-2.5 py-1 rounded border border-blue-200 transition-colors"
                title="View full history of all logs and edits"
              >
                View All ({allLogs.length})
              </button>
            </div>
            <div className="space-y-2.5">
              {recentLogs.map((item, index) => (
                <div key={item.id || index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                    item.type === 'equipment' ? 'bg-blue-100 text-blue-600' :
                    item.type === 'vehicle' ? 'bg-green-100 text-green-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    {item.type === 'equipment' ? '🔧' : item.type === 'vehicle' ? '🚗' : '👤'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-800 truncate">{item.name}</p>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        item.action === 'Updated' ? 'bg-blue-100 text-blue-700' :
                        item.action === 'Deleted' ? 'bg-red-100 text-red-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {item.action || 'Added'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                      <span>{item.date}</span>
                      {item.agency && <span>• {item.agency}</span>}
                    </div>
                  </div>
                </div>
              ))}
              {recentLogs.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">No recent activity</p>
              )}
            </div>
          </div>
          {allLogs.length > 7 && (
            <button
              type="button"
              onClick={() => setShowAllLogsModal(true)}
              className="mt-4 w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg border border-gray-200 transition-colors text-center"
            >
              📜 Tingnan Lahat ng Lumang Logs & Edits ({allLogs.length} total)
            </button>
          )}
        </div>
      </div>

      {/* LGU Breakdown */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>📍</span> LGU Resource Distribution
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">LGU</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-blue-700">🔧 Equipment</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-green-700">🚗 Vehicles</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-orange-700">👥 Personnel</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {lguStats.map((lgu, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{lgu.name}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      lgu.type === 'provincial' ? 'bg-purple-100 text-purple-700' :
                      lgu.type === 'city' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {lgu.type === 'provincial' ? 'Provincial' : lgu.type === 'city' ? 'City' : 'Municipality'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-blue-600">{lgu.equipment}</td>
                  <td className="px-4 py-3 text-center font-semibold text-green-600">{lgu.vehicles}</td>
                  <td className="px-4 py-3 text-center font-semibold text-orange-600">{lgu.personnel}</td>
                  <td className="px-4 py-3 text-center font-bold text-gray-800">
                    {lgu.equipment + lgu.vehicles + lgu.personnel}
                  </td>
                </tr>
              ))}
              {lguStats.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    No data available. Add resources to see the distribution.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Equipment Condition Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>📊</span> Equipment & Vehicle Condition Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {['Good', 'Fair', 'Poor', 'Needs Repair', 'Under Repair'].map((condition) => {
            const eqCount = equipment.filter(e => e.condition === condition).reduce((sum, e) => sum + e.quantity, 0);
            const vCount = vehicles.filter(v => v.condition === condition).reduce((sum, v) => sum + (v.quantity || 1), 0);
            const colorMap = {
              'Good': 'bg-green-100 text-green-700 border-green-200',
              'Fair': 'bg-yellow-100 text-yellow-700 border-yellow-200',
              'Poor': 'bg-orange-100 text-orange-700 border-orange-200',
              'Needs Repair': 'bg-red-100 text-red-700 border-red-200',
              'Under Repair': 'bg-indigo-100 text-indigo-700 border-indigo-200',
            };
            return (
              <div key={condition} className={`rounded-lg p-4 border ${colorMap[condition as keyof typeof colorMap]}`}>
                <p className="font-semibold">{condition}</p>
                <div className="mt-2 space-y-1 text-sm">
                  <p>Equipment: {eqCount} units</p>
                  <p>Vehicles: {vCount} units</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* View All Logs Modal */}
      {showAllLogsModal && (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 70 }} onClick={() => setShowAllLogsModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
            <div className="bg-blue-600 text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span>📜</span> Complete Activity & Audit Logs
                </h3>
                <p className="text-blue-100 text-xs mt-1">
                  Lahat ng talaan ng na-encode, na-edit, at na-update mula sa nakaraan hanggang ngayon (hindi nawawala ang lumang logs)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAllLogsModal(false)}
                className="text-white hover:text-gray-200 text-2xl font-bold leading-none cursor-pointer"
              >
                &times;
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-4 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-3 items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                {(['all', 'equipment', 'vehicle', 'personnel'] as const).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setLogTypeFilter(tab)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                      logTypeFilter === tab
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {tab === 'all' ? 'Lahat (All Logs)' : tab === 'equipment' ? '🔧 Equipment' : tab === 'vehicle' ? '🚗 Vehicles' : '👤 Personnel'}
                  </button>
                ))}
              </div>
              <div className="w-full sm:w-64">
                <input
                  type="text"
                  value={logSearchQuery}
                  onChange={e => setLogSearchQuery(e.target.value)}
                  placeholder="Mag-search sa logs..."
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
            </div>

            {/* Logs List Table */}
            <div className="p-4 overflow-y-auto flex-1 space-y-2">
              {modalFilteredLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Walang nakitang logs sa filter na ito.
                </div>
              ) : (
                modalFilteredLogs.map((item, idx) => (
                  <div key={item.id || idx} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg hover:bg-blue-50/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">
                        {item.type === 'equipment' ? '🔧' : item.type === 'vehicle' ? '🚗' : '👤'}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-800 text-sm">{item.name}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            item.action === 'Updated' ? 'bg-blue-100 text-blue-700' :
                            item.action === 'Deleted' ? 'bg-red-100 text-red-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {item.action || 'Added'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Uri: <span className="capitalize">{item.type}</span> {item.agency ? `• LGU / Agency: ${item.agency}` : ''}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded">
                        📅 {item.date}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">
                Ipinapakita: {modalFilteredLogs.length} sa {allLogs.length} kabuuang talaan (walang nawawala)
              </span>
              <button
                type="button"
                onClick={() => setShowAllLogsModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                Isara (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
