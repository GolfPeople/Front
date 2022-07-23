import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.golfpeople.app',
  appName: 'Golf People',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    server: {
      hostname: 'localhost:8080',
      url: 'http://192.168.0.21:8080/',
      cleartext: true,
    },
    GoogleAuth: {
      scopes: ['profile', 'email'],
      androidClientId: '248337356424-rga3dmm2ejeoj5v5m1o5fnian9213jjq.apps.googleusercontent.com',       
      forceCodeForRefreshToken: false
    },
    SplashScreen: {
      launchShowDuration: 5000,     
      backgroundColor: "#00000",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};

export default config;
