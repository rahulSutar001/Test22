import { useState, useCallback } from "react";
import HomeScreen from "@/components/HomeScreen";
import CameraScreen from "@/components/CameraScreen";
import VehicleDashboard from "@/components/VehicleDashboard";
import HistoryScreen from "@/components/HistoryScreen";
import { useDetection } from "@/hooks/useDetection";
import type { VehicleRecord } from "@/types/detection";

type Screen = "home" | "camera" | "dashboard" | "history";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedRecord, setSelectedRecord] = useState<VehicleRecord | null>(null);
  const detectionHook = useDetection();

  const handleOverspeed = useCallback((record: VehicleRecord) => {
    setSelectedRecord(record);
    setScreen("dashboard");
  }, []);

  const handleSelectRecord = useCallback((record: VehicleRecord) => {
    setSelectedRecord(record);
    setScreen("dashboard");
  }, []);

  switch (screen) {
    case "home":
      return (
        <HomeScreen
          onStart={() => setScreen("camera")}
          onHistory={() => setScreen("history")}
          historyCount={detectionHook.history.length}
        />
      );
    case "camera":
      return (
        <CameraScreen
          onBack={() => setScreen("home")}
          onOverspeed={handleOverspeed}
          onHistory={() => setScreen("history")}
          history={detectionHook.history}
          detectionHook={detectionHook}
        />
      );
    case "dashboard":
      return selectedRecord ? (
        <VehicleDashboard
          record={selectedRecord}
          onBack={() => setScreen("camera")}
        />
      ) : null;
    case "history":
      return (
        <HistoryScreen
          records={detectionHook.history}
          onBack={() => setScreen("home")}
          onSelectRecord={handleSelectRecord}
        />
      );
    default:
      return null;
  }
};

export default Index;
