
import type { Driver, Vehicle, EmergencyAlert, Report } from "@/lib/types";

export const placeholderImages = {
  userAvatar: "https://picsum.photos/seed/1/100/100",
  map: "https://picsum.photos/seed/map/1200/800",
};

export const drivers: Driver[] = [
  { 
    id: "DRV001", 
    legalName: "Alice Johnson", 
    status: "Online", 
    activeVehicleId: "VH001", 
    photoUrl: "https://picsum.photos/seed/2/100/100",
    contact: { email: "alice.j@example.com", phone: "123-456-7890" },
    performance: { score: 95, tripsCompleted: 120, avgSpeed: 45 },
    credentials: [{ type: "Driving License", fileUrl: "#", expiresAt: "2025-12-31" }],
    createdAt: "2023-01-15T09:00:00Z"
  },
  { 
    id: "DRV002", 
    legalName: "Bob Williams", 
    status: "Offline", 
    activeVehicleId: "VH002", 
    photoUrl: "https://picsum.photos/seed/3/100/100",
    contact: { email: "bob.w@example.com", phone: "123-456-7891" },
    performance: { score: 88, tripsCompleted: 98, avgSpeed: 42 },
    credentials: [{ type: "Driving License", fileUrl: "#", expiresAt: "2026-06-30" }],
    createdAt: "2023-02-20T11:00:00Z"
  },
  { 
    id: "DRV003", 
    legalName: "Charlie Brown", 
    status: "Online", 
    activeVehicleId: "VH003", 
    photoUrl: "https://picsum.photos/seed/4/100/100",
    contact: { email: "charlie.b@example.com", phone: "123-456-7892" },
    performance: { score: 92, tripsCompleted: 150, avgSpeed: 48 },
    credentials: [{ type: "Driving License", fileUrl: "#", expiresAt: "2025-08-15" }],
    createdAt: "2023-03-10T14:30:00Z"
  },
];

export const vehicles: Vehicle[] = [
  { 
    id: "VH001", 
    make: "Toyota", 
    model: "Camry", 
    year: 2022, 
    plateNumber: "AB 123 CD", 
    chassisNumber: "12345ABC",
    driverId: "DRV001", 
    status: "Moving", 
    insurance: { provider: "AllState", policyNo: "XYZ123", expiresAt: "2025-01-01T00:00:00Z" },
    maintenance: [],
    registrationDocs: [],
    location: { lat: 34.0522, lng: -118.2437 }
  },
  { 
    id: "VH002", 
    make: "Ford", 
    model: "F-150", 
    year: 2021, 
    plateNumber: "EF 456 GH", 
    chassisNumber: "67890DEF",
    driverId: "DRV002", 
    status: "Idle",
    insurance: { provider: "Geico", policyNo: "XYZ456", expiresAt: "2025-02-01T00:00:00Z" },
    maintenance: [],
    registrationDocs: [],
    location: { lat: 34.06, lng: -118.25 }
  },
  { 
    id: "VH003", 
    make: "Mercedes-Benz", 
    model: "Sprinter", 
    year: 2023, 
    plateNumber: "IJ 789 KL", 
    chassisNumber: "13579GHI",
    driverId: "DRV003", 
    status: "Emergency",
    insurance: { provider: "Progressive", policyNo: "XYZ789", expiresAt: "2025-03-01T00:00:00Z" },
    maintenance: [],
    registrationDocs: [],
    location: { lat: 34.04, lng: -118.26 }
  },
    {
    id: 'VH004',
    make: 'Honda',
    model: 'Civic',
    year: 2020,
    plateNumber: 'MN 012 OP',
    chassisNumber: 'ABC123XYZ',
    driverId: 'DRV004',
    status: 'Moving',
    insurance: {
      provider: 'State Farm',
      policyNo: 'POL456',
      expiresAt: '2024-12-31T23:59:59Z',
    },
    maintenance: [
      {
        date: '2023-10-15T00:00:00Z',
        type: 'Oil Change',
        notes: 'Regular service',
        cost: 75,
      },
    ],
    registrationDocs: [
      {
        fileUrl: '#',
        type: 'Vehicle Registration',
        expiresAt: '2025-06-30T23:59:59Z',
      },
    ],
    location: { lat: 40.7128, lng: -74.006 },
  },
  {
    id: 'VH005',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    plateNumber: 'QR 345 ST',
    chassisNumber: 'DEF456ABC',
    driverId: 'DRV005',
    status: 'Idle',
    insurance: {
      provider: 'Liberty Mutual',
      policyNo: 'POL789',
      expiresAt: '2025-01-20T23:59:59Z',
    },
    maintenance: [],
    registrationDocs: [
      {
        fileUrl: '#',
        type: 'Vehicle Registration',
        expiresAt: '2025-08-01T23:59:59Z',
      },
    ],
    location: { lat: 37.7749, lng: -122.4194 },
  },
];

