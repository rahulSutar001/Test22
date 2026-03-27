import { useState, useRef, useCallback } from "react";
import type { DetectedVehicle, VehicleRecord } from "@/types/detection";
import { SPEED_LIMIT } from "@/types/detection";

const MOCK_VEHICLES: DetectedVehicle[] = [
  {
    id: "v1",
    label: "Car",
    speed: 62,
    bbox: { x: 15, y: 35, width: 22, height: 18 },
    confidence: 0.94,
  },
  {
    id: "v2",
    label: "Truck",
    speed: 48,
    bbox: { x: 55, y: 40, width: 28, height: 22 },
    confidence: 0.87,
  },
];

const API_BASE_URL = "http://localhost:8000";

export const useDetection = () => {
  const [vehicles, setVehicles] = useState<DetectedVehicle[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [fps, setFps] = useState(0);
  const [isDetecting, setIsDetecting] = useState(false);
  const [history, setHistory] = useState<VehicleRecord[]>([]);
  const [overspeedAlert, setOverspeedAlert] = useState<VehicleRecord | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const frameCountRef = useRef(0);
  const lastFpsTimeRef = useRef(Date.now());
  const loggedIdsRef = useRef<Set<string>>(new Set());
  const latestFrameRef = useRef<string | null>(null);

  const addToHistory = useCallback((vehicle: DetectedVehicle, snapshot: string) => {
    const record: VehicleRecord = {
      id: `${vehicle.id}-${Date.now()}`,
      vehicle,
      snapshot,
      timestamp: Date.now(),
      isOverspeeding: vehicle.speed > SPEED_LIMIT,
    };
    setHistory((prev) => [record, ...prev]);
    return record;
  }, []);

  const processFrame = useCallback(
    async (frameData: string) => {
      setIsProcessing(true);
      latestFrameRef.current = frameData;
      try {
        const response = await fetch(`${API_BASE_URL}/detect`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ frame: frameData }),
        });
        if (response.ok) {
          const result = await response.json();
          setVehicles(result.vehicles || []);
        }
      } catch {
        setVehicles(
          MOCK_VEHICLES.map((v) => ({
            ...v,
            speed: v.speed + Math.floor(Math.random() * 10 - 5),
            bbox: {
              ...v.bbox,
              x: v.bbox.x + Math.random() * 3 - 1.5,
              y: v.bbox.y + Math.random() * 2 - 1,
            },
          }))
        );
      } finally {
        setIsProcessing(false);
        frameCountRef.current++;
        const now = Date.now();
        if (now - lastFpsTimeRef.current >= 1000) {
          setFps(frameCountRef.current);
          frameCountRef.current = 0;
          lastFpsTimeRef.current = now;
        }
      }
    },
    []
  );

  // Check vehicles for overspeeding & log to history
  const checkVehicles = useCallback(
    (currentVehicles: DetectedVehicle[]) => {
      const snapshot = latestFrameRef.current;
      if (!snapshot) return;

      for (const v of currentVehicles) {
        if (!loggedIdsRef.current.has(v.id)) {
          loggedIdsRef.current.add(v.id);
          const record = addToHistory(v, snapshot);
          if (v.speed > SPEED_LIMIT && !overspeedAlert) {
            setOverspeedAlert(record);
          }
        }
      }
    },
    [addToHistory, overspeedAlert]
  );

  const startDetection = useCallback(
    (captureFrame: () => string | null) => {
      setIsDetecting(true);
      frameCountRef.current = 0;
      lastFpsTimeRef.current = Date.now();
      loggedIdsRef.current.clear();

      intervalRef.current = setInterval(async () => {
        const frame = captureFrame();
        if (frame) {
          await processFrame(frame);
        }
      }, 200);
    },
    [processFrame]
  );

  const stopDetection = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsDetecting(false);
    setVehicles([]);
    setFps(0);
  }, []);

  const dismissAlert = useCallback(() => {
    setOverspeedAlert(null);
  }, []);

  return {
    vehicles,
    isProcessing,
    fps,
    isDetecting,
    history,
    overspeedAlert,
    startDetection,
    stopDetection,
    checkVehicles,
    dismissAlert,
  };
};
