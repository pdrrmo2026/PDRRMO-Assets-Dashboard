import { useState, useEffect, useRef } from 'react';
import { Equipment, Vehicle, Personnel, ACDV } from '../types';

interface GISMapProps {
  equipment: Equipment[];
  vehicles: Vehicle[];
  personnel: Personnel[];
  acdvData: ACDV[];
}

// We'll use Leaflet via CDN and window.L since it needs special handling in Vite
declare global {
  interface Window {
    L: any;
  }
}

export default function GISMap({ equipment, vehicles, personnel, acdvData }: GISMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showEquipment, setShowEquipment] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const [showPersonnel, setShowPersonnel] = useState(true);
  const [showACDV, setShowACDV] = useState(true);
  // selectedMarker state - can be used for future detail view

  useEffect(() => {
    // Load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => {
        setMapLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = window.L.map(mapRef.current).setView([14.6091, 121.0223], 11);

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;
    markersRef.current = [];

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [mapLoaded]);

  useEffect(() => {
    if (!mapInstanceRef.current || !window.L) return;

    // Clear existing markers
    if (markersRef.current) {
      markersRef.current.forEach((marker: any) => marker.remove());
    }
    markersRef.current = [] as any[];

    const map = mapInstanceRef.current;

    // Custom icons
    const createIcon = (color: string, emoji: string) => {
      return window.L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          background-color: ${color};
          width: 36px;
          height: 36px;
          border-radius: 50% 50% 50% 0;
          transform: rotate(-45deg);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          border: 2px solid white;
        ">
          <span style="transform: rotate(45deg); font-size: 16px;">${emoji}</span>
        </div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36],
      });
    };

    const equipmentIcon = createIcon('#3B82F6', '🔧');
    const vehicleIcon = createIcon('#22C55E', '🚗');
    const personnelIcon = createIcon('#F97316', '👤');
    const acdvIcon = createIcon('#9333EA', '🤝');

    // Add equipment markers
    if (showEquipment) {
      equipment.forEach((item) => {
        const marker = window.L.marker([item.lat, item.lng], { icon: equipmentIcon })
          .addTo(map)
          .bindPopup(`
            <div style="min-width: 200px;">
              <h3 style="font-weight: bold; margin-bottom: 8px; color: #1E40AF;">🔧 ${item.name}</h3>
              <p><strong>Type:</strong> ${item.type}</p>
              <p><strong>Quantity:</strong> ${item.quantity}</p>
              <p><strong>Condition:</strong> ${item.condition}</p>
              <p><strong>Location:</strong> ${item.location}</p>
              <p><strong>Agency:</strong> ${item.agency}</p>
            </div>
          `);
        markersRef.current.push(marker);
      });
    }

    // Add vehicle markers
    if (showVehicles) {
      vehicles.forEach((item) => {
        const marker = window.L.marker([item.lat, item.lng], { icon: vehicleIcon })
          .addTo(map)
          .bindPopup(`
            <div style="min-width: 200px;">
              <h3 style="font-weight: bold; margin-bottom: 8px; color: #166534;">🚗 ${item.brand} ${item.model}</h3>
              <p><strong>Plate:</strong> ${item.plateNumber}</p>
              <p><strong>Type:</strong> ${item.type}</p>
              <p><strong>Capacity:</strong> ${item.capacity}</p>
              <p><strong>Condition:</strong> ${item.condition}</p>
              <p><strong>Location:</strong> ${item.location}</p>
              <p><strong>Agency:</strong> ${item.agency}</p>
            </div>
          `);
        markersRef.current.push(marker);
      });
    }

    // Add personnel markers
    if (showPersonnel) {
      personnel.forEach((item) => {
        // Get coordinates from agency
        const lguCoords: Record<string, { lat: number; lng: number }> = {
          'PDRRMO': { lat: 14.6042, lng: 121.1681 },
          'ANTIPOLO': { lat: 14.5873, lng: 121.1759 },
          'ANGONO': { lat: 14.5234, lng: 121.1536 },
          'BARAS': { lat: 14.5234, lng: 121.2672 },
          'BINANGONAN': { lat: 14.4514, lng: 121.1919 },
          'CAINTA': { lat: 14.5864, lng: 121.1153 },
          'CARDONA': { lat: 14.4892, lng: 121.2283 },
          'JALAJALA': { lat: 14.3547, lng: 121.3231 },
          'MORONG': { lat: 14.5186, lng: 121.2378 },
          'PILILLA': { lat: 14.4828, lng: 121.3078 },
          'RODRIGUEZ': { lat: 14.7278, lng: 121.1219 },
          'SAN_MATEO': { lat: 14.6969, lng: 121.1219 },
          'TANAY': { lat: 14.4972, lng: 121.2864 },
          'TAYTAY': { lat: 14.5569, lng: 121.1339 },
          'TERESA': { lat: 14.5614, lng: 121.1919 },
        };
        const coords = lguCoords[item.agency] || { lat: 14.6091, lng: 121.0223 };
        
        const marker = window.L.marker([coords.lat, coords.lng], { icon: personnelIcon })
          .addTo(map)
          .bindPopup(`
            <div style="min-width: 200px;">
              <h3 style="font-weight: bold; margin-bottom: 8px; color: #C2410C;">👤 ${item.name}</h3>
              <p><strong>Position:</strong> ${item.position}</p>
              <p><strong>Contact:</strong> ${item.contact}</p>
              <p><strong>Status:</strong> ${item.status}</p>
              <p><strong>Agency:</strong> ${item.agency}</p>
              <p><strong>HADR Team:</strong> ${item.hadrTeam}</p>
              <p><strong>Training:</strong></p>
              <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px;">
                ${item.trainings.map(t => `<span style="background: #E0E7FF; color: #3730A3; padding: 2px 6px; border-radius: 4px; font-size: 11px;">${t}</span>`).join('')}
              </div>
            </div>
          `);
        markersRef.current.push(marker);
      });
    }

    // Add ACDV markers
    if (showACDV) {
      acdvData.forEach((item) => {
        // Get coordinates from registered LGU (use default Rizal coordinates if not available)
        const lguCoords: Record<string, { lat: number; lng: number }> = {
          'PDRRMO': { lat: 14.6042, lng: 121.1681 },
          'ANTIPOLO': { lat: 14.5873, lng: 121.1759 },
          'ANGONO': { lat: 14.5234, lng: 121.1536 },
          'BARAS': { lat: 14.5234, lng: 121.2672 },
          'BINANGONAN': { lat: 14.4514, lng: 121.1919 },
          'CAINTA': { lat: 14.5864, lng: 121.1153 },
          'CARDONA': { lat: 14.4892, lng: 121.2283 },
          'JALAJALA': { lat: 14.3547, lng: 121.3231 },
          'MORONG': { lat: 14.5186, lng: 121.2378 },
          'PILILLA': { lat: 14.4828, lng: 121.3078 },
          'RODRIGUEZ': { lat: 14.7278, lng: 121.1219 },
          'SAN_MATEO': { lat: 14.6969, lng: 121.1219 },
          'TANAY': { lat: 14.4972, lng: 121.2864 },
          'TAYTAY': { lat: 14.5569, lng: 121.1339 },
          'TERESA': { lat: 14.5614, lng: 121.1919 },
        };
        const coords = lguCoords[item.registeredLGU] || { lat: 14.6091, lng: 121.0223 };
        
        const marker = window.L.marker([coords.lat, coords.lng], { icon: acdvIcon })
          .addTo(map)
          .bindPopup(`
            <div style="min-width: 200px;">
              <h3 style="font-weight: bold; margin-bottom: 8px; color: #7C3AED;">🤝 ${item.organizationName}</h3>
              <p><strong>Office Address:</strong> ${item.officeAddress}</p>
              <p><strong>Registered LGU:</strong> ${item.registeredLGU}</p>
              <p><strong>Personnel Count:</strong> ${item.personnel.length} members</p>
              <p><strong>Members:</strong></p>
              <ul style="margin-top: 4px; padding-left: 16px;">
                ${item.personnel.slice(0, 5).map(p => `<li>${p.name} (${p.age}, ${p.gender})</li>`).join('')}
                ${item.personnel.length > 5 ? `<li>...and ${item.personnel.length - 5} more</li>` : ''}
              </ul>
            </div>
          `);
        markersRef.current.push(marker);
      });
    }
  }, [equipment, vehicles, personnel, acdvData, showEquipment, showVehicles, showPersonnel, showACDV]);

  const totalMarkers = 
    (showEquipment ? equipment.length : 0) +
    (showVehicles ? vehicles.length : 0) +
    (showPersonnel ? personnel.length : 0) +
    (showACDV ? acdvData.length : 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <span>🗺️</span>
            GIS Resource Map
          </h1>
          <p className="text-gray-500 mt-1">
            Geographic visualization of DRRM resources • {totalMarkers} items displayed
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        <div className="flex flex-wrap items-center gap-6">
          <span className="text-sm font-medium text-gray-700">Show on Map:</span>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showEquipment}
              onChange={(e) => setShowEquipment(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              Equipment ({equipment.length})
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showVehicles}
              onChange={(e) => setShowVehicles(e.target.checked)}
              className="w-4 h-4 text-green-600 rounded"
            />
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              Vehicles ({vehicles.length})
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showPersonnel}
              onChange={(e) => setShowPersonnel(e.target.checked)}
              className="w-4 h-4 text-orange-600 rounded"
            />
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
              Personnel ({personnel.length})
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showACDV}
              onChange={(e) => setShowACDV(e.target.checked)}
              className="w-4 h-4 text-purple-600 rounded"
            />
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
              ACDV ({acdvData.length})
            </span>
          </label>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div 
          ref={mapRef} 
          className="w-full h-[600px]"
          style={{ background: '#E5E7EB' }}
        >
          {!mapLoaded && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin text-4xl mb-3">🌍</div>
                <p className="text-gray-500">Loading map...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <span>📍</span> Map Legend
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">
              🔧
            </div>
            <div>
              <p className="font-medium text-gray-800">Equipment</p>
              <p className="text-sm text-gray-500">Blue markers showing equipment storage locations</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl">
              🚗
            </div>
            <div>
              <p className="font-medium text-gray-800">Vehicles</p>
              <p className="text-sm text-gray-500">Green markers showing vehicle locations</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-xl">
              👤
            </div>
            <div>
              <p className="font-medium text-gray-800">Personnel</p>
              <p className="text-sm text-gray-500">Orange markers showing personnel deployment areas</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl">
              🤝
            </div>
            <div>
              <p className="font-medium text-gray-800">ACDV</p>
              <p className="text-sm text-gray-500">Purple markers showing ACDV organization locations</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 font-medium">Equipment Points</p>
              <p className="text-3xl font-bold text-blue-800 mt-1">
                {new Set(equipment.map(e => `${e.lat},${e.lng}`)).size}
              </p>
              <p className="text-sm text-blue-500">Unique locations</p>
            </div>
            <div className="text-4xl opacity-30">🔧</div>
          </div>
        </div>

        <div className="bg-green-50 rounded-xl p-6 border border-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 font-medium">Vehicle Points</p>
              <p className="text-3xl font-bold text-green-800 mt-1">
                {new Set(vehicles.map(v => `${v.lat},${v.lng}`)).size}
              </p>
              <p className="text-sm text-green-500">Unique locations</p>
            </div>
            <div className="text-4xl opacity-30">🚗</div>
          </div>
        </div>

        <div className="bg-orange-50 rounded-xl p-6 border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 font-medium">Personnel Points</p>
              <p className="text-3xl font-bold text-orange-800 mt-1">
                {personnel.length}
              </p>
              <p className="text-sm text-orange-500">Deployment areas</p>
            </div>
            <div className="text-4xl opacity-30">👤</div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-xl p-6 border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 font-medium">ACDV Points</p>
              <p className="text-3xl font-bold text-purple-800 mt-1">
                {acdvData.length}
              </p>
              <p className="text-sm text-purple-500">Organizations</p>
            </div>
            <div className="text-4xl opacity-30">🤝</div>
          </div>
        </div>
      </div>
    </div>
  );
}
