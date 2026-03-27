import { Button } from "@/components/ui/button";
import { ArrowLeft, Car, Gauge, Clock, ShieldAlert, ChevronRight } from "lucide-react";
import type { VehicleRecord } from "@/types/detection";
import { SPEED_LIMIT } from "@/types/detection";

interface HistoryScreenProps {
  records: VehicleRecord[];
  onBack: () => void;
  onSelectRecord: (record: VehicleRecord) => void;
}

const HistoryScreen = ({ records, onBack, onSelectRecord }: HistoryScreenProps) => {
  const overspeedCount = records.filter((r) => r.isOverspeeding).length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-2 bg-card/90 backdrop-blur-md border-b border-border">
        <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-sm font-mono font-semibold text-foreground tracking-wide">
          Detection <span className="text-primary">History</span>
        </h2>
      </div>

      {/* Stats summary */}
      <div className="flex gap-3 mx-4 mt-4">
        <div className="flex-1 bg-card border border-border rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Car className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-lg font-bold font-mono text-foreground">{records.length}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Total</p>
          </div>
        </div>
        <div className="flex-1 bg-card border border-border rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-destructive/10 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4 text-destructive" />
          </div>
          <div>
            <p className="text-lg font-bold font-mono text-destructive">{overspeedCount}</p>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Violations</p>
          </div>
        </div>
      </div>

      {/* Records list */}
      <div className="flex-1 overflow-y-auto px-4 mt-4 pb-6">
        {records.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Car className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-sm text-muted-foreground">No vehicles detected yet</p>
            <p className="text-xs text-muted-foreground mt-1">Start detection to begin scanning</p>
          </div>
        ) : (
          <div className="space-y-2">
            {records.map((record) => (
              <button
                key={record.id}
                onClick={() => onSelectRecord(record)}
                className="w-full bg-card border border-border rounded-xl p-3 flex items-center gap-3 hover:border-primary/40 transition-colors text-left"
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-border">
                  <img src={record.snapshot} alt="" className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{record.vehicle.label}</span>
                    {record.isOverspeeding && (
                      <span className="text-[9px] font-mono bg-destructive/20 text-destructive px-1.5 py-0.5 rounded-full font-semibold uppercase">
                        Violation
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Gauge className="w-3 h-3" />
                      <span className={record.isOverspeeding ? "text-destructive font-semibold" : ""}>
                        {record.vehicle.speed} km/h
                      </span>
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(record.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryScreen;
