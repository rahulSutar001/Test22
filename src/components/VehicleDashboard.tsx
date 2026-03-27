import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, Gauge, Car, Clock, MapPin, ShieldAlert } from "lucide-react";
import type { VehicleRecord } from "@/types/detection";
import { SPEED_LIMIT } from "@/types/detection";

interface VehicleDashboardProps {
  record: VehicleRecord;
  onBack: () => void;
}

const VehicleDashboard = ({ record, onBack }: VehicleDashboardProps) => {
  const { vehicle, snapshot, timestamp, isOverspeeding } = record;
  const date = new Date(timestamp);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-2 bg-card/90 backdrop-blur-md border-b border-border">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-sm font-mono font-semibold text-foreground tracking-wide">
          Vehicle <span className="text-primary">Details</span>
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Alert banner */}
        {isOverspeeding && (
          <div className="mx-4 mt-4 flex items-center gap-3 bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3">
            <ShieldAlert className="w-5 h-5 text-destructive flex-shrink-0" />
            <div>
              <p className="text-destructive font-semibold text-sm">Overspeeding Violation</p>
              <p className="text-muted-foreground text-xs">
                Speed limit: {SPEED_LIMIT} km/h — Detected: {vehicle.speed} km/h
              </p>
            </div>
          </div>
        )}

        {/* Vehicle snapshot */}
        <div className="mx-4 mt-4 rounded-xl overflow-hidden border border-border bg-card relative">
          <img
            src={snapshot}
            alt="Vehicle snapshot"
            className="w-full aspect-video object-cover"
          />
          {/* Speed badge overlay */}
          <div className="absolute top-3 right-3">
            <div
              className={`px-3 py-1.5 rounded-lg font-mono text-sm font-bold flex items-center gap-1.5 ${
                isOverspeeding
                  ? "bg-destructive text-destructive-foreground danger-glow"
                  : "bg-primary text-primary-foreground neon-glow"
              }`}
            >
              <Gauge className="w-4 h-4" />
              {vehicle.speed} km/h
            </div>
          </div>
          {/* Vehicle label */}
          <div className="absolute bottom-3 left-3">
            <span className="bg-card/80 backdrop-blur-sm text-foreground text-xs font-mono px-2 py-1 rounded-md border border-border">
              {vehicle.label} • {(vehicle.confidence * 100).toFixed(0)}% confidence
            </span>
          </div>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-2 gap-3 mx-4 mt-4">
          <DetailCard
            icon={<Car className="w-4 h-4 text-primary" />}
            label="Vehicle Type"
            value={vehicle.label}
          />
          <DetailCard
            icon={<Gauge className="w-4 h-4 text-accent" />}
            label="Detected Speed"
            value={`${vehicle.speed} km/h`}
            highlight={isOverspeeding}
          />
          <DetailCard
            icon={<AlertTriangle className="w-4 h-4 text-destructive" />}
            label="Speed Limit"
            value={`${SPEED_LIMIT} km/h`}
          />
          <DetailCard
            icon={<Clock className="w-4 h-4 text-muted-foreground" />}
            label="Detected At"
            value={date.toLocaleTimeString()}
          />
        </div>

        {/* Extra info */}
        <div className="mx-4 mt-4 mb-6 bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Detection Info</span>
          </div>
          <div className="space-y-2 text-sm">
            <InfoRow label="Date" value={date.toLocaleDateString()} />
            <InfoRow label="Vehicle ID" value={vehicle.id} />
            <InfoRow label="Bounding Box" value={`(${vehicle.bbox.x.toFixed(0)}, ${vehicle.bbox.y.toFixed(0)}) ${vehicle.bbox.width.toFixed(0)}×${vehicle.bbox.height.toFixed(0)}`} />
            <InfoRow
              label="Status"
              value={isOverspeeding ? "⚠ VIOLATION" : "✓ Normal"}
              highlight={isOverspeeding}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailCard = ({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="bg-card border border-border rounded-xl p-3 flex flex-col gap-1.5">
    <div className="flex items-center gap-1.5">
      {icon}
      <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">{label}</span>
    </div>
    <span className={`text-lg font-bold font-mono ${highlight ? "text-destructive" : "text-foreground"}`}>
      {value}
    </span>
  </div>
);

const InfoRow = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="flex justify-between items-center">
    <span className="text-muted-foreground text-xs">{label}</span>
    <span className={`font-mono text-xs ${highlight ? "text-destructive font-semibold" : "text-foreground"}`}>
      {value}
    </span>
  </div>
);

export default VehicleDashboard;
