import { useState } from 'react';
import { Equipment, Vehicle, Personnel, ACDV, RIZAL_LGUS } from '../types';

interface AgencyDownloadsProps {
  equipment: Equipment[];
  vehicles: Vehicle[];
  personnel: Personnel[];
  acdvData: ACDV[];
}

export default function AgencyDownloads({ equipment, vehicles, personnel, acdvData }: AgencyDownloadsProps) {
  const [selectedAgency, setSelectedAgency] = useState<string>('all');
  const [downloadType, setDownloadType] = useState<'all' | 'equipment' | 'vehicles' | 'personnel' | 'acdv'>('all');

  // Group data by agency
  const getAgencyStats = () => {
    return RIZAL_LGUS.map(lgu => {
      const eqCount = equipment.filter(e => e.agency === lgu.code).reduce((sum, e) => sum + e.quantity, 0);
      const vCount = vehicles.filter(v => v.agency === lgu.code).length;
      const pCount = personnel.filter(p => p.agency === lgu.code).length;
      const acdvCount = acdvData.filter(a => a.registeredLGU === lgu.code).length;
      return {
        ...lgu,
        equipmentCount: eqCount,
        vehicleCount: vCount,
        personnelCount: pCount,
        acdvCount: acdvCount,
        totalResources: eqCount + vCount + pCount + acdvCount,
      };
    });
  };

  const agencyStats = getAgencyStats();

  const getLGUName = (code: string) => {
    const lgu = RIZAL_LGUS.find(l => l.code === code);
    return lgu ? lgu.name : code;
  };

  const generateCSV = (agencyCode: string) => {
    const agencyName = RIZAL_LGUS.find(l => l.code === agencyCode)?.name || 'All_Agencies';
    const timestamp = new Date().toISOString().split('T')[0];
    
    let csvContent = '';
    const rows: string[][] = [];

    if (downloadType === 'all' || downloadType === 'equipment') {
      const filteredEquipment = agencyCode === 'all' 
        ? equipment 
        : equipment.filter(e => e.agency === agencyCode);
      
      if (filteredEquipment.length > 0) {
        rows.push(['=== EQUIPMENT INVENTORY ===']);
        rows.push(['Name', 'Type', 'Quantity', 'Condition', 'Location', 'Municipality', 'Agency Code', 'Coordinates', 'Date Added']);
        filteredEquipment.forEach(e => {
          rows.push([e.name, e.type, e.quantity.toString(), e.condition, e.location, getLGUName(e.agency), e.agency, `${e.lat}, ${e.lng}`, e.dateAdded]);
        });
        rows.push([]);
      }
    }

    if (downloadType === 'all' || downloadType === 'vehicles') {
      const filteredVehicles = agencyCode === 'all' 
        ? vehicles 
        : vehicles.filter(v => v.agency === agencyCode);
      
      if (filteredVehicles.length > 0) {
        rows.push(['=== VEHICLE INVENTORY ===']);
        rows.push(['Plate Number', 'Type', 'Brand', 'Model', 'Capacity', 'Condition', 'Location', 'Municipality', 'Agency Code', 'Date Added']);
        filteredVehicles.forEach(v => {
          rows.push([v.plateNumber, v.type, v.brand, v.model, v.capacity, v.condition, v.location, getLGUName(v.agency), v.agency, v.dateAdded]);
        });
        rows.push([]);
      }
    }

    if (downloadType === 'all' || downloadType === 'personnel') {
      const filteredPersonnel = agencyCode === 'all' 
        ? personnel 
        : personnel.filter(p => p.agency === agencyCode);
      
      if (filteredPersonnel.length > 0) {
        rows.push(['=== PERSONNEL DIRECTORY ===']);
        rows.push(['Name', 'Position', 'Contact', 'Status', 'Municipality', 'Agency Code', 'Trainings', 'HADR Team', 'Date Added']);
        filteredPersonnel.forEach(p => {
          rows.push([p.name, p.position, p.contact, p.status, getLGUName(p.agency), p.agency, p.trainings.join('; '), p.hadrTeam, p.dateAdded]);
        });
        rows.push([]);
      }
    }

    if (downloadType === 'all' || downloadType === 'acdv') {
      const filteredACDV = agencyCode === 'all' 
        ? acdvData 
        : acdvData.filter(a => a.registeredLGU === agencyCode);
      
      if (filteredACDV.length > 0) {
        rows.push(['=== ACCREDITED COMMUNITY DISASTER VOLUNTEERS (ACDV) ===']);
        rows.push(['Organization', 'Office Address', 'Municipality', 'Registered LGU Code', 'Personnel Count', 'Personnel Details']);
        filteredACDV.forEach(a => {
          const personnelDetails = a.personnel.map(p => `${p.name} (${p.age}, ${p.gender}) - ${p.address}`).join(' | ');
          rows.push([a.organizationName, a.officeAddress, getLGUName(a.registeredLGU), a.registeredLGU, a.personnel.length.toString(), personnelDetails]);
        });
      }
    }

    if (rows.length === 0) {
      rows.push(['No data available for the selected criteria']);
    }

    csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const fileName = `DRRM_Resources_${agencyName.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.csv`;
    
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const generatePDF = (agencyCode: string) => {
    const agencyName = RIZAL_LGUS.find(l => l.code === agencyCode)?.name || 'All Agencies';
    const timestamp = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    
    const filteredEquipment = agencyCode === 'all' ? equipment : equipment.filter(e => e.agency === agencyCode);
    const filteredVehicles = agencyCode === 'all' ? vehicles : vehicles.filter(v => v.agency === agencyCode);
    const filteredPersonnel = agencyCode === 'all' ? personnel : personnel.filter(p => p.agency === agencyCode);
    const filteredACDV = agencyCode === 'all' ? acdvData : acdvData.filter(a => a.registeredLGU === agencyCode);

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>DRRM Resource Report - ${agencyName}</title>
        <style>
          @page { size: 8.5in 11in; margin: 0.5in; }
          body { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.4; color: #000; }
          
          /* Official Letterhead */
          .letterhead {
            text-align: center;
            border-bottom: 3px double #000;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          .letterhead-text {
            flex: 1;
            text-align: center;
          }
          .letterhead-text .republic {
            font-size: 11pt;
            text-transform: uppercase;
            margin-bottom: 2px;
          }
          .letterhead-text .office-name {
            font-size: 14pt;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 2px;
          }
          .letterhead-text .location {
            font-size: 11pt;
            margin-bottom: 2px;
          }
          .letterhead-text .contact {
            font-size: 10pt;
            margin-bottom: 2px;
          }
          .letterhead-text .email {
            font-size: 10pt;
            color: #000;
          }
          .office-title {
            text-align: center;
            font-size: 13pt;
            font-weight: bold;
            text-transform: uppercase;
            margin-top: 15px;
            padding-top: 10px;
            border-top: 1px solid #000;
          }
          
          /* Report Content */
          .report-title {
            text-align: center;
            font-size: 16pt;
            font-weight: bold;
            margin: 20px 0 10px 0;
            text-transform: uppercase;
          }
          .report-subtitle {
            text-align: center;
            font-size: 12pt;
            margin-bottom: 20px;
          }
          .report-meta {
            text-align: right;
            font-size: 11pt;
            margin-bottom: 15px;
          }
          
          /* Tables */
          h2 { 
            font-size: 13pt; 
            font-weight: bold; 
            margin-top: 20px; 
            margin-bottom: 10px;
            text-transform: uppercase;
            border-bottom: 1px solid #000;
            padding-bottom: 5px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 10px;
            font-size: 10pt;
          }
          th, td { 
            border: 1px solid #333; 
            padding: 6px 8px; 
            text-align: left; 
          }
          th { 
            background-color: #e5e5e5; 
            font-weight: bold;
            text-transform: uppercase;
            font-size: 9pt;
          }
          tr:nth-child(even) { background-color: #f9f9f9; }
          
          /* Badges */
          .badge { 
            padding: 2px 6px; 
            border-radius: 3px; 
            font-size: 9pt; 
            font-weight: bold;
            display: inline-block;
          }
          .badge-good { background: #c6efce; color: #006100; }
          .badge-fair { background: #ffeb9c; color: #9c5700; }
          .badge-poor { background: #ffc7ce; color: #9c0006; }
          .badge-repair { background: #f4b084; color: #000; }
          .badge-under-repair { background: #bdd7ee; color: #000; }
          .badge-active { background: #c6efce; color: #006100; }
          .badge-leave { background: #ffeb9c; color: #9c5700; }
          .badge-deployed { background: #bdd7ee; color: #000; }
          
          /* Footer */
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 9pt;
            border-top: 1px solid #ccc;
            padding-top: 10px;
          }
          
          @media print { 
            body { padding: 0; } 
            .letterhead { page-break-after: avoid; }
            table { page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
          }
        </style>
      </head>
      <body>
        <!-- Official Letterhead -->
        <div class="letterhead">
          <div class="letterhead-text">
            <div class="republic">Republic of the Philippines</div>
            <div class="office-name">Rizal Provincial Government</div>
            <div class="location">Antipolo City, Province of Rizal</div>
            <div class="contact">Telefax: 8571-4375/ 82563000</div>
            <div class="email">Email add:pdrrmo@rizalprovincialgov.ph</div>
          </div>
          <div class="office-title">Office of the Rizal Provincial Disaster Risk Reduction and Management Officer</div>
        </div>

        <!-- Report Content -->
        <div class="report-title">DRRM Resource Management Report</div>
        <div class="report-subtitle">${agencyName}</div>
        <div class="report-meta">Date Generated: ${timestamp}</div>

        ${downloadType === 'all' || downloadType === 'equipment' ? `
        <h2>🔧 Equipment Inventory</h2>
        ${filteredEquipment.length > 0 ? `
        <table>
          <thead>
            <tr><th>Equipment Name</th><th>Type</th><th>Qty</th><th>Condition</th><th>Location</th><th>Municipality</th></tr>
          </thead>
          <tbody>
            ${filteredEquipment.map(e => `
              <tr>
                <td>${e.name}</td>
                <td>${e.type}</td>
                <td>${e.quantity}</td>
                <td><span class="badge badge-${e.condition.toLowerCase().replace(' ', '-')}">${e.condition}</span></td>
                <td>${e.location}</td>
                <td>${RIZAL_LGUS.find(l => l.code === e.agency)?.name || e.agency}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ` : '<p>No equipment records found.</p>'}
        ` : ''}

        ${downloadType === 'all' || downloadType === 'vehicles' ? `
        <h2>🚗 Vehicle Inventory</h2>
        ${filteredVehicles.length > 0 ? `
        <table>
          <thead>
            <tr><th>Plate Number</th><th>Type</th><th>Brand/Model</th><th>Condition</th><th>Location</th><th>Municipality</th></tr>
          </thead>
          <tbody>
            ${filteredVehicles.map(v => `
              <tr>
                <td>${v.plateNumber}</td>
                <td>${v.type}</td>
                <td>${v.brand} ${v.model}</td>
                <td><span class="badge badge-${v.condition.toLowerCase().replace(' ', '-')}">${v.condition}</span></td>
                <td>${v.location}</td>
                <td>${RIZAL_LGUS.find(l => l.code === v.agency)?.name || v.agency}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ` : '<p>No vehicle records found.</p>'}
        ` : ''}

        ${downloadType === 'all' || downloadType === 'personnel' ? `
        <h2>👥 Personnel Directory</h2>
        ${filteredPersonnel.length > 0 ? `
        <table>
          <thead>
            <tr><th>Name</th><th>Position</th><th>Contact</th><th>Status</th><th>Municipality</th><th>Trainings</th></tr>
          </thead>
          <tbody>
            ${filteredPersonnel.map(p => `
              <tr>
                <td>${p.name}</td>
                <td>${p.position}</td>
                <td>${p.contact}</td>
                <td><span class="badge badge-${p.status.toLowerCase().replace(' ', '-')}">${p.status}</span></td>
                <td>${RIZAL_LGUS.find(l => l.code === p.agency)?.name || p.agency}</td>
                <td>${p.trainings.join(', ')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ` : '<p>No personnel records found.</p>'}
        ` : ''}

        ${downloadType === 'all' || downloadType === 'acdv' ? `
        <h2>🤝 Accredited Community Disaster Volunteers (ACDV)</h2>
        ${filteredACDV.length > 0 ? `
        <table>
          <thead>
            <tr><th>Organization</th><th>Office Address</th><th>Municipality</th><th>Members</th></tr>
          </thead>
          <tbody>
            ${filteredACDV.map(a => `
              <tr>
                <td>${a.organizationName}</td>
                <td>${a.officeAddress}</td>
                <td>${RIZAL_LGUS.find(l => l.code === a.registeredLGU)?.name || a.registeredLGU}</td>
                <td>${a.personnel.length}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        
        <h3>ACDV Personnel Details</h3>
        ${filteredACDV.map(a => `
          <h4>${a.organizationName}</h4>
          <table>
            <thead>
              <tr><th>Name</th><th>Age</th><th>Gender</th><th>Address</th></tr>
            </thead>
            <tbody>
              ${a.personnel.map(p => `
                <tr>
                  <td>${p.name}</td>
                  <td>${p.age}</td>
                  <td>${p.gender}</td>
                  <td>${p.address}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `).join('')}
        ` : '<p>No ACDV records found.</p>'}
        ` : ''}

        <div class="footer">
          <p><strong>PDRRMO - Province of Rizal</strong></p>
          <p>This document is system-generated and intended for official use only.</p>
          <p>© Rizal Provincial Government - All Rights Reserved</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => printWindow.print(), 500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <span>📥</span>
          Agency Data Downloads
        </h1>
        <p className="text-gray-500 mt-1">Download resource reports by LGU for Rizal Province</p>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Download Options</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Agency/LGU</label>
            <select
              value={selectedAgency}
              onChange={(e) => setSelectedAgency(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Agencies (Provincial Summary)</option>
              <optgroup label="Provincial">
                <option value="PDRRMO">PDRRMO - Province of Rizal</option>
              </optgroup>
              <optgroup label="City">
                <option value="ANTIPOLO">City of Antipolo</option>
              </optgroup>
              <optgroup label="Municipalities">
                {RIZAL_LGUS.filter(l => l.type === 'municipality').map(lgu => (
                  <option key={lgu.code} value={lgu.code}>{lgu.name}</option>
                ))}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Data to Include</label>
            <select
              value={downloadType}
              onChange={(e) => setDownloadType(e.target.value as typeof downloadType)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Resources</option>
              <option value="equipment">Equipment Only</option>
              <option value="vehicles">Vehicles Only</option>
              <option value="personnel">Personnel Only</option>
              <option value="acdv">ACDV Only</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            onClick={() => generateCSV(selectedAgency)}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
          >
            <span>📊</span> Download CSV
          </button>
          <button
            onClick={() => generatePDF(selectedAgency)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <span>📄</span> Print PDF Report
          </button>
        </div>
      </div>

      {/* Agency Summary Cards */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Rizal Province LGU Summary</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">LGU / Agency</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-blue-700">🔧 Equipment</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-green-700">🚗 Vehicles</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-orange-700">👥 Personnel</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-purple-700">🤝 ACDV</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Total</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {agencyStats.map((agency) => (
                <tr key={agency.code} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                        agency.type === 'provincial' ? 'bg-purple-100' :
                        agency.type === 'city' ? 'bg-blue-100' : 'bg-green-100'
                      }`}>
                        {agency.type === 'provincial' ? '🏛️' : agency.type === 'city' ? '🏙️' : '🏘️'}
                      </span>
                      <span className="font-medium text-gray-800">{agency.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      agency.type === 'provincial' ? 'bg-purple-100 text-purple-700' :
                      agency.type === 'city' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>
                      {agency.type.charAt(0).toUpperCase() + agency.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-blue-600">{agency.equipmentCount}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-green-600">{agency.vehicleCount}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-orange-600">{agency.personnelCount}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-semibold text-purple-600">{agency.acdvCount}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="font-bold text-gray-800">{agency.totalResources}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedAgency(agency.code);
                          setDownloadType('all');
                          setTimeout(() => generateCSV(agency.code), 100);
                        }}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors text-sm"
                        title="Download CSV"
                      >
                        📊
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAgency(agency.code);
                          setDownloadType('all');
                          setTimeout(() => generatePDF(agency.code), 100);
                        }}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                        title="Print PDF"
                      >
                        📄
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {/* Total Row */}
              <tr className="bg-gray-100 font-bold">
                <td className="px-4 py-3 text-gray-800">PROVINCIAL TOTAL</td>
                <td className="px-4 py-3 text-center">-</td>
                <td className="px-4 py-3 text-center text-blue-600">
                  {agencyStats.reduce((sum, a) => sum + a.equipmentCount, 0)}
                </td>
                <td className="px-4 py-3 text-center text-green-600">
                  {agencyStats.reduce((sum, a) => sum + a.vehicleCount, 0)}
                </td>
                <td className="px-4 py-3 text-center text-orange-600">
                  {agencyStats.reduce((sum, a) => sum + a.personnelCount, 0)}
                </td>
                <td className="px-4 py-3 text-center text-purple-600">
                  {agencyStats.reduce((sum, a) => sum + a.acdvCount, 0)}
                </td>
                <td className="px-4 py-3 text-center text-gray-800">
                  {agencyStats.reduce((sum, a) => sum + a.totalResources, 0)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedAgency('all');
                        setDownloadType('all');
                        setTimeout(() => generateCSV('all'), 100);
                      }}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                      title="Download All CSV"
                    >
                      📊 All
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAgency('all');
                        setDownloadType('all');
                        setTimeout(() => generatePDF('all'), 100);
                      }}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-sm"
                      title="Print All PDF"
                    >
                      📄 All
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Download Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Equipment Report</p>
              <p className="text-3xl font-bold mt-1">
                {equipment.reduce((sum, e) => sum + e.quantity, 0)}
              </p>
              <p className="text-blue-200 text-sm">Total Units</p>
            </div>
            <div className="text-5xl opacity-50">🔧</div>
          </div>
          <button
            onClick={() => {
              setDownloadType('equipment');
              generateCSV('all');
            }}
            className="w-full mt-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            Download Equipment CSV
          </button>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Vehicle Report</p>
              <p className="text-3xl font-bold mt-1">{vehicles.length}</p>
              <p className="text-green-200 text-sm">Total Vehicles</p>
            </div>
            <div className="text-5xl opacity-50">🚗</div>
          </div>
          <button
            onClick={() => {
              setDownloadType('vehicles');
              generateCSV('all');
            }}
            className="w-full mt-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            Download Vehicles CSV
          </button>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Personnel Report</p>
              <p className="text-3xl font-bold mt-1">{personnel.length}</p>
              <p className="text-orange-200 text-sm">Total Personnel</p>
            </div>
            <div className="text-5xl opacity-50">👥</div>
          </div>
          <button
            onClick={() => {
              setDownloadType('personnel');
              generateCSV('all');
            }}
            className="w-full mt-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            Download Personnel CSV
          </button>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">ACDV Report</p>
              <p className="text-3xl font-bold mt-1">{acdvData.length}</p>
              <p className="text-purple-200 text-sm">Total Organizations</p>
            </div>
            <div className="text-5xl opacity-50">🤝</div>
          </div>
          <button
            onClick={() => {
              setDownloadType('acdv');
              generateCSV('all');
            }}
            className="w-full mt-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
          >
            Download ACDV CSV
          </button>
        </div>
      </div>
    </div>
  );
}
