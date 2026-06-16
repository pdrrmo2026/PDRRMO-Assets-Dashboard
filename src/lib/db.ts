/**
 * Supabase database helper functions
 * Centralized CRUD operations para sa lahat ng tables
 */

import { supabase } from './supabase';
import type { Equipment, Vehicle, Personnel, ACDV, ACDVPersonnel } from '../types';

// ─────────────────────────────────────────────
// Type mappers: DB (snake_case) ↔ App (camelCase)
// ─────────────────────────────────────────────

function mapEquipmentFromDB(row: any): Equipment {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    quantity: row.quantity,
    condition: row.condition,
    location: row.location,
    lat: row.lat,
    lng: row.lng,
    agency: row.agency,
    dateAdded: row.date_added,
  };
}

function mapEquipmentToDB(item: Omit<Equipment, 'id' | 'dateAdded'>) {
  return {
    name: item.name,
    type: item.type,
    quantity: item.quantity,
    condition: item.condition,
    location: item.location,
    lat: item.lat,
    lng: item.lng,
    agency: item.agency,
  };
}

function mapVehicleFromDB(row: any): Vehicle {
  return {
    id: row.id,
    plateNumber: row.plate_number,
    type: row.type,
    brand: row.brand,
    model: row.model,
    capacity: row.capacity,
    quantity: row.quantity || 1,
    condition: row.condition,
    location: row.location,
    lat: row.lat,
    lng: row.lng,
    agency: row.agency,
    dateAdded: row.date_added,
  };
}

function mapVehicleToDB(item: Omit<Vehicle, 'id' | 'dateAdded'>) {
  return {
    plate_number: item.plateNumber,
    type: item.type,
    brand: item.brand,
    model: item.model,
    capacity: item.capacity,
    quantity: item.quantity,
    condition: item.condition,
    location: item.location,
    lat: item.lat,
    lng: item.lng,
    agency: item.agency,
  };
}

function mapPersonnelFromDB(row: any): Personnel {
  return {
    id: row.id,
    name: row.name,
    position: row.position,
    agency: row.agency,
    contact: row.contact,
    trainings: row.trainings ?? [],
    status: row.status,
    hadrTeam: row.hadr_team,
    dateAdded: row.date_added,
  };
}

function mapPersonnelToDB(item: Omit<Personnel, 'id' | 'dateAdded'>) {
  return {
    name: item.name,
    position: item.position,
    agency: item.agency,
    contact: item.contact,
    trainings: item.trainings,
    status: item.status,
    hadr_team: item.hadrTeam,
  };
}

function mapACDVFromDB(row: any, personnel: ACDVPersonnel[]): ACDV {
  return {
    id: row.id,
    organizationName: row.organization_name,
    officeAddress: row.office_address,
    registeredLGU: row.registered_lgu,
    personnel,
    dateAdded: row.date_added,
  };
}

function mapACDVPersonnelFromDB(row: any): ACDVPersonnel {
  return {
    id: row.id,
    name: row.name,
    age: row.age,
    gender: row.gender,
    address: row.address,
  };
}

// ─────────────────────────────────────────────
// EQUIPMENT
// ─────────────────────────────────────────────

export async function fetchEquipment(): Promise<Equipment[]> {
  const { data, error } = await supabase
    .from('equipment')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapEquipmentFromDB);
}

export async function insertEquipment(item: Omit<Equipment, 'id' | 'dateAdded'>): Promise<Equipment> {
  const { data, error } = await supabase
    .from('equipment')
    .insert(mapEquipmentToDB(item))
    .select()
    .single();

  if (error) throw error;
  return mapEquipmentFromDB(data);
}

export async function updateEquipmentInDB(item: Equipment): Promise<Equipment> {
  const { data, error } = await supabase
    .from('equipment')
    .update(mapEquipmentToDB(item))
    .eq('id', item.id)
    .select()
    .single();

  if (error) throw error;
  return mapEquipmentFromDB(data);
}

export async function deleteEquipment(id: string): Promise<void> {
  const { error } = await supabase.from('equipment').delete().eq('id', id);
  if (error) throw error;
}

// ─────────────────────────────────────────────
// VEHICLES
// ─────────────────────────────────────────────

export async function fetchVehicles(): Promise<Vehicle[]> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapVehicleFromDB);
}

export async function insertVehicle(item: Omit<Vehicle, 'id' | 'dateAdded'>): Promise<Vehicle> {
  const { data, error } = await supabase
    .from('vehicles')
    .insert(mapVehicleToDB(item))
    .select()
    .single();

  if (error) throw error;
  return mapVehicleFromDB(data);
}

