import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { RingApi } from 'ring-client-api';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Firebase Client for backend settings fetching
const firebaseConfig = JSON.parse(fs.readFileSync(path.join(__dirname, 'firebase-applet-config.json'), 'utf8'));
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Helper to get user-specific config
  const getUserConfig = async (userId: string) => {
    const defaultKeys = {
      nest_api_key: process.env.NEST_API_KEY || 'YOUR_NEST_API_KEY',
      hue_bridge_ip: process.env.HUE_BRIDGE_IP || 'YOUR_HUE_BRIDGE_IP',
      hue_api_key: process.env.HUE_API_KEY || 'YOUR_HUE_API_KEY',
      spotify_client_id: process.env.SPOTIFY_CLIENT_ID || 'YOUR_SPOTIFY_CLIENT_ID',
      spotify_secret: process.env.SPOTIFY_SECRET || 'YOUR_SPOTIFY_SECRET',
      ring_api_key: process.env.RING_API_KEY || 'YOUR_RING_API_KEY',
      smartthings_token: process.env.SMARTTHINGS_TOKEN || 'YOUR_SMARTTHINGS_TOKEN',
      gemini_api_key: process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY',
      samsung_tv_ip: process.env.SAMSUNG_TV_IP || 'YOUR_TV_IP',
      apple_homekit_id: process.env.APPLE_HOMEKIT_ID || 'YOUR_HOMEKIT_ID',
      google_home_id: process.env.GOOGLE_HOME_ID || 'YOUR_GOOGLE_HOME_ID',
      fitbit_api_key: process.env.FITBIT_API_KEY || 'YOUR_FITBIT_KEY',
      apple_health_id: process.env.APPLE_HEALTH_ID || 'YOUR_HEALTH_ID',
      google_fit_id: process.env.GOOGLE_FIT_ID || 'YOUR_FIT_ID'
    };

    if (!userId) return defaultKeys;

    try {
      const docSnap = await getDoc(doc(db, 'settings', userId));
      if (docSnap.exists()) {
        const userKeys = docSnap.data();
        return { ...defaultKeys, ...userKeys };
      }
    } catch (error) {
      console.error('Error fetching user config:', error);
    }
    return defaultKeys;
  };

  // THERMOSTAT / HVAC
  const thermostat = {
    setTemperature: async (userId: string, homeId: string, temperature: number, unit = 'F') => {
      const config = await getUserConfig(userId);
      try {
        const response = await fetch(
          `https://smartdevicemanagement.googleapis.com/v1/enterprises/${homeId}/devices`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${config.nest_api_key}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              command: 'sdm.devices.commands.ThermostatTemperatureSetpoint.SetHeat',
              params: {
                heatCelsius: unit === 'F' ? (temperature - 32) * 5/9 : temperature
              }
            })
          }
        );
        return await response.json();
      } catch (error: any) {
        return { error: error.message };
      }
    },
    getTemperature: async (userId: string, homeId: string) => {
      const config = await getUserConfig(userId);
      try {
        const response = await fetch(
          `https://smartdevicemanagement.googleapis.com/v1/enterprises/${homeId}/devices`,
          {
            headers: { 'Authorization': `Bearer ${config.nest_api_key}` }
          }
        );
        return await response.json();
      } catch (error: any) {
        return { error: error.message };
      }
    }
  };

  // LIGHTING (Philips Hue)
  const lighting = {
    toggleLight: async (userId: string, lightId: string, state: boolean) => {
      const config = await getUserConfig(userId);
      try {
        const response = await fetch(
          `http://${config.hue_bridge_ip}/api/${config.hue_api_key}/lights/${lightId}/state`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ on: state })
          }
        );
        return await response.json();
      } catch (error: any) {
        return { error: error.message };
      }
    }
  };

  // MUSIC / MEDIA (Spotify)
  const media = {
    play: async (userId: string, deviceId: string) => {
      const config = await getUserConfig(userId);
      try {
        const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${config.spotify_client_id}` }
        });
        return await response.json();
      } catch (error: any) {
        return { error: error.message };
      }
    },
    pause: async (userId: string, deviceId: string) => {
      const config = await getUserConfig(userId);
      try {
        const response = await fetch(`https://api.spotify.com/v1/me/player/pause?device_id=${deviceId}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${config.spotify_client_id}` }
        });
        return await response.json();
      } catch (error: any) {
        return { error: error.message };
      }
    },
    setVolume: async (userId: string, deviceId: string, volume: number) => {
      const config = await getUserConfig(userId);
      try {
        const response = await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}&device_id=${deviceId}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${config.spotify_client_id}` }
        });
        return await response.json();
      } catch (error: any) {
        return { error: error.message };
      }
    }
  };

  // API ROUTES
  app.post('/api/thermostat/temperature', async (req, res) => {
    const userId = req.headers['x-user-id'] as string;
    const { homeId, temperature, unit } = req.body;
    const result = await thermostat.setTemperature(userId, homeId, temperature, unit);
    res.json(result);
  });

  app.get('/api/thermostat/temperature/:homeId', async (req, res) => {
    const userId = req.headers['x-user-id'] as string;
    const result = await thermostat.getTemperature(userId, req.params.homeId);
    res.json(result);
  });

  app.post('/api/lights/toggle', async (req, res) => {
    const userId = req.headers['x-user-id'] as string;
    const { lightId, state } = req.body;
    const result = await lighting.toggleLight(userId, lightId, state);
    res.json(result);
  });

  app.post('/api/media/play', async (req, res) => {
    const userId = req.headers['x-user-id'] as string;
    const { deviceId } = req.body;
    const result = await media.play(userId, deviceId);
    res.json(result);
  });

  app.post('/api/media/pause', async (req, res) => {
    const userId = req.headers['x-user-id'] as string;
    const { deviceId } = req.body;
    const result = await media.pause(userId, deviceId);
    res.json(result);
  });

  app.post('/api/media/volume', async (req, res) => {
    const userId = req.headers['x-user-id'] as string;
    const { deviceId, volume } = req.body;
    const result = await media.setVolume(userId, deviceId, volume);
    res.json(result);
  });

  // SECURITY (Ring)
  app.get('/api/security/cameras', async (req, res) => {
    const userId = req.headers['x-user-id'] as string;
    const config = await getUserConfig(userId);
    try {
      if (!config.ring_api_key || config.ring_api_key === 'YOUR_RING_API_KEY') {
        return res.json({ error: 'Ring API key not configured' });
      }
      const ring = new RingApi({ refreshToken: config.ring_api_key });
      const cameras = await ring.getCameras();
      res.json(cameras.map(c => ({ id: c.id, name: c.name, model: c.model })));
    } catch (error: any) {
      res.json({ error: error.message });
    }
  });

  // BLUETOOTH (noble)
  app.get('/api/bluetooth/scan', async (req, res) => {
    try {
      // Noble might not be available in all environments
      const noble = (await import('noble')).default;
      const devices: any[] = [];
      noble.on('discover', (device) => {
        devices.push({ id: device.id, name: device.advertisement.localName, rssi: device.rssi });
      });
      noble.startScanning();
      setTimeout(() => {
        noble.stopScanning();
        res.json(devices);
      }, 3000);
    } catch (error: any) {
      res.json({ error: 'Bluetooth scanning not supported in this environment', details: error.message });
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
