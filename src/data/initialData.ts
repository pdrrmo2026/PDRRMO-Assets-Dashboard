import { Equipment, Vehicle, Personnel, ACDV } from '../types';

// Permanent baseline snapshot of all encoded records from Supabase
export const initialEquipment: Equipment[] = [
  {
    "id": "4129d5c7-4d5b-49cb-92e3-f15278d0ef8e",
    "name": "Life jacket with reflectorized",
    "type": "Other",
    "quantity": 9,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 0,
    "lng": 0,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-10"
  },
  {
    "id": "39c6c0ad-ea12-4ea4-8db2-c3973345b26e",
    "name": "Water Proof rechargeable Head light",
    "type": "Search Equipment",
    "quantity": 5,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 0,
    "lng": 0,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-10"
  },
  {
    "id": "e5b45b94-0927-49d0-8435-81c0d345b385",
    "name": "Megaphone",
    "type": "Communication Equipment",
    "quantity": 3,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 0,
    "lng": 0,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-10"
  },
  {
    "id": "2ad5948f-a95d-4779-b321-4091df23ee5a",
    "name": "Pick mattock",
    "type": "Rescue Equipment",
    "quantity": 2,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 0,
    "lng": 0,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-10"
  },
  {
    "id": "409c9ac0-412f-45c9-9313-290531a37b12",
    "name": "Reflectorized Vest",
    "type": "Other",
    "quantity": 2,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 0,
    "lng": 0,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-10"
  },
  {
    "id": "5867c2f5-9b28-43ce-904d-cbe8b3d0c7c6",
    "name": "Spine board",
    "type": "Medical Equipment",
    "quantity": 1,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 0,
    "lng": 0,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-10"
  },
  {
    "id": "7055a356-b22f-4de9-b317-2cd9ed665bfe",
    "name": "Shovel with pick mattock",
    "type": "Rescue Equipment",
    "quantity": 35,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 0,
    "lng": 0,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-10"
  },
  {
    "id": "35dd69a2-2568-46e3-a1ad-74d617ea8f4f",
    "name": "Warrior Aid Litter kit",
    "type": "Medical Equipment",
    "quantity": 1,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 0,
    "lng": 0,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-10"
  },
  {
    "id": "3d8da91b-1d42-4916-8e32-8d2f5b38d7c3",
    "name": "Sledge Hammer",
    "type": "Rescue Equipment",
    "quantity": 2,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 0,
    "lng": 0,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-10"
  },
  {
    "id": "d57679b7-4af2-4052-b6cf-b0c906523808",
    "name": "Cow Bar",
    "type": "Rescue Equipment",
    "quantity": 2,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 0,
    "lng": 0,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-10"
  },
  {
    "id": "dd4eade5-35ae-442a-9e3c-f4d96e335be7",
    "name": "Safety Goggles",
    "type": "Rescue Equipment",
    "quantity": 9,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 0,
    "lng": 0,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-10"
  },
  {
    "id": "34866612-8494-4f8c-b661-0393f08144c9",
    "name": "Hard Hat",
    "type": "Rescue Equipment",
    "quantity": 6,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 0,
    "lng": 0,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-10"
  },
  {
    "id": "58b0fd3e-0305-4902-b33a-a7db51626ab0",
    "name": "Chain saw (concrete cement)",
    "type": "Rescue Equipment",
    "quantity": 1,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 0,
    "lng": 0,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-10"
  },
  {
    "id": "c4a305cd-56c5-4349-a3d9-af778215fe40",
    "name": "Chain saw (wood)",
    "type": "Rescue Equipment",
    "quantity": 1,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 0,
    "lng": 0,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-10"
  },
  {
    "id": "d21bc725-0992-4446-b05e-46b2be2b95a8",
    "name": "Fire Axe",
    "type": "Rescue Equipment",
    "quantity": 4,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 0,
    "lng": 0,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-10"
  },
  {
    "id": "37673420-f5b5-4f1c-83c7-d719e1a80d72",
    "name": "Goggles",
    "type": "Water Rescue",
    "quantity": 9,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 0,
    "lng": 0,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-10"
  },
  {
    "id": "72cb5a7b-d534-43c0-bc45-65032e4c6bca",
    "name": "Rescue Jacket",
    "type": "Rescue Equipment",
    "quantity": 2,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 0,
    "lng": 0,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-10"
  },
  {
    "id": "2a6668c4-7a71-4056-9429-b62d7ea593fb",
    "name": "Shovel",
    "type": "Rescue Equipment",
    "quantity": 2,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 0,
    "lng": 0,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-10"
  },
  {
    "id": "38fb9a02-488c-4863-9333-6a53e6531852",
    "name": "Floating spine board",
    "type": "Medical Equipment",
    "quantity": 1,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 0,
    "lng": 0,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-10"
  },
  {
    "id": "0d57c810-34e3-4ad3-a80f-8f8f3e24615e",
    "name": "Life bouy (interior tire)",
    "type": "Water Rescue",
    "quantity": 4,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 0,
    "lng": 0,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-10"
  },
  {
    "id": "ce3790df-bbbe-4ed7-9dd4-4e43aed48daf",
    "name": "Life Jacket ",
    "type": "Water Rescue",
    "quantity": 10,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 0,
    "lng": 0,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-10"
  }
];

