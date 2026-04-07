export interface Device {
  id: number;
  name: string;
  type: 'lighting' | 'heating' | 'music' | 'security' | 'appliance' | 'bluetooth';
  room: string;
  on: boolean;
  value: number;
  icon: string;
  color: string;
}

export interface Schedule {
  id: number;
  name: string;
  device: string;
  action: string;
  start: string;
  repeat: string;
  value: string;
  active: boolean;
}

export interface Automation {
  id: number;
  name: string;
  trigger: string;
  action: string;
  icon: string;
  iconBg: string;
  active: boolean;
}

export interface Notification {
  id: string;
  title: string;
  sub: string;
  icon: string;
  color: string;
  time: string;
  type: 'info' | 'alert' | 'success';
}

export interface Room {
  name: string;
  icon: string;
  devCount: number;
  temp: number;
  light: string;
}

export interface Track {
  title: string;
  artist: string;
  dur: number;
  emoji: string;
  cover: string;
}

export interface Unit {
  id: string;
  companyName: string;
  unitCode: string;
  ownerUid: string;
  status: string;
  type: string;
}

export interface Router {
  id: string;
  unitId: string;
  routerId: string;
  status: string;
  lastPing: string;
}

export interface BluetoothActivity {
  id: string;
  unitId: string;
  activityCode: string;
  deviceName: string;
  timestamp: string;
}

export interface LinkedService {
  id: string;
  name: string;
  ownerUid: string;
  status: string;
  linkedAt: string;
  type: string;
  [key: string]: any;
}

export interface HealthData {
  heartRate: number;
  steps: number;
  sleep: string;
  calories: number;
  bloodPressure: string;
  oxygenLevel: number;
  lastSync: string;
}
