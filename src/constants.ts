import { Device, Schedule, Automation, Track } from './types';

export const INITIAL_DEVICES: Device[] = [
  { id: 1, name: 'Main Ceiling', type: 'lighting', room: 'Living Room', on: true, value: 80, icon: 'Lamp', color: '#EAB308' },
  { id: 2, name: 'Smart Lock', type: 'security', room: 'Front Door', on: true, value: 0, icon: 'Lock', color: '#10B981' },
  { id: 3, name: 'AC Unit', type: 'heating', room: 'Bedroom', on: false, value: 72, icon: 'Wind', color: '#F97316' },
  { id: 4, name: 'Sonos One', type: 'music', room: 'Kitchen', on: true, value: 45, icon: 'Speaker', color: '#8B5CF6' },
  { id: 5, name: 'Desk Lamp', type: 'lighting', room: 'Office', on: false, value: 50, icon: 'Lamp', color: '#EAB308' },
  { id: 6, name: 'Backdoor Lock', type: 'security', room: 'Backyard', on: true, value: 0, icon: 'Lock', color: '#10B981' },
  { id: 7, name: 'Floor Heater', type: 'heating', room: 'Bathroom', on: false, value: 75, icon: 'Thermometer', color: '#F97316' },
  { id: 8, name: 'HomePod', type: 'music', room: 'Living Room', on: false, value: 30, icon: 'Speaker', color: '#8B5CF6' }
];

export const INITIAL_SCHEDULES: Schedule[] = [
  { id: 1, name: 'Morning Coffee', device: 'Kitchen Plug', action: 'Turn On', start: '07:00 AM', repeat: 'Daily', value: 'ON', active: true },
  { id: 2, name: 'Night Security', device: 'All Locks', action: 'Lock', start: '11:00 PM', repeat: 'Daily', value: 'LOCKED', active: true },
  { id: 3, name: 'Work Focus', device: 'Office Lights', action: 'Dim', start: '09:00 AM', repeat: 'Weekdays', value: '40%', active: false }
];

export const INITIAL_AUTOMATIONS: Automation[] = [
  { id: 1, name: 'Arrive Home', trigger: 'GPS Proximity', action: 'Unlock Door + AC On', icon: 'Home', iconBg: 'rgba(59,130,246,.15)', active: true },
  { id: 2, name: 'Sleep Mode', trigger: '11:00 PM', action: 'Lock all doors + Turn off lights', icon: 'Moon', iconBg: 'rgba(139,92,246,.15)', active: true },
  { id: 3, name: 'Energy Saver', trigger: 'Power > 5kW', action: 'Dim non-essential lighting', icon: 'Zap', iconBg: 'rgba(16,185,129,.15)', active: false }
];

export const TRACKS: Track[] = [
  { title: 'Midnight City', artist: 'M83', dur: 243, emoji: '🌌', cover: 'https://picsum.photos/seed/midnight/400/400' },
  { title: 'Starboy', artist: 'The Weeknd', dur: 230, emoji: '✨', cover: 'https://picsum.photos/seed/starboy/400/400' },
  { title: 'Levitating', artist: 'Dua Lipa', dur: 203, emoji: '💃', cover: 'https://picsum.photos/seed/levitating/400/400' },
  { title: 'Blinding Lights', artist: 'The Weeknd', dur: 200, emoji: '🕶️', cover: 'https://picsum.photos/seed/blinding/400/400' }
];

export const ROOMS = [
  { name: 'Living Room', icon: 'Sofa', devCount: 5, temp: 72, light: '80%' },
  { name: 'Bedroom', icon: 'Bed', devCount: 3, temp: 68, light: '0%' },
  { name: 'Kitchen', icon: 'Utensils', devCount: 4, temp: 70, light: '100%' },
  { name: 'Office', icon: 'Monitor', devCount: 6, temp: 71, light: '50%' }
];