export const initialVehicles: Vehicle[] = [
  {
    "id": "c03e51d9-b8e5-44d3-b02a-82cd7eb1bd5d",
    "plateNumber": "",
    "type": "Other",
    "brand": "Dump Trucks",
    "model": "",
    "capacity": "",
    "quantity": 8,
    "condition": "Good",
    "location": "Tanay",
    "lat": 14.6042,
    "lng": 121.1681,
    "agency": "DPWH_DEO2",
    "dateAdded": "2026-07-06"
  },
  {
    "id": "12f08b40-79fa-4b9f-ad65-5c3deffed3bc",
    "plateNumber": "",
    "type": "Other",
    "brand": "Loader",
    "model": "",
    "capacity": "",
    "quantity": 2,
    "condition": "Good",
    "location": "Tanay",
    "lat": 14.6042,
    "lng": 121.1681,
    "agency": "DPWH_DEO2",
    "dateAdded": "2026-07-06"
  },
  {
    "id": "2b699974-11e4-42d6-8214-3e77e1119905",
    "plateNumber": "",
    "type": "Service Vehicle",
    "brand": "Service Vehicle",
    "model": "",
    "capacity": "",
    "quantity": 1,
    "condition": "Good",
    "location": "Montalban",
    "lat": 14.6042,
    "lng": 121.1681,
    "agency": "DPWH_DEO2",
    "dateAdded": "2026-07-06"
  },
  {
    "id": "3abaa63e-1b54-4029-96f9-aa260d83838e",
    "plateNumber": "",
    "type": "Other",
    "brand": "Backhoe loader",
    "model": "",
    "capacity": "",
    "quantity": 1,
    "condition": "Good",
    "location": "Montalban",
    "lat": 14.6042,
    "lng": 121.1681,
    "agency": "DPWH_DEO2",
    "dateAdded": "2026-07-06"
  },
  {
    "id": "6de7a193-5a45-401d-9184-99643df4e503",
    "plateNumber": "",
    "type": "Other",
    "brand": "Payloader",
    "model": "",
    "capacity": "",
    "quantity": 1,
    "condition": "Good",
    "location": "Tanay",
    "lat": 14.6042,
    "lng": 121.1681,
    "agency": "DPWH_DEO2",
    "dateAdded": "2026-07-06"
  },
  {
    "id": "8f48e52c-f869-4599-b0b5-2692b9bd885c",
    "plateNumber": "",
    "type": "Other",
    "brand": "Skid Loader",
    "model": "HI-RO Skid Loader",
    "capacity": "",
    "quantity": 1,
    "condition": "Good",
    "location": "DEO I- Binangonan  ",
    "lat": 14.6042,
    "lng": 121.1681,
    "agency": "DPWH_DEO1",
    "dateAdded": "2026-06-30"
  },
  {
    "id": "2d1185c8-565b-44bb-b21d-19efe5f07dbe",
    "plateNumber": "",
    "type": "Other",
    "brand": "Isuzu ",
    "model": " NQR 6-Wheeler Light Dump Truck",
    "capacity": "",
    "quantity": 1,
    "condition": "Good",
    "location": "DEO I- Binangonan  ",
    "lat": 14.6042,
    "lng": 121.1681,
    "agency": "DPWH_DEO1",
    "dateAdded": "2026-06-30"
  },
  {
    "id": "b263d3e7-c21a-4ebf-8664-58f2a052caa8",
    "plateNumber": "",
    "type": "Other",
    "brand": "Hyundai ",
    "model": " 6-Wheeler Light Mini Dump Truck ",
    "capacity": "",
    "quantity": 1,
    "condition": "Good",
    "location": "DEO I- Binangonan",
    "lat": 14.6042,
    "lng": 121.1681,
    "agency": "DPWH_DEO1",
    "dateAdded": "2026-06-30"
  },
  {
    "id": "9617bbdb-8898-4c37-a443-b967f54fb500",
    "plateNumber": "",
    "type": "Other",
    "brand": "Dump Truck ",
    "model": "MAN Dump Truck ",
    "capacity": "",
    "quantity": 1,
    "condition": "Good",
    "location": "DEO I- Binangonan",
    "lat": 14.6042,
    "lng": 121.1681,
    "agency": "DPWH_DEO1",
    "dateAdded": "2026-06-30"
  },
  {
    "id": "80a5d225-6e40-478a-9acf-23d5a0495fb0",
    "plateNumber": "",
    "type": "Other",
    "brand": "Mitsubishi ",
    "model": "Canter, Dropside Truck w/ Boom ",
    "capacity": "",
    "quantity": 1,
    "condition": "Good",
    "location": "DEO I- Binangonan",
    "lat": 14.6042,
    "lng": 121.1681,
    "agency": "DPWH_DEO1",
    "dateAdded": "2026-06-30"
  },
  {
    "id": "cfd9ff1c-640a-42dd-91cc-24c61fc8e4f7",
    "plateNumber": "",
    "type": "Other",
    "brand": "Backhoe Loader",
    "model": "CASE Backhoe Loader ",
    "capacity": "",
    "quantity": 1,
    "condition": "Good",
    "location": "DEO I- Binangonan",
    "lat": 14.6042,
    "lng": 121.1681,
    "agency": "DPWH_DEO1",
    "dateAdded": "2026-06-30"
  },
  {
    "id": "e3fc5c25-75b7-484d-b5d1-ec94bfaa1f2d",
    "plateNumber": "",
    "type": "Water Tanker",
    "brand": "Water Truck",
    "model": "HINO Water Truck",
    "capacity": "",
    "quantity": 1,
    "condition": "Good",
    "location": "DEO I- Binangonan",
    "lat": 14.6042,
    "lng": 121.1681,
    "agency": "DPWH_DEO1",
    "dateAdded": "2026-06-30"
  },
  {
    "id": "e466fcad-eb04-49df-9a14-ac5f4fb5b688",
    "plateNumber": "",
    "type": "Other",
    "brand": "Mini Dump Truck",
    "model": "Sino Truck Homan Mini Dump Truck",
    "capacity": "",
    "quantity": 1,
    "condition": "Good",
    "location": "DEO I- Binangonan",
    "lat": 14.6042,
    "lng": 121.1681,
    "agency": "DPWH_DEO1",
    "dateAdded": "2026-06-30"
  },
  {
    "id": "d2edc73a-e3da-4757-9f0e-16b2ff170240",
    "plateNumber": "",
    "type": "Other",
    "brand": "Isuzu",
    "model": "Boom Truck w/ Sangdo Telescopic Boom",
    "capacity": "",
    "quantity": 1,
    "condition": "Good",
    "location": "DEO I- Binangonan",
    "lat": 14.6042,
    "lng": 121.1681,
    "agency": "DPWH_DEO1",
    "dateAdded": "2026-06-30"
  },
  {
    "id": "f353804c-a5ac-49f0-970d-105660db7da4",
    "plateNumber": "",
    "type": "Other",
    "brand": "Excavator",
    "model": "Hydraulic Excavator w/ Long Arm Reach ",
    "capacity": "",
    "quantity": 1,
    "condition": "Good",
    "location": "DEO I- Binangonan",
    "lat": 14.6042,
    "lng": 121.1681,
    "agency": "DPWH_DEO1",
    "dateAdded": "2026-06-30"
  },
  {
    "id": "e3a14ca6-2b3a-4212-aece-c0b94a7fa861",
    "plateNumber": "",
    "type": "Other",
    "brand": "Excavator",
    "model": "HYDRAULIC EXCAVATOR, WHEEL MOUNTED",
    "capacity": "",
    "quantity": 1,
    "condition": "Good",
    "location": "DEO I- Binangonan",
    "lat": 14.6042,
    "lng": 121.1681,
    "agency": "DPWH_DEO1",
    "dateAdded": "2026-06-30"
  },
  {
    "id": "f185d098-a8b3-4da0-8547-611b3684cbed",
    "plateNumber": "",
    "type": "Other",
    "brand": "",
    "model": "Motorcycle",
    "capacity": "",
    "quantity": 12,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 14.6042,
    "lng": 121.1681,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-16"
  },
  {
    "id": "e81da84d-dac1-4008-9a1c-c1d6d32014b1",
    "plateNumber": "",
    "type": "Service Vehicle",
    "brand": "Toyota",
    "model": "Hi-Lux",
    "capacity": "",
    "quantity": 1,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 14.6042,
    "lng": 121.1681,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-16"
  },
  {
    "id": "15e6068c-2f46-4ef2-ac32-9aab6d8728cc",
    "plateNumber": "",
    "type": "Service Vehicle",
    "brand": "Mitsubishi",
    "model": "Estrada",
    "capacity": "",
    "quantity": 1,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 14.6042,
    "lng": 121.1681,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-16"
  },
  {
    "id": "cf1d1981-25b9-4f93-8318-8f8c8e161d7c",
    "plateNumber": "",
    "type": "Other",
    "brand": "TROOP CARRIER",
    "model": "KM450",
    "capacity": "",
    "quantity": 10,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 14.6042,
    "lng": 121.1681,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-16"
  },
  {
    "id": "07f512e7-45c2-4ed7-9581-e9f43b91f5fa",
    "plateNumber": "",
    "type": "Other",
    "brand": "TROOP CARRIER",
    "model": "KM451",
    "capacity": "",
    "quantity": 1,
    "condition": "Good",
    "location": "Baras Rizal",
    "lat": 14.6042,
    "lng": 121.1681,
    "agency": "IB_80TH",
    "dateAdded": "2026-06-16"
  }
];