export async function updateVehicleInDB(item: Vehicle): Promise<Vehicle> {
  const { data, error } = await supabase
    .from('vehicles')
    .update(mapVehicleToDB(item))
    .eq('id', item.id)
    .select()
    .single();

  if (error) throw error;
  return mapVehicleFromDB(data);
}

export async function deleteVehicle(id: string): Promise<void> {
  const { error } = await supabase.from('vehicles').delete().eq('id', id);
  if (error) throw error;
}

// ─────────────────────────────────────────────
// PERSONNEL
// ─────────────────────────────────────────────

export async function fetchPersonnel(): Promise<Personnel[]> {
  const { data, error } = await supabase
    .from('personnel')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapPersonnelFromDB);
}

export async function insertPersonnel(item: Omit<Personnel, 'id' | 'dateAdded'>): Promise<Personnel> {
  const { data, error } = await supabase
    .from('personnel')
    .insert(mapPersonnelToDB(item))
    .select()
    .single();

  if (error) throw error;
  return mapPersonnelFromDB(data);
}

export async function updatePersonnelInDB(item: Personnel): Promise<Personnel> {
  const { data, error } = await supabase
    .from('personnel')
    .update(mapPersonnelToDB(item))
    .eq('id', item.id)
    .select()
    .single();

  if (error) throw error;
  return mapPersonnelFromDB(data);
}

export async function deletePersonnel(id: string): Promise<void> {
  const { error } = await supabase.from('personnel').delete().eq('id', id);
  if (error) throw error;
}

// ─────────────────────────────────────────────
// ACDV
// ─────────────────────────────────────────────

export async function fetchACDV(): Promise<ACDV[]> {
  // Fetch ACDV orgs + their personnel using a join
  const { data, error } = await supabase
    .from('acdv')
    .select(`
      *,
      acdv_personnel (*)
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return (data ?? []).map((row: any) => {
    const personnel = (row.acdv_personnel ?? []).map(mapACDVPersonnelFromDB);
    return mapACDVFromDB(row, personnel);
  });
}

export async function insertACDV(item: Omit<ACDV, 'id' | 'dateAdded'>): Promise<ACDV> {
  // 1. Insert the ACDV organization
  const { data: acdvRow, error: acdvError } = await supabase
    .from('acdv')
    .insert({
      organization_name: item.organizationName,
      office_address: item.officeAddress,
      registered_lgu: item.registeredLGU,
    })
    .select()
    .single();

  if (acdvError) throw acdvError;

  // 2. Insert personnel members
  let insertedPersonnel: ACDVPersonnel[] = [];
  if (item.personnel.length > 0) {
    const personnelRows = item.personnel.map((p) => ({
      acdv_id: acdvRow.id,
      name: p.name,
      age: p.age,
      gender: p.gender,
      address: p.address,
    }));

    const { data: personnelData, error: personnelError } = await supabase
      .from('acdv_personnel')
      .insert(personnelRows)
      .select();

    if (personnelError) throw personnelError;
    insertedPersonnel = (personnelData ?? []).map(mapACDVPersonnelFromDB);
  }

  return mapACDVFromDB(acdvRow, insertedPersonnel);
}

export async function updateACDVInDB(item: ACDV): Promise<ACDV> {
  // 1. Update ACDV organization record
  const { data: acdvRow, error: acdvError } = await supabase
    .from('acdv')
    .update({
      organization_name: item.organizationName,
      office_address: item.officeAddress,
      registered_lgu: item.registeredLGU,
    })
    .eq('id', item.id)
    .select()
    .single();

  if (acdvError) throw acdvError;

  // 2. Delete existing personnel and re-insert (simplest sync strategy)
  const { error: deleteError } = await supabase
    .from('acdv_personnel')
    .delete()
    .eq('acdv_id', item.id);

  if (deleteError) throw deleteError;

  let updatedPersonnel: ACDVPersonnel[] = [];
  if (item.personnel.length > 0) {
    const personnelRows = item.personnel.map((p) => ({
      acdv_id: item.id,
      name: p.name,
      age: p.age,
      gender: p.gender,
      address: p.address,
    }));

    const { data: personnelData, error: personnelError } = await supabase
      .from('acdv_personnel')
      .insert(personnelRows)
      .select();

    if (personnelError) throw personnelError;
    updatedPersonnel = (personnelData ?? []).map(mapACDVPersonnelFromDB);
  }

  return mapACDVFromDB(acdvRow, updatedPersonnel);
}

export async function deleteACDV(id: string): Promise<void> {
  // acdv_personnel will cascade delete due to ON DELETE CASCADE
  const { error } = await supabase.from('acdv').delete().eq('id', id);
  if (error) throw error;
}
