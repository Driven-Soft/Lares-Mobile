import './global.css';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { queryClient } from './src/config/queryClient';
import { SnackbarProvider } from './src/context/SnackbarContext';
import { AuthProvider } from './src/context/AuthContext';
import { AppNavigation } from './src/routes/AppNavigation';

void SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontes, erro] = useFonts({ Inter_400Regular, Inter_600SemiBold, Inter_700Bold });

  useEffect(() => {
    if (fontes || erro) void SplashScreen.hideAsync();
  }, [fontes, erro]);

  if (!fontes && !erro) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>
          <AuthProvider>
            <AppNavigation />
          </AuthProvider>
        </SnackbarProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