export const emergencyAlerts: EmergencyAlert[] = [
  { id: "ALT001", vehicleId: "VH003", driverId: "DRV003", timestamp: "2024-05-21T14:35:00Z", location: { lat: 40.7128, lng: -74.0060 }, details: "Vehicle collision reported on Brooklyn Bridge. Driver unresponsive.", status: "New", priority: "high" },
  { id: "ALT002", vehicleId: "VH001", driverId: "DRV001", timestamp: "2024-05-21T14:30:00Z", location: { lat: 34.0522, lng: -118.2437 }, details: "Driver reports sudden engine failure on I-5. Vehicle is stopped in the right lane.", status: "New", priority: "medium" },
  { id: "ALT003", vehicleId: "VH004", driverId: "DRV004", timestamp: "2024-05-21T14:20:00Z", location: { lat: 41.8781, lng: -87.6298 }, details: "Geofence breached: Vehicle has entered a restricted industrial zone.", status: "Resolved", priority: "low", analysis: { priority: 'low', suggestedActions: 'Contact driver to confirm status and reason for entering the zone. No immediate dispatch needed.', reasoning: 'Geofence breach is a low-priority event unless other factors suggest a security risk.' } },
];

export const reports: Report[] = [
    { id: "REP001", title: "Q1 Vehicle Usage Summary", generatedAt: "2024-04-01", type: "Usage", generatedBy: "USR001", filters: {}, dataSummary: {}, fileUrl: "#" },
    { id: "REP002", title: "March Driver Activity", generatedAt: "2024-04-01", type: "Activity", generatedBy: "USR001", filters: {}, dataSummary: {}, fileUrl: "#" },
    { id: "REP003", title: "Q1 Emergency Alerts", generatedAt: "2024-04-02", type: "Alerts", generatedBy: "USR002", filters: {}, dataSummary: {}, fileUrl: "#" },
];

export const summaryStats = {
    totalVehicles: vehicles.length,
    driversOnline: drivers.filter(d => d.status === 'Online').length,
    driversOnlinePercentage: Math.round((drivers.filter(d => d.status === 'Online').length / drivers.length) * 100),
    activeAlerts: emergencyAlerts.filter(a => a.status !== 'Resolved').length,
    fleetActivityPercentage: Math.round((vehicles.filter(v => v.status === 'Moving').length / vehicles.length) * 100)
}

export const recentAlerts = emergencyAlerts.slice(0, 3);

export const vehicleStatusData = [
  { status: 'moving', count: vehicles.filter(v => v.status === 'Moving').length, fill: 'var(--color-moving)' },
  { status: 'idle', count: vehicles.filter(v => v.status === 'Idle').length, fill: 'var(--color-idle)' },
  { status: 'emergency', count: vehicles.filter(v => v.status === 'Emergency').length, fill: 'var(--color-emergency)' },
];

    
