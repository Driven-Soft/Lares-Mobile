import './global.css';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { Logo } from './src/components/Logo';
import { Campo } from './src/components/Campo';
import { Botao } from './src/components/Botao';
import { Etiqueta } from './src/components/Etiqueta';
import { Cartao } from './src/components/Cartao';
import { cores } from './src/theme/cores';
void SplashScreen.preventAutoHideAsync();
export default function App() {
  const [fontes, erro] = useFonts({ Inter_400Regular, Inter_600SemiBold, Inter_700Bold });
  const [bairro, definirBairro] = useState('');
  useEffect(() => {
    if (fontes || erro) void SplashScreen.hideAsync();
  }, [fontes, erro]);
  if (!fontes && !erro) return null;
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: cores.fundo }}>
        <StatusBar style="dark" />
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="grow justify-center gap-6 p-5"
        >
          <View className="items-center">
            <Logo />
          </View>
          <Cartao>
            <Etiqueta status="RECEBIDA" />
            <Campo
              rotulo="Bairro"
              placeholder="Digite seu bairro"
              value={bairro}
              onChangeText={definirBairro}
            />
            <Botao
              titulo="Limpar campo"
              variante="secundario"
              desabilitado={!bairro}
              aoPressionar={() => definirBairro('')}
            />
          </Cartao>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
