import { FieldValue } from "firebase/firestore";

export type UserRole = "driver" | "manager" | "admin";

export type UserProfile = {
  id: string;
  displayName: string;
  email: string;
  phone?: string;
  role: UserRole;
  preferredLanguage?: string;
  mfaEnabled?: boolean;
  zoneId?: string;
  supervisorId?: string;
  createdAt: string;
};

export type Driver = {
  id: string; // Corresponds to a userId
  legalName: string;
  photoUrl: string;
  contact: {
    phone: string;
    email: string;
  };
  sector?: string;
  supervisorId?: string;
  credentials: {
    type: string;
    fileUrl: string;
    expiresAt?: string;
  }[];
  performance: {
    score: number;
    tripsCompleted: number;
    avgSpeed: number;
  };
  activeVehicleId?: string;
  createdAt?: string | FieldValue;
  status: "Online" | "Offline"; // App-specific status, not in DB model
};

export type AddDriver = Omit<Driver, 'id'>;

export type Vehicle = {
  id: string;
  chassisNumber: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  specs?: Record<string, any>;
  registrationDocs: {
    fileUrl: string;
    type: string;
    expiresAt?: string;
  }[];
  maintenance: {
    date: string;
    type: string;
    notes: string;
    cost?: number;
  }[];
  insurance: {
    provider: string;
    policyNo: string;
    expiresAt: string;
  };
  status: "Moving" | "Idle" | "Emergency"; // App-specific status
  driverId?: string; // App-specific status
  location: {
    lat: number;
    lng: number;
  }
};

export type EmergencyAlert = {
  id: string;
  vehicleId: string;
  driverId: string;
  timestamp: string;
  location: {
    lat: number;
    lng: number;
  };
  details: string;
  status: "New" | "Analyzing" | "Resolved";
  priority: "high" | "medium" | "low";
  analysis?: {
    priority: "high" | "medium" | "low";
    suggestedActions: string;
    reasoning: string;
  };
  createdAt?: FieldValue;
};

export type AddEmergencyAlert = Omit<EmergencyAlert, 'id'>;


export type Report = {
  id: string;
  title: string;
  type: "Usage" | "History" | "Activity" | "Alerts" | "Maintenance";
  generatedBy: string; // userId
  filters: Record<string, any>;
  generatedAt: string;
  dataSummary: Record<string, any>;
  fileUrl: string;
};
