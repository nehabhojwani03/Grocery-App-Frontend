// src/config/apiConfig.js
// ─── Single source of truth for your backend URL ─────────────────────────────
// Change ONLY this file when switching between emulator / physical device / production

import { Platform } from 'react-native';

const DEV_CONFIG = {
  // Android emulator uses 10.0.2.2 to reach your Mac's localhost
  // iOS simulator can use localhost directly
  android: 'http://10.0.2.2:8080/api/v1',
  ios: 'http://localhost:8080/api/v1',

  // ── Physical device ────────────────────────────────────────────────────────
  // Run `ipconfig getifaddr en0` on Mac to get your local IP
  // Then uncomment and replace:
  // android: 'http://192.168.1.X:8080/api/v1',
  // ios:     'http://192.168.1.X:8080/api/v1',
};

const PROD_URL = 'https://your-production-api.com/api/v1'; // replace when deploying

export const BASE_URL = __DEV__
  ? Platform.OS === 'android'
    ? DEV_CONFIG.android
    : DEV_CONFIG.ios
  : PROD_URL;

export const AUTH_URL = `${BASE_URL}/auth`;