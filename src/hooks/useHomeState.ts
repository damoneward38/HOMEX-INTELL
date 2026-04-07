import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  addDoc, 
  query, 
  where,
  getDocFromServer,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { onAuthStateChanged, User as FirebaseUser, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import { Device, Schedule, Automation, Notification, Unit, Router, BluetoothActivity, LinkedService, HealthData } from '../types';
import { INITIAL_DEVICES, INITIAL_SCHEDULES, INITIAL_AUTOMATIONS } from '../constants';
import { HomeEngine } from '../engine';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
}

export function useHomeState() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [devices, setDevices] = useState<Device[]>(INITIAL_DEVICES);
  const [schedules, setSchedules] = useState<Schedule[]>(INITIAL_SCHEDULES);
  const [automations, setAutomations] = useState<Automation[]>(INITIAL_AUTOMATIONS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [heatTempState, setHeatTempState] = useState(72);
  const [volumeState, setVolumeState] = useState(45);
  const [musicPlaying, setMusicPlayingState] = useState(false);

  const setHeatTemp = useCallback((temp: number) => {
    setHeatTempState(temp);
    fetch('/api/thermostat/temperature', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': user?.uid || ''
      },
      body: JSON.stringify({ homeId: 'default', temperature: temp })
    }).catch(err => console.error('Failed to set temperature:', err));
  }, [user]);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
    fetch('/api/media/volume', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': user?.uid || ''
      },
      body: JSON.stringify({ deviceId: 'default', volume: vol })
    }).catch(err => console.error('Failed to set volume:', err));
  }, [user]);

  const setMusicPlaying = useCallback((playing: boolean) => {
    setMusicPlayingState(playing);
    fetch(`/api/media/${playing ? 'play' : 'pause'}`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'x-user-id': user?.uid || ''
      },
      body: JSON.stringify({ deviceId: 'default' })
    }).catch(err => console.error('Failed to toggle music:', err));
  }, [user]);
  const [trackIndex, setTrackIndex] = useState(0);
  const [musicProgress, setMusicProgress] = useState(0);

  // Data Fetching
  const [units, setUnits] = useState<any[]>([]);
  const [routers, setRouters] = useState<any[]>([]);
  const [bluetoothActivity, setBluetoothActivity] = useState<BluetoothActivity[]>([]);
  const [linkedServices, setLinkedServices] = useState<LinkedService[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [discoveredUnits, setDiscoveredUnits] = useState<Partial<Unit>[]>([]);
  const [discoveredRouters, setDiscoveredRouters] = useState<Partial<Router>[]>([]);
  const [discoveredBT, setDiscoveredBT] = useState<Partial<BluetoothActivity>[]>([]);
  const [reminders, setReminders] = useState<{ id: string; text: string; time: string; priority: 'low' | 'high' }[]>([]);
  const [shoppingList, setShoppingList] = useState<{ id: string; name: string; checked: boolean }[]>([]);
  const [apiKeys, setApiKeys] = useState<any>(null);
  const [appName, setAppName] = useState('HomeX Intelligence Hub');
  const [enabledFeatures, setEnabledFeatures] = useState<string[]>(['security', 'energy', 'health', 'voice']);
  const [energyData, setEnergyData] = useState<any[]>([
    { time: '00:00', usage: 4.2 },
    { time: '04:00', usage: 3.8 },
    { time: '08:00', usage: 6.5 },
    { time: '12:00', usage: 5.1 },
    { time: '16:00', usage: 7.2 },
    { time: '20:00', usage: 5.9 },
    { time: '23:59', usage: 4.5 }
  ]);
  const [energySaved, setEnergySaved] = useState(12.40);
  const [climateData, setClimateData] = useState({
    humidity: 42,
    airQuality: 12,
    airQualityStatus: 'Good'
  });
  const [securityStatus, setSecurityStatus] = useState({
    armed: true,
    mode: 'Home',
    lastEvent: 'Front Door Closed',
    lastEventTime: '10:15 AM'
  });
  const [healthData, setHealthData] = useState<HealthData>({
    heartRate: 72,
    steps: 8420,
    sleep: '7h 20m',
    calories: 1840,
    bloodPressure: '120/80',
    oxygenLevel: 98,
    lastSync: new Date().toISOString()
  });

  // Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const logout = () => signOut(auth);

  // Data Fetching Logic
  useEffect(() => {
    if (!user) {
      setUnits([]);
      setRouters([]);
      setBluetoothActivity([]);
      setLinkedServices([]);
      setReminders([]);
      setShoppingList([]);
      setApiKeys(null);
      return;
    }

    // Fetch API Keys
    const unsubKeys = onSnapshot(doc(db, 'settings', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setApiKeys(data);
        if (data.appName) setAppName(data.appName);
        if (data.enabledFeatures) setEnabledFeatures(data.enabledFeatures);
      } else {
        // Initialize default settings for new user
        setDoc(doc(db, 'settings', user.uid), {
          appName: 'HomeX Intelligence Hub',
          enabledFeatures: ['security', 'energy', 'health', 'voice', 'lighting', 'music', 'climate'],
          createdAt: serverTimestamp()
        });
      }
    });

    // Fetch Units
    const qUnits = query(collection(db, 'units'), where('ownerUid', '==', user.uid));
    const unsubUnits = onSnapshot(qUnits, (snapshot) => {
      setUnits(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'units'));

    return () => {
      unsubKeys();
      unsubUnits();
    };
  }, [user]);

  // Fetch subcollections when units change
  useEffect(() => {
    if (units.length === 0) return;

    const unsubs: (() => void)[] = [];

    units.forEach(unit => {
      // Routers
      const unsubRouters = onSnapshot(collection(db, 'units', unit.id, 'routers'), (snapshot) => {
        setRouters(prev => {
          const filtered = prev.filter(r => r.unitId !== unit.id);
          return [...filtered, ...snapshot.docs.map(doc => ({ id: doc.id, unitId: unit.id, ...doc.data() }))];
        });
      }, (err) => handleFirestoreError(err, OperationType.LIST, `units/${unit.id}/routers`));
      unsubs.push(unsubRouters);

      // Bluetooth
      const unsubBT = onSnapshot(collection(db, 'units', unit.id, 'bluetooth'), (snapshot) => {
        setBluetoothActivity(prev => {
          const filtered = prev.filter(b => b.unitId !== unit.id);
          return [...filtered, ...snapshot.docs.map(doc => ({ id: doc.id, unitId: unit.id, ...doc.data() } as BluetoothActivity))];
        });
      }, (err) => handleFirestoreError(err, OperationType.LIST, `units/${unit.id}/bluetooth`));
      unsubs.push(unsubBT);
    });

    // Fetch Linked Services
    const qServices = query(collection(db, 'services'), where('ownerUid', '==', user.uid));
    const unsubServices = onSnapshot(qServices, (snapshot) => {
      setLinkedServices(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as LinkedService)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'services'));
    unsubs.push(unsubServices);

    // Reminders
    const qReminders = query(collection(db, 'reminders'), where('ownerUid', '==', user.uid));
    const unsubReminders = onSnapshot(qReminders, (snapshot) => {
      setReminders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[]);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'reminders'));
    unsubs.push(unsubReminders);

    // Shopping List
    const qShopping = query(collection(db, 'shoppingList'), where('ownerUid', '==', user.uid));
    const unsubShopping = onSnapshot(qShopping, (snapshot) => {
      setShoppingList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as any[]);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'shoppingList'));
    unsubs.push(unsubShopping);

    return () => unsubs.forEach(unsub => unsub());
  }, [units, user]);

  const addNotification = useCallback((title: string, sub: string, type: 'info' | 'alert' | 'success' = 'info') => {
    const icon = type === 'alert' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
    const color = type === 'alert' ? '#EF4444' : type === 'success' ? '#10B981' : '#3B82F6';
    
    const newNotif: Notification = {
      id: Date.now().toString(),
      title,
      sub,
      icon,
      color,
      type,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setNotifications(prev => [newNotif, ...prev].slice(0, 10));
  }, []);

  const linkUnit = async (companyName: string, unitCode: string) => {
    if (!user) return;
    try {
      const unitId = `${companyName.toLowerCase()}-${unitCode}`;
      await setDoc(doc(db, 'units', unitId), {
        companyName,
        unitCode,
        ownerUid: user.uid,
        status: 'active',
        type: 'hub'
      });
      addNotification('Unit Linked', `Successfully linked ${companyName} unit.`, 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'units');
    }
  };

  const addRouter = async (unitId: string, routerId: string) => {
    try {
      await setDoc(doc(db, 'units', unitId, 'routers', routerId), {
        routerId,
        status: 'online',
        lastPing: new Date().toISOString()
      });
      addNotification('Router Added', `Heating router ${routerId} linked.`, 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `units/${unitId}/routers`);
    }
  };

  const logBluetoothActivity = async (unitId: string, activityCode: string, deviceName: string) => {
    try {
      await addDoc(collection(db, 'units', unitId, 'bluetooth'), {
        activityCode,
        deviceName,
        timestamp: new Date().toISOString()
      });
      addNotification('Bluetooth Linked', `Device ${deviceName} paired.`, 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `units/${unitId}/bluetooth`);
    }
  };

  const scanForUnits = async () => {
    setIsScanning(true);
    try {
      const units = await HomeEngine.getInstance().scanForUnits();
      setDiscoveredUnits(units);
      addNotification('Scan Complete', `Found ${units.length} potential units.`, 'info');
    } finally {
      setIsScanning(false);
    }
  };

  const scanForRouters = async (unitId: string) => {
    setIsScanning(true);
    try {
      const routers = await HomeEngine.getInstance().scanForRouters(unitId);
      setDiscoveredRouters(routers);
      addNotification('Scan Complete', `Found ${routers.length} routers for unit.`, 'info');
    } finally {
      setIsScanning(false);
    }
  };

  const discoverBluetooth = async () => {
    setIsScanning(true);
    try {
      const response = await fetch('/api/bluetooth/scan', {
        headers: { 'x-user-id': user?.uid || '' }
      });
      const devices = await response.json();
      if (devices.error) throw new Error(devices.error);
      setDiscoveredBT(devices);
      addNotification('Discovery Complete', `Found ${devices.length} nearby devices.`, 'info');
    } catch (error: any) {
      console.error('Bluetooth scan failed:', error);
      // Fallback to simulation if backend fails
      const simulated = await HomeEngine.getInstance().discoverBluetoothDevices();
      setDiscoveredBT(simulated);
      addNotification('Discovery (Simulated)', `Found ${simulated.length} devices.`, 'info');
    } finally {
      setIsScanning(false);
    }
  };

  const pairBluetooth = async (unitId: string, deviceName: string, activityCode: string) => {
    try {
      await addDoc(collection(db, 'units', unitId, 'bluetooth'), {
        deviceName,
        activityCode,
        timestamp: new Date().toISOString()
      });
      addNotification('Bluetooth Paired', `${deviceName} linked to unit.`, 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `units/${unitId}/bluetooth`);
    }
  };

  const linkService = async (serviceName: string, config: any) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'services', serviceName.toLowerCase()), {
        name: serviceName,
        ownerUid: user.uid,
        status: 'linked',
        linkedAt: new Date().toISOString(),
        ...config
      });
      addNotification('Service Linked', `${serviceName} integration active.`, 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'services');
    }
  };

  const addReminder = async (text: string, time: string, priority: 'low' | 'high' = 'low') => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'reminders'), {
        text,
        time,
        priority,
        ownerUid: user.uid,
        createdAt: new Date().toISOString()
      });
      addNotification('Reminder Added', text, 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'reminders');
    }
  };

  const addShoppingItem = async (name: string) => {
    if (!user) return;
    try {
      await addDoc(collection(db, 'shoppingList'), {
        name,
        checked: false,
        ownerUid: user.uid,
        createdAt: new Date().toISOString()
      });
      addNotification('Item Added', name, 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'shoppingList');
    }
  };

  const toggleShoppingItem = async (id: string, checked: boolean) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'shoppingList', id), { checked });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `shoppingList/${id}`);
    }
  };

  const toggleDevice = useCallback(async (id: number) => {
    setDevices(prev => prev.map(d => {
      if (d.id === id) {
        const newState = !d.on;
        
        // Backend integration for lighting
        if (d.type === 'lighting') {
          fetch('/api/lights/toggle', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-user-id': user?.uid || ''
            },
            body: JSON.stringify({ lightId: d.id.toString(), state: newState })
          }).catch(err => console.error('Failed to toggle light:', err));
        }

        addNotification(d.name, `${d.name} turned ${newState ? 'ON' : 'OFF'}`, newState ? 'success' : 'info');
        return { ...d, on: newState };
      }
      return d;
    }));
  }, [addNotification]);

  const updateDeviceValue = useCallback(async (id: number, value: number) => {
    setDevices(prev => prev.map(d => {
      if (d.id === id) {
        // Backend integration for thermostat
        if (d.type === 'heating') {
          fetch('/api/thermostat/temperature', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-user-id': user?.uid || ''
            },
            body: JSON.stringify({ homeId: 'default', temperature: value })
          }).catch(err => console.error('Failed to set temperature:', err));
        }
        return { ...d, value };
      }
      return d;
    }));
  }, []);

  const saveApiKeys = async (keys: any) => {
    if (!user) return;
    try {
      await setDoc(doc(db, 'settings', user.uid), {
        ...keys,
        updatedAt: new Date().toISOString()
      });
      addNotification('Settings Saved', 'API keys updated successfully.', 'success');
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'settings');
    }
  };

  const toggleSchedule = useCallback((id: number) => {
    setSchedules(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
  }, []);

  const deleteSchedule = useCallback((id: number) => {
    setSchedules(prev => prev.filter(s => s.id !== id));
  }, []);

  const toggleAutomation = useCallback((id: number) => {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
  }, []);

  const toggleSecurity = useCallback(() => {
    setSecurityStatus(prev => ({
      ...prev,
      armed: !prev.armed,
      lastEvent: !prev.armed ? 'System Disarmed' : 'System Armed',
      lastEventTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
    addNotification('Security', `System ${!securityStatus.armed ? 'ARMED' : 'DISARMED'}`, !securityStatus.armed ? 'success' : 'alert');
  }, [securityStatus.armed, addNotification]);

  return {
    user,
    isAuthReady,
    login,
    logout,
    units,
    routers,
    bluetoothActivity,
    linkedServices,
    isScanning,
    discoveredUnits,
    discoveredRouters,
    discoveredBT,
    reminders,
    shoppingList,
    apiKeys,
    energyData,
    energySaved,
    climateData,
    securityStatus,
    healthData,
    appName,
    enabledFeatures,
    saveApiKeys,
    linkUnit,
    addRouter,
    logBluetoothActivity,
    scanForUnits,
    scanForRouters,
    discoverBluetooth,
    pairBluetooth,
    linkService,
    addReminder,
    addShoppingItem,
    toggleShoppingItem,
    devices,
    schedules,
    automations,
    notifications,
    heatTemp: heatTempState,
    volume: volumeState,
    musicPlaying,
    trackIndex,
    musicProgress,
    setHeatTemp,
    setVolume,
    setMusicPlaying,
    setTrackIndex,
    setMusicProgress,
    toggleDevice,
    updateDeviceValue,
    toggleSchedule,
    deleteSchedule,
    toggleAutomation,
    toggleSecurity,
    addNotification,
    setNotifications
  };
}
