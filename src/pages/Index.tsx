import { useState } from "react";
import HomeScreen from "@/components/HomeScreen";
import CameraScreen from "@/components/CameraScreen";

const Index = () => {
  const [screen, setScreen] = useState<"home" | "camera">("home");

  return screen === "home" ? (
    <HomeScreen onStart={() => setScreen("camera")} />
  ) : (
    <CameraScreen onBack={() => setScreen("home")} />
  );
};

export default Index;
