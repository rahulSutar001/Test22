import type { DetectedVehicle } from "@/types/detection";

interface DetectionOverlayProps {
  vehicles: DetectedVehicle[];
  entryLineY: number; // percentage from top
  exitLineY: number;
}

const DetectionOverlay = ({ vehicles, entryLineY, exitLineY }: DetectionOverlayProps) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Entry Line */}
      <div
        className="absolute left-0 right-0 h-[2px] bg-accent opacity-70"
        style={{ top: `${entryLineY}%` }}
      >
        <span className="absolute -top-5 left-2 text-[10px] sm:text-xs font-mono text-accent font-semibold tracking-wider uppercase">
          ▸ Entry Line
        </span>
      </div>

      {/* Exit Line */}
      <div
        className="absolute left-0 right-0 h-[2px] bg-destructive opacity-70"
        style={{ top: `${exitLineY}%` }}
      >
        <span className="absolute -top-5 left-2 text-[10px] sm:text-xs font-mono text-destructive font-semibold tracking-wider uppercase">
          ▸ Exit Line
        </span>
      </div>

      {/* Vehicle bounding boxes */}
      {vehicles.map((vehicle) => (
        <div
          key={vehicle.id}
          className="absolute border-2 border-primary rounded-sm transition-all duration-200"
          style={{
            left: `${vehicle.bbox.x}%`,
            top: `${vehicle.bbox.y}%`,
            width: `${vehicle.bbox.width}%`,
            height: `${vehicle.bbox.height}%`,
          }}
        >
          {/* Corner indicators */}
          <div className="absolute -top-[1px] -left-[1px] w-3 h-3 border-t-2 border-l-2 border-primary" />
          <div className="absolute -top-[1px] -right-[1px] w-3 h-3 border-t-2 border-r-2 border-primary" />
          <div className="absolute -bottom-[1px] -left-[1px] w-3 h-3 border-b-2 border-l-2 border-primary" />
          <div className="absolute -bottom-[1px] -right-[1px] w-3 h-3 border-b-2 border-r-2 border-primary" />

          {/* Speed label */}
          <div className="absolute -top-7 left-0 flex gap-1 items-center">
            <span className="bg-primary text-primary-foreground text-[10px] sm:text-xs font-mono font-bold px-2 py-0.5 rounded-sm">
              {vehicle.speed} km/h
            </span>
            <span className="bg-card/80 text-foreground text-[10px] font-mono px-1.5 py-0.5 rounded-sm border border-border">
              {vehicle.label}
            </span>
          </div>

          {/* Confidence */}
          <span className="absolute -bottom-5 left-0 text-[9px] font-mono text-muted-foreground">
            {(vehicle.confidence * 100).toFixed(0)}%
          </span>
        </div>
      ))}

      {/* Scanline effect */}
      <div className="absolute inset-0 scanline opacity-30" />
    </div>
  );
};

export default DetectionOverlay;
