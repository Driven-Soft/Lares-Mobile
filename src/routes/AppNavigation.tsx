import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { cores } from '../theme/cores';
import { RootStack } from './RootStack';

const tema = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: cores.verde,
    background: cores.fundo,
    card: cores.cartao,
    text: cores.texto,
    border: cores.borda,
    notification: cores.erro,
  },
};

export function AppNavigation() {
  return (
    <NavigationContainer theme={tema}>
      <RootStack />
    </NavigationContainer>
  );
}
