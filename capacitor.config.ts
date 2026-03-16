import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.noviavirtualia.app',
  appName: 'Novia Virtual IA',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
