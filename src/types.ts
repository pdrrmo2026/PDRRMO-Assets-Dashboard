// Rizal Province LGUs - 13 Municipalities + 1 City + Provincial
export const RIZAL_LGUS = [
  { code: 'PDRRMO', name: 'PDRRMO - Province of Rizal', type: 'provincial', lat: 14.6042, lng: 121.1681 },
  { code: 'ANTIPOLO', name: 'City of Antipolo', type: 'city', lat: 14.5873, lng: 121.1759 },
  { code: 'ANGONO', name: 'Municipality of Angono', type: 'municipality', lat: 14.5234, lng: 121.1536 },
  { code: 'BARAS', name: 'Municipality of Baras', type: 'municipality', lat: 14.5234, lng: 121.2672 },
  { code: 'BINANGONAN', name: 'Municipality of Binangonan', type: 'municipality', lat: 14.4514, lng: 121.1919 },
  { code: 'CAINTA', name: 'Municipality of Cainta', type: 'municipality', lat: 14.5864, lng: 121.1153 },
  { code: 'CARDONA', name: 'Municipality of Cardona', type: 'municipality', lat: 14.4892, lng: 121.2283 },
  { code: 'JALAJALA', name: 'Municipality of Jalajala', type: 'municipality', lat: 14.3547, lng: 121.3231 },
  { code: 'MORONG', name: 'Municipality of Morong', type: 'municipality', lat: 14.5186, lng: 121.2378 },
  { code: 'PILILLA', name: 'Municipality of Pililla', type: 'municipality', lat: 14.4828, lng: 121.3078 },
  { code: 'RODRIGUEZ', name: 'Municipality of Rodriguez', type: 'municipality', lat: 14.7278, lng: 121.1219 },
  { code: 'SAN_MATEO', name: 'Municipality of San Mateo', type: 'municipality', lat: 14.6969, lng: 121.1219 },
  { code: 'TANAY', name: 'Municipality of Tanay', type: 'municipality', lat: 14.4972, lng: 121.2864 },
  { code: 'TAYTAY', name: 'Municipality of Taytay', type: 'municipality', lat: 14.5569, lng: 121.1339 },
  { code: 'TERESA', name: 'Municipality of Teresa', type: 'municipality', lat: 14.5614, lng: 121.1919 },
  { code: 'BFP_RIZAL', name: 'BFP-RIZAL', type: 'agency', lat: 14.6042, lng: 121.1681 },
  { code: 'PCG_RIZAL', name: 'PCG-RIZAL', type: 'agency', lat: 14.6042, lng: 121.1681 },
  { code: 'IB_80TH', name: '80th IB-2 ID', type: 'agency', lat: 14.6042, lng: 121.1681 },
  { code: 'PNP_RIZAL', name: 'PNP-RIZAL', type: 'agency', lat: 14.6042, lng: 121.1681 },
  { code: 'DPWH_DEO1', name: 'DPWH DEO I', type: 'agency', lat: 14.6042, lng: 121.1681 },
  { code: 'DPWH_DEO2', name: 'DPWH DEO II', type: 'agency', lat: 14.6042, lng: 121.1681 },
] as const;

export type LGUCode = typeof RIZAL_LGUS[number]['code'];

export type TabType = 
  | 'dashboard' 
  | 'equipment-form' 
  | 'vehicle-form' 
  | 'personnel-form'
  | 'acdv-form'
  | 'equipment-list'
  | 'vehicle-list'
  | 'personnel-list'
  | 'acdv-list'
  | 'gis-map'
  | 'agency-downloads';

export interface Equipment {
  id: string;
  name: string;
  type: string;
  quantity: number;
  condition: 'Good' | 'Fair' | 'Poor' | 'Needs Repair' | 'Under Repair';
  location: string;
  lat: number;
  lng: number;
  agency: LGUCode;
  dateAdded: string;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  type: string;
  brand: string;
  model: string;
  capacity: string;
  quantity: number;
  condition: 'Good' | 'Fair' | 'Poor' | 'Needs Repair' | 'Under Repair';
  location: string;
  lat: number;
  lng: number;
  agency: LGUCode;
  dateAdded: string;
}

export interface Personnel {
  id: string;
  name: string;
  position: string;
  agency: LGUCode;
  contact: string;
  trainings: string[];
  status: 'Active' | 'On Leave' | 'Deployed';
  hadrTeam: string;
  dateAdded: string;
}

export interface MapMarker {
  id: string;
  type: 'equipment' | 'vehicle' | 'personnel';
  name: string;
  lat: number;
  lng: number;
  data: Equipment | Vehicle | Personnel;
}

export interface AgencyStats {
  code: LGUCode;
  name: string;
  type: string;
  equipmentCount: number;
  vehicleCount: number;
  personnelCount: number;
}

export interface ACDV {
  id: string;
  organizationName: string;
  officeAddress: string;
  registeredLGU: LGUCode;
  personnel: ACDVPersonnel[];
  dateAdded: string;
}

export interface ACDVPersonnel {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  address: string;
}
