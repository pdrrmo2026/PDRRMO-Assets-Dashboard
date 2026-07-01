import { useState } from 'react';
import { Equipment, Vehicle, Personnel, ACDV, RIZAL_LGUS, HADR_TEAMS } from '../types';

interface AgencyDownloadsProps {
  equipment: Equipment[];
  vehicles: Vehicle[];
  personnel: Personnel[];
  acdvData: ACDV[];
  isViewer?: boolean;
}

export default function AgencyDownloads({ equipment, vehicles, personnel, acdvData, isViewer }: AgencyDownloadsProps) {
  const [selectedAgency, setSelectedAgency] = useState<string>('all');
  const [downloadType, setDownloadType] = useState<'all' | 'equipment' | 'vehicles' | 'personnel' | 'acdv' | 'hadr_team'>('all');

  // Helper: get full municipality/LGU name from code
  const getMunicipalityName = (code: string) => {
    const lgu = RIZAL_LGUS.find(l => l.code === code);
    return lgu ? lgu.name : code;
  };

  // Group data by agency
  const getAgencyStats = () => {
    return RIZAL_LGUS.map(lgu => {
      const eqCount = equipment.filter(e => e.agency === lgu.code).reduce((sum, e) => sum + e.quantity, 0);
      const vCount = vehicles.filter(v => v.agency === lgu.code).reduce((sum, v) => sum + (v.quantity || 1), 0);
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
        rows.push(['Name', 'Type', 'Quantity', 'Condition', 'Location', 'Agency', 'Coordinates', 'Date Added', 'Municipality']);
        filteredEquipment.forEach(e => {
          rows.push([e.name, e.type, e.quantity.toString(), e.condition, e.location, e.agency, `${e.lat}, ${e.lng}`, e.dateAdded, getMunicipalityName(e.agency)]);
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
        rows.push(['Plate Number', 'Type', 'Brand', 'Model', 'Capacity', 'Quantity', 'Condition', 'Location', 'Agency', 'Date Added', 'Municipality']);
        filteredVehicles.forEach(v => {
          rows.push([v.plateNumber, v.type, v.brand, v.model, v.capacity, (v.quantity || 1).toString(), v.condition, v.location, v.agency, v.dateAdded, getMunicipalityName(v.agency)]);
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
        rows.push(['Name', 'Position', 'Contact', 'Status', 'Agency', 'Trainings', 'HADR Team', 'Date Added', 'Municipality']);
        filteredPersonnel.forEach(p => {
          rows.push([p.name, p.position, p.contact, p.status, p.agency, p.trainings.join('; '), (p.hadrTeam || []).join('; '), p.dateAdded, getMunicipalityName(p.agency)]);
        });
        rows.push([]);
      }
    }

    if (downloadType === 'all' || downloadType === 'hadr_team') {
      const filteredPersonnel = agencyCode === 'all'
        ? personnel
        : personnel.filter(p => p.agency === agencyCode);

      if (filteredPersonnel.length > 0 || downloadType === 'hadr_team') {
        rows.push(['=== HADR TEAM TRAINING REPORT ===']);
        rows.push(['HADR Team', 'Rizal PDRRMO/PDRRMC Personnel Trained', 'Personnel Trained (LGU)', 'LGUs Trained']);
        HADR_TEAMS.forEach(team => {
          const personnelInTeam = filteredPersonnel.filter(p => (p.hadrTeam || []).includes(team));
          const pdrrmcAgencies = ['PDRRMO', 'BFP_RIZAL', 'PCG_RIZAL', 'IB_80TH', 'PNP_RIZAL', 'DPWH_DEO1', 'DPWH_DEO2'];
          const pdrrmcPersonnel = personnelInTeam.filter(p => pdrrmcAgencies.includes(p.agency));
          const lguPersonnel = personnelInTeam.filter(p => !pdrrmcAgencies.includes(p.agency));

          const pdrrmcCount = pdrrmcPersonnel.length;
          const lguCount = lguPersonnel.length;
          const lgusTrained = new Set(lguPersonnel.map(p => p.agency)).size;

          if (personnelInTeam.length > 0 || downloadType === 'hadr_team') {
            rows.push([team, pdrrmcCount.toString(), lguCount.toString(), lgusTrained.toString()]);
          }
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
        rows.push(['Organization', 'Office Address', 'Registered LGU', 'Personnel Count', 'Personnel Details', 'Municipality']);
        filteredACDV.forEach(a => {
          const personnelDetails = a.personnel.map(p => `${p.name} (${p.age}, ${p.gender}) - ${p.address}`).join(' | ');
          rows.push([a.organizationName, a.officeAddress, a.registeredLGU, a.personnel.length.toString(), personnelDetails, getMunicipalityName(a.registeredLGU)]);
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

  const generatePDF = (agencyCode: string, viewerMode: boolean = false) => {
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
          
          }
          
          /* Print controls */
          .print-controls {
            text-align: right;
            margin-bottom: 20px;
            padding: 15px;
            background: #f3f4f6;
            border-radius: 8px;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
          }
          .btn-print {
            background-color: #dc2626;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: bold;
            cursor: pointer;
            font-size: 14px;
          }
          .btn-print:hover { background-color: #b91c1c; }
          
          @media print { 
            body { padding: 0; } 
            .letterhead { page-break-after: avoid; }
            table { page-break-inside: auto; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            .print-controls { display: none !important; }
          }
        </style>
      </head>
      <body>
        ${!viewerMode ? '<div class="print-controls"><button class="btn-print" onclick="window.print()">🖨️ Print Report</button></div>' : '<div class="print-controls" style="background:#fef3c7;"><span style="color:#92400e;font-weight:bold;">👁️ Viewer Mode – Printing is disabled.</span></div>'}
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
                <td>${getMunicipalityName(e.agency)}</td>
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
            <tr><th>Plate Number</th><th>Type</th><th>Brand/Model</th><th>Qty</th><th>Condition</th><th>Location</th><th>Municipality</th></tr>
          </thead>
          <tbody>
            ${filteredVehicles.map(v => `
              <tr>
                <td>${v.plateNumber}</td>
                <td>${v.type}</td>
                <td>${v.brand} ${v.model}</td>
                <td>${v.quantity || 1}</td>
                <td><span class="badge badge-${v.condition.toLowerCase().replace(' ', '-')}">${v.condition}</span></td>
                <td>${v.location}</td>
                <td>${getMunicipalityName(v.agency)}</td>
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
            <tr><th>Name</th><th>Position</th><th>Contact</th><th>Status</th><th>Trainings</th><th>Municipality</th></tr>
          </thead>
          <tbody>
            ${filteredPersonnel.map(p => `
              <tr>
                <td>${p.name}</td>
                <td>${p.position}</td>
                <td>${p.contact}</td>
                <td><span class="badge badge-${p.status.toLowerCase().replace(' ', '-')}">${p.status}</span></td>
                <td>${p.trainings.join(', ')}</td>
                <td>${getMunicipalityName(p.agency)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        ` : '<p>No personnel records found.</p>'}
        ` : ''}

        ${downloadType === 'all' || downloadType === 'hadr_team' ? `
        <h2>🛡️ HADR Team Training Report</h2>
        <table>
          <thead>
            <tr>
              <th>HADR Team</th>
              <th>Rizal PDRRMO/PDRRMC Personnel Trained</th>
              <th>Personnel Trained (LGU)</th>
              <th>LGUs Trained</th>
            </tr>
          </thead>
          <tbody>
            ${HADR_TEAMS.map(team => {
      const personnelInTeam = filteredPersonnel.filter(p => (p.hadrTeam || []).includes(team));
      const pdrrmcAgencies = ['PDRRMO', 'BFP_RIZAL', 'PCG_RIZAL', 'IB_80TH', 'PNP_RIZAL', 'DPWH_DEO1', 'DPWH_DEO2'];
      const pdrrmcPersonnel = personnelInTeam.filter(p => pdrrmcAgencies.includes(p.agency));
      const lguPersonnel = personnelInTeam.filter(p => !pdrrmcAgencies.includes(p.agency));

      const pdrrmcCount = pdrrmcPersonnel.length;
      const lguCount = lguPersonnel.length;
      const lgusTrained = new Set(lguPersonnel.map(p => p.agency)).size;

      if (personnelInTeam.length === 0 && downloadType !== 'hadr_team') return '';
      return `
                <tr>
                  <td>${team}</td>
                  <td>${pdrrmcCount}</td>
                  <td>${lguCount}</td>
                  <td>${lgusTrained}</td>
                </tr>
              `;
    }).join('')}
          </tbody>
        </table>
        ` : ''}

        ${downloadType === 'all' || downloadType === 'acdv' ? `
        <h2>🤝 Accredited Community Disaster Volunteers (ACDV)</h2>
        ${filteredACDV.length > 0 ? `
        <table>
          <thead>
            <tr><th>Organization</th><th>Office Address</th><th>Registered LGU</th><th>Members</th><th>Municipality</th></tr>
          </thead>
          <tbody>
            ${filteredACDV.map(a => `
              <tr>
                <td>${a.organizationName}</td>
                <td>${a.officeAddress}</td>
                <td>${a.registeredLGU}</td>
                <td>${a.personnel.length}</td>
                <td>${getMunicipalityName(a.registeredLGU)}</td>
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
              <option value="hadr_team">HADR Team Report</option>
              <option value="acdv">ACDV Only</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {!isViewer && (
            <button
              onClick={() => generateCSV(selectedAgency)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <span>📊</span> Download CSV
            </button>
          )}
          <button
            onClick={() => generatePDF(selectedAgency, !!isViewer)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <span>📄</span> {isViewer ? 'Preview PDF Report' : 'Print PDF Report'}
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
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${agency.type === 'provincial' ? 'bg-purple-100' :
                        agency.type === 'city' ? 'bg-blue-100' : 'bg-green-100'
                        }`}>
                        {agency.type === 'provincial' ? '🏛️' : agency.type === 'city' ? '🏙️' : '🏘️'}
                      </span>
                      <span className="font-medium text-gray-800">{agency.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${agency.type === 'provincial' ? 'bg-purple-100 text-purple-700' :
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
                      {!isViewer && (
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
                      )}
                      <button
                        onClick={() => {
                          setSelectedAgency(agency.code);
                          setDownloadType('all');
                          setTimeout(() => generatePDF(agency.code, !!isViewer), 100);
                        }}
                        className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors text-sm"
                        title={isViewer ? 'Preview PDF' : 'Print PDF'}
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
              <p className="text-3xl font-bold mt-1">{vehicles.reduce((sum, v) => sum + (v.quantity || 1), 0)}</p>
              <p className="text-green-200 text-sm">Total Units</p>
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
