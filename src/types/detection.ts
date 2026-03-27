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

export interface DetectionResult {
  vehicles: DetectedVehicle[];
  timestamp: number;
  frameId: number;
}

export interface ApiConfig {
  baseUrl: string;
  frameInterval: number; // ms between frame captures
}
