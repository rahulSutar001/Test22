import { useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, StopCircle, Play, History } from "lucide-react";
import { useCamera } from "@/hooks/useCamera";
import { useDetection } from "@/hooks/useDetection";
import DetectionOverlay from "./DetectionOverlay";
import StatsBar from "./StatsBar";
import type { VehicleRecord } from "@/types/detection";

interface CameraScreenProps {
  onBack: () => void;
  onOverspeed: (record: VehicleRecord) => void;
  onHistory: () => void;
  history: VehicleRecord[];
  detectionHook: ReturnType<typeof useDetection>;
}

const CameraScreen = ({ onBack, onOverspeed, onHistory, detectionHook }: CameraScreenProps) => {
  const { videoRef, canvasRef, startCamera, stopCamera, captureFrame, isActive, error } = useCamera();
  const {
    vehicles,
    isProcessing,
    fps,
    isDetecting,
    startDetection,
    stopDetection,
    checkVehicles,
    overspeedAlert,
    dismissAlert,
  } = detectionHook;

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      stopDetection();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Check for overspeeding whenever vehicles update
  useEffect(() => {
    if (vehicles.length > 0 && isDetecting) {
      checkVehicles(vehicles);
    }
  }, [vehicles, isDetecting, checkVehicles]);

  // Navigate to dashboard on overspeed alert
  useEffect(() => {
    if (overspeedAlert) {
      stopDetection();
      stopCamera();
      onOverspeed(overspeedAlert);
      dismissAlert();
    }
  }, [overspeedAlert, onOverspeed, dismissAlert, stopDetection, stopCamera]);

  const handleToggleDetection = useCallback(() => {
    if (isDetecting) {
      stopDetection();
    } else {
      startDetection(captureFrame);
    }
  }, [isDetecting, stopDetection, startDetection, captureFrame]);

  const handleBack = () => {
    stopDetection();
    stopCamera();
    onBack();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-card/90 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h2 className="text-sm font-mono font-semibold text-foreground tracking-wide">
            Speed<span className="text-primary">Detect</span>
          </h2>
        </div>
        <Button variant="ghost" size="icon" onClick={onHistory} className="h-8 w-8 relative">
          <History className="w-4 h-4" />
        </Button>
      </div>

      {/* Stats */}
      <StatsBar vehicleCount={vehicles.length} fps={fps} isProcessing={isProcessing} isDetecting={isDetecting} />

      {/* Camera viewport */}
      <div className="flex-1 relative bg-muted overflow-hidden">
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
            <div className="bg-card border border-destructive/30 rounded-xl p-6 text-center max-w-xs">
              <p className="text-destructive font-semibold text-sm mb-2">Camera Error</p>
              <p className="text-muted-foreground text-xs">{error}</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={startCamera}>
                Retry
              </Button>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              playsInline
              muted
            />
            {isDetecting && (
              <DetectionOverlay vehicles={vehicles} entryLineY={30} exitLineY={70} />
            )}
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 px-4 py-4 bg-card/90 backdrop-blur-md border-t border-border">
        {isActive && (
          <Button
            variant={isDetecting ? "danger" : "neon"}
            size="lg"
            className="px-8 py-5 rounded-xl text-sm"
            onClick={handleToggleDetection}
          >
            {isDetecting ? (
              <>
                <StopCircle className="w-5 h-5 mr-2" />
                Stop Detection
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Start Detection
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default CameraScreen;
