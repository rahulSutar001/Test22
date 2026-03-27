import { Activity, Car, Loader2 } from "lucide-react";

interface StatsBarProps {
  vehicleCount: number;
  fps: number;
  isProcessing: boolean;
  isDetecting: boolean;
}

const StatsBar = ({ vehicleCount, fps, isProcessing, isDetecting }: StatsBarProps) => {
  return (
    <div className="flex items-center justify-between px-3 py-2 bg-card/90 backdrop-blur-md border-b border-border">
      <div className="flex items-center gap-3">
        {/* Status indicator */}
        <div className="flex items-center gap-1.5">
          <div
            className={`w-2 h-2 rounded-full ${
              isDetecting ? "bg-primary animate-pulse-neon" : "bg-muted-foreground"
            }`}
          />
          <span className="text-xs font-mono text-muted-foreground">
            {isDetecting ? "LIVE" : "IDLE"}
          </span>
        </div>

        {/* Vehicle count */}
        <div className="flex items-center gap-1">
          <Car className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-mono text-foreground font-semibold">{vehicleCount}</span>
        </div>

        {/* FPS */}
        <div className="flex items-center gap-1">
          <Activity className="w-3.5 h-3.5 text-accent" />
          <span className="text-xs font-mono text-foreground">{fps} FPS</span>
        </div>
      </div>

      {isProcessing && (
        <Loader2 className="w-4 h-4 text-primary animate-spin" />
      )}
    </div>
  );
};

export default StatsBar;
