import {
  Armchair,
  BadgeCheck,
  Calculator,
  Camera,
  CircuitBoard,
  CloudRain,
  Cog,
  FileCheck,
  Gem,
  Handshake,
  Joystick,
  Lightbulb,
  Megaphone,
  MonitorSmartphone,
  PanelTop,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Timer,
  Wifi,
  Wind,
  Wrench,
} from 'lucide-react';

const ICONS = {
  Armchair,
  BadgeCheck,
  Calculator,
  Camera,
  CircuitBoard,
  CloudRain,
  Cog,
  FileCheck,
  Gem,
  Handshake,
  Joystick,
  Lightbulb,
  Megaphone,
  MonitorSmartphone,
  PanelTop,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Timer,
  Wifi,
  Wind,
  Wrench,
};

/** Résout une icône Lucide à partir du nom stocké dans les fichiers de données. */
export default function Icon({ name, ...rest }) {
  const Component = ICONS[name] ?? Sparkles;
  return <Component {...rest} />;
}