export const initialPersonnel: Personnel[] = [
  {
    "id": "94b24bac-0a88-415c-b53a-4dff3ec5f037",
    "name": "ALLAN V. PATAG",
    "position": "Operations Officer",
    "agency": "PDRRMO",
    "contact": "09951887343",
    "trainings": [
      "Basic Life Support",
      "First Aid",
      "Incident Command System",
      "Radio Communication",
      "RDANA",
      "MDM",
      "CBDRRM"
    ],
    "status": "Active",
    "hadrTeam": [
      "EOC",
      "Radio Communication",
      "IT / Data Management",
      "MDM"
    ],
    "dateAdded": "2026-10-29"
  },
  {
    "id": "8859a510-8d1c-412d-a283-095ee0ca42dc",
    "name": "Eliza Ablay",
    "position": "Medical Responder",
    "agency": "PDRRMO",
    "contact": "",
    "trainings": [
      "Basic Life Support",
      "First Aid",
      "Water / Flood Search and Rescue Teams",
      "High Angle Rescue",
      "Swift Water Rescue",
      "Medical Emergency Response",
      "Basic Fire fighting",
      "EMT"
    ],
    "status": "Active",
    "hadrTeam": [
      "Water / Flood Search and Rescue Teams",
      "Medical Emergency Response"
    ],
    "dateAdded": "2026-07-02"
  },
  {
    "id": "30f3b8c1-d1ad-4e25-8a71-3f435a9e3d02",
    "name": "Junabeth Barleta",
    "position": "Medical Responder",
    "agency": "PDRRMO",
    "contact": "",
    "trainings": [
      "Basic Life Support",
      "First Aid",
      "Incident Command System",
      "EOC",
      "A bomb that kill and destroy",
      "BLS (AED)",
      "Defensive Driving",
      "health care Provider NC II"
    ],
    "status": "Active",
    "hadrTeam": [],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "5c83b42f-fa94-4311-a72b-5323145222e4",
    "name": "Jeralden Valle",
    "position": "Medical Responder",
    "agency": "PDRRMO",
    "contact": "",
    "trainings": [
      "First Aid",
      "Basic Life Support",
      "Incident Command System",
      "BLS Hands only",
      "A bomb that kills and destroy lives"
    ],
    "status": "Active",
    "hadrTeam": [],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "823741de-b168-4932-bb37-6235aedf2e05",
    "name": "Sgt Jessie A Zarza ",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "Water / Flood Search and Rescue Teams",
      "EARTHQUAKE LANDSLIDE SEARCH & RESCUE TRNG"
    ],
    "status": "Active",
    "hadrTeam": [
      "Water / Flood Search and Rescue Teams",
      "Urban Search and Rescue (USAR) Team"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "a395db6f-4955-493f-acf1-64e3ab2bfee9",
    "name": "SSg Miguel C Wong Jr ",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "EARTHQUAKE LANDSLIDE SEARCH & RESCUE TRNG"
    ],
    "status": "Active",
    "hadrTeam": [
      "Urban Search and Rescue (USAR) Team"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "877b1d77-051c-4f3f-9828-9678b2eafee2",
    "name": "Sgt Richard J Requilino ",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "DISASTER RESPONSE OPNS TRNG ",
      "COMBAT LIFE SAVER TRAINING "
    ],
    "status": "Active",
    "hadrTeam": [
      "Generalist SRR"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "3c5f6fdb-1bbd-476c-9c2a-e35d81e061ba",
    "name": "Cpl Leonilo C Villaruel Jr",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "Water / Flood Search and Rescue Teams"
    ],
    "status": "Active",
    "hadrTeam": [
      "Water / Flood Search and Rescue Teams"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "f6f87049-c3c5-4359-a004-7bab96ae4c87",
    "name": "Cpl Jerome F Benitez",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "Disaster Response & Rescue Opns Trng"
    ],
    "status": "Active",
    "hadrTeam": [
      "Generalist SRR"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "9836e263-4ac8-4e59-b58d-55b8d7f1af87",
    "name": "SSg Ricardo V Antolin III",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "Humanitarian Asst & Disaster Resp Trng"
    ],
    "status": "Active",
    "hadrTeam": [
      "Camp Management Team (CMT)"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "6613fd1f-7170-48cf-afb4-f64eeb16bdd0",
    "name": "SSg Mark H Farenas",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "Humanitarian Asst & Disaster Resp Trng"
    ],
    "status": "Active",
    "hadrTeam": [
      "Camp Management Team (CMT)"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "a36707d9-178c-489c-b079-d4a8106bdfcd",
    "name": "Sgt Ronel D Macanas",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "Disaster Response & Rescue Opns Trng"
    ],
    "status": "Active",
    "hadrTeam": [
      "Generalist SRR"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "1d11418d-7eda-4839-9694-131adaa2968b",
    "name": "Sgt Ronidel C Escobal",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "Disaster Response & Rescue Opns Trng"
    ],
    "status": "Active",
    "hadrTeam": [
      "Generalist SRR"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "65502637-f9ba-4f73-a086-a1d8172be0f6",
    "name": "MSg Junifer B Lalata",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "Humanitarian Asst & Disaster Resp Trng"
    ],
    "status": "Active",
    "hadrTeam": [
      "Camp Management Team (CMT)"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "0ac7e635-45f3-4f87-81a8-2649b2680765",
    "name": "2LT DAVE RIEL A JAMANDRON",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "Water / Flood Search and Rescue Teams"
    ],
    "status": "Active",
    "hadrTeam": [
      "Water / Flood Search and Rescue Teams"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "af61b7e3-b9e1-421b-9e9b-8b753708543b",
    "name": "Pvt Justine R Buena",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "Water / Flood Search and Rescue Teams"
    ],
    "status": "Active",
    "hadrTeam": [
      "Water / Flood Search and Rescue Teams"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "2180afa8-4e3c-49a4-bdff-9beba9811225",
    "name": "Pvt John Daniel V Dela Torre ",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "Water / Flood Search and Rescue Teams"
    ],
    "status": "Active",
    "hadrTeam": [
      "Mountain / Wilderness SRR"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "b8141ae4-90e0-4a5b-b0d7-4d0378daa137",
    "name": "Cpl Erwin R Antonio ",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "DISASTER RELIEF & RESCUE OPN TRNG"
    ],
    "status": "Active",
    "hadrTeam": [
      "Generalist SRR"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "ccb808ac-3ff6-48ee-b293-fead20b39b29",
    "name": "Sgt Jessie A Zarza",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      " EARTHQUAKE LANDSLIDE SEARCH & RESCUE TRNG",
      "Water / Flood Search and Rescue Teams"
    ],
    "status": "Active",
    "hadrTeam": [
      "Urban Search and Rescue (USAR) Team",
      "Water / Flood Search and Rescue Teams"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "1025e21b-8d1b-40e0-bb61-7b78d75886d6",
    "name": "SSg Miguel C Wong Jr",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "EARTHQUAKE LANDSLIDE SEARCH & RESCUE TRNG"
    ],
    "status": "Active",
    "hadrTeam": [
      "Urban Search and Rescue (USAR) Team"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "642cd562-f361-456d-8452-27823e9fe935",
    "name": "SSg Ronelo B Dayao",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "HADR"
    ],
    "status": "Active",
    "hadrTeam": [
      "Camp Management Team (CMT)"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "c496a36e-d1aa-4e17-bc98-270336002aca",
    "name": "PFC John Ric C Mirador ",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "CBT LIFE SAVER TRNG"
    ],
    "status": "Active",
    "hadrTeam": [
      "Generalist SRR"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "c3b2c478-b4f0-4b4b-b9d0-54ff1d3f8972",
    "name": "PFC Samuel C Gregorio ",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "TACTICAL COMBAT CASUALTY CARE"
    ],
    "status": "Active",
    "hadrTeam": [
      "Urban Search and Rescue (USAR) Team"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "2dffaaf2-0175-4425-af88-78316216d548",
    "name": "PFC Crisostomo D Malic Jr ",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "Mountain / Wilderness SRR"
    ],
    "status": "Active",
    "hadrTeam": [
      "Mountain / Wilderness SRR"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "cf113a56-a17b-4a98-a446-5d8ceae3524d",
    "name": "Cpl Marco C Landicho",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "TACTICAL COMBAT CASUALTY CARE"
    ],
    "status": "Active",
    "hadrTeam": [
      "Urban Search and Rescue (USAR) Team"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "a015326e-40bf-4ad0-a87b-1fb9e33184b9",
    "name": "Cpl Rebecca G Victorio",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "Water / Flood Search and Rescue Teams"
    ],
    "status": "Active",
    "hadrTeam": [
      "Water / Flood Search and Rescue Teams"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "339ce965-ad1a-430b-ab33-ba166b2fd241",
    "name": "Cpl Roldan F Ramos",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "Water / Flood Search and Rescue Teams",
      "COMBAT LIFE SAVER TRNG"
    ],
    "status": "Active",
    "hadrTeam": [
      "Water / Flood Search and Rescue Teams",
      "Generalist SRR"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "56d39ea9-612d-4508-b3a4-c97c4c13e64a",
    "name": "Cpl Arnel A Limboy",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "CASUALTY MANAGEMENT AND EVACUATION TRAINING"
    ],
    "status": "Active",
    "hadrTeam": [
      "Urban Search and Rescue (USAR) Team"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "d8ccb83d-d899-42e6-ae1c-abf5ec9f817c",
    "name": "Cpl Ramel R Casquite",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "DISASTER RESPONSE & RESCUE OPERATION"
    ],
    "status": "Active",
    "hadrTeam": [
      "Generalist SRR"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "c653beeb-b91b-4386-9cde-983b05c33923",
    "name": "Cpl George O Basilides",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "COMBAT LIFE SAVER TRAINING"
    ],
    "status": "Active",
    "hadrTeam": [
      "Generalist SRR"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "a6f38f8c-b1c1-491f-aa2a-51aa9c290a0e",
    "name": "Sgt Genecis D Briñas",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "COMBAT LIFE SAVER TRNG"
    ],
    "status": "Active",
    "hadrTeam": [
      "Generalist SRR"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "04125b10-ccf1-4d8f-a181-549c9eba21ae",
    "name": "TSg Jayson M Saño",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "COMBAT LIFE SAVER TRNG"
    ],
    "status": "Active",
    "hadrTeam": [
      "Generalist SRR"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "ca0a593e-2ca5-48fe-987b-48f494dc833b",
    "name": "Cpl Lozenco F Bitor",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "COMBAT LIFE SAVER TRNG"
    ],
    "status": "Active",
    "hadrTeam": [
      "Generalist SRR"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "d806e875-8fb8-4fbb-bdcf-9dcb4cf2cc7d",
    "name": "Cpl Eric John L Ordoñez",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "DISASTER RESPONSE & RESCUE OPERATION"
    ],
    "status": "Active",
    "hadrTeam": [
      "Generalist SRR"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "51229497-ea61-4076-ae5c-8faa8ddd77ad",
    "name": "Cpl Richard M Casillan",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "COMBAT LIFE SAVER TRAINING"
    ],
    "status": "Active",
    "hadrTeam": [
      "Generalist SRR"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "14e55fc9-4efa-4b39-b925-70a03a8a95e7",
    "name": "Sgt Scott Peter Boy G Amarante",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "CASUALTY MGT AND EVAC TRNG"
    ],
    "status": "Active",
    "hadrTeam": [
      "Generalist SRR"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "606acd86-a59f-41db-8f0e-e2a23aeb114a",
    "name": "Sgt Jefferson O Balmes",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "COMBAT LIFE SAVER TRNG"
    ],
    "status": "Active",
    "hadrTeam": [
      "Generalist SRR"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "397d4be7-d171-4838-a62b-4b910f750d86",
    "name": "Sgt Joeper P Onod",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "DISASTER RESCUE & RELIEF OPNS TRNG"
    ],
    "status": "Active",
    "hadrTeam": [
      "Generalist SRR"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "16005797-626f-4144-b4db-85743406785c",
    "name": "Sgt Richard J Requilino",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "First Aid",
      "Search and Rescue",
      "DISAS MGMT - STANDARD FIRST AID TRNG - LAY RESCUER ",
      " DISASTER RESPONSE OPNS TRNG",
      "COMBAT LIFE SAVER TRAINING"
    ],
    "status": "Active",
    "hadrTeam": [
      "Urban Search and Rescue (USAR) Team"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "5ae701c1-6786-4ecb-a459-2ac35387ecd9",
    "name": "Sgt Millare M Olais",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "ROPE RESCUE TRNG",
      "DISASTER EMER ASST & RESCUE TRAINING"
    ],
    "status": "Active",
    "hadrTeam": [
      "Generalist SRR"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "826990ed-75a6-42c7-8e8f-892bb5d78702",
    "name": "Sgt Domingo V Sidon Jr",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "COMBAT LIFE SAVER TRAINING"
    ],
    "status": "Active",
    "hadrTeam": [
      "Generalist SRR"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "c83b4cd5-c990-48c8-ac86-a3f2e7756224",
    "name": "SSg Ryan B Dagdag",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "COMBAT LIFE SAVERS COURSE"
    ],
    "status": "Active",
    "hadrTeam": [
      "Urban Search and Rescue (USAR) Team"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "c1d85adc-a1e7-4de7-a8b1-eaa43250aa6d",
    "name": "TSg Leonardo A Montoya",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "COMBAT LIFE SAVER TRNG"
    ],
    "status": "Active",
    "hadrTeam": [
      "Generalist SRR"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "e6a6133a-f5f0-4d27-8f13-8821de980e22",
    "name": "TSg Resunday S Delumen",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "Water / Flood Search and Rescue Teams",
      "COMBAT LIFE SAVER TRNG ",
      "EARTHQUAKE & LANDSLIDE SEARCH & RESCUE ORTN CRSE",
      "DISASTER RESCUE & RELIEF OPNS TRNG    "
    ],
    "status": "Active",
    "hadrTeam": [
      "Water / Flood Search and Rescue Teams",
      "Generalist SRR",
      "Humanitarian Supply Chain Management"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "2282e831-5b37-4bab-a122-4416a076e25c",
    "name": "TSg Arnold F Dayag ",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "COMBAT LIFE SAVER TRNG"
    ],
    "status": "Active",
    "hadrTeam": [
      "Generalist SRR"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "4692adab-4be3-460e-a289-48808296eb4d",
    "name": "TSg Joel B Carbonel",
    "position": "Other",
    "agency": "IB_80TH",
    "contact": "",
    "trainings": [
      "CBT LIFE SAVER TRNG"
    ],
    "status": "Active",
    "hadrTeam": [
      "Generalist SRR"
    ],
    "dateAdded": "2026-07-01"
  },
  {
    "id": "cf30fe32-95f7-43f6-b77f-3ae0adaf3b0b",
    "name": "Elias B. Bermundo Jr",
    "position": "Operations Staff",
    "agency": "PDRRMO",
    "contact": "",
    "trainings": [
      "Incident Command System",
      "EOC"
    ],
    "status": "Active",
    "hadrTeam": [
      "EOC"
    ],
    "dateAdded": "2026-07-01"
  }
];

export const initialACDV: ACDV[] = [];
