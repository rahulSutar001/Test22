import { Button } from "@/components/ui/button";
import { Camera, Zap, Shield, Gauge } from "lucide-react";

interface HomeScreenProps {
  onStart: () => void;
}

const HomeScreen = ({ onStart }: HomeScreenProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 grid-pattern">
      {/* Decorative top bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />

      {/* Logo area */}
      <div className="mb-8 flex flex-col items-center">
        <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 neon-glow">
          <Gauge className="w-10 h-10 text-primary" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground text-center font-mono tracking-tight">
          Speed<span className="text-primary text-glow">Detect</span>
        </h1>
        <p className="text-muted-foreground mt-3 text-center text-sm sm:text-base max-w-xs">
          AI-Powered Vehicle Speed Detection System
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10 w-full max-w-md sm:max-w-xl">
        <FeatureCard icon={<Camera className="w-5 h-5 text-primary" />} title="Live Detection" description="Real-time camera feed" />
        <FeatureCard icon={<Zap className="w-5 h-5 text-accent" />} title="Speed Tracking" description="Instant speed readout" />
        <FeatureCard icon={<Shield className="w-5 h-5 text-primary" />} title="AI Powered" description="Deep learning models" />
      </div>

      {/* Start button */}
      <Button variant="neon" size="lg" className="px-10 py-6 text-base rounded-xl" onClick={onStart}>
        <Camera className="w-5 h-5 mr-2" />
        Start Detection
      </Button>

      <p className="text-muted-foreground text-xs mt-6 text-center">
        Camera access required • Works best in well-lit areas
      </p>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-card border border-border rounded-xl p-4 flex flex-col items-center text-center gap-2">
    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">{icon}</div>
    <p className="text-sm font-semibold text-foreground">{title}</p>
    <p className="text-xs text-muted-foreground">{description}</p>
  </div>
);

export default HomeScreen;
