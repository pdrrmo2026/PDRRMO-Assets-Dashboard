import { Equipment, Vehicle, Personnel, RIZAL_LGUS } from '../types';

interface DashboardProps {
  equipment: Equipment[];
  vehicles: Vehicle[];
  personnel: Personnel[];
}

export default function Dashboard({ equipment, vehicles, personnel }: DashboardProps) {
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

  const recentActivity = [
    ...equipment.map(e => ({ type: 'equipment' as const, name: e.name, date: e.dateAdded })),
    ...vehicles.map(v => ({ type: 'vehicle' as const, name: `${v.brand} ${v.model}`, date: v.dateAdded })),
    ...personnel.map(p => ({ type: 'personnel' as const, name: p.name, date: p.dateAdded })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

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

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>📝</span> Recent Entries
          </h2>
          <div className="space-y-3">
            {recentActivity.map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  item.type === 'equipment' ? 'bg-blue-100 text-blue-600' :
                  item.type === 'vehicle' ? 'bg-green-100 text-green-600' :
                  'bg-orange-100 text-orange-600'
                }`}>
                  {item.type === 'equipment' ? '🔧' : item.type === 'vehicle' ? '🚗' : '👤'}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{item.name}</p>
                  <p className="text-xs text-gray-400">{item.date}</p>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-4">No recent activity</p>
            )}
          </div>
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
    </div>
  );
}
