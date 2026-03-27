export interface DetectedVehicle {
  id: string;
  label: string;
  speed: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  confidence: number;
}

export interface VehicleRecord {
  id: string;
  vehicle: DetectedVehicle;
  snapshot: string; // base64 image
  timestamp: number;
  isOverspeeding: boolean;
  location?: string;
}

export interface DetectionResult {
  vehicles: DetectedVehicle[];
  timestamp: number;
  frameId: number;
}

export interface ApiConfig {
  baseUrl: string;
  frameInterval: number;
}

export const SPEED_LIMIT = 60; // km/h
