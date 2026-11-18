import { useRef, useState } from 'react';
import * as Location from 'expo-location';

interface Posicao {
  latitude: number;
  longitude: number;
  bairro?: string;
}

export function useLocalizacao() {
  const [buscando, definirBuscando] = useState(false);

  const [mensagem, definirMensagem] = useState('');

  const ocupado = useRef(false);

  async function capturar(): Promise<Posicao | undefined> {
    if (ocupado.current) return;

    ocupado.current = true;
    definirBuscando(true);
    definirMensagem('');
    try {
      const permissao = await Location.requestForegroundPermissionsAsync();

      if (!permissao.granted) {
        definirMensagem('Não foi possível usar a localização. Digite o bairro.');

        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const latitude = Number(coords.latitude.toFixed(6));

      const longitude = Number(coords.longitude.toFixed(6));

      let bairro: string | undefined;
      try {
        const [endereco] = await Location.reverseGeocodeAsync({ latitude, longitude });
        bairro = endereco?.district?.trim() || undefined;
      } catch {
        /* As coordenadas permitem continuar com o bairro digitado. */
      }
      definirMensagem(
        bairro ? 'Posição capturada. Bairro preenchido.' : 'Posição capturada. Digite o bairro.',
      );

      return { latitude, longitude, bairro };
    } catch {
      definirMensagem('Não foi possível usar a localização. Digite o bairro.');
    } finally {
      ocupado.current = false;
      definirBuscando(false);
    }
  }

  return { buscando, mensagem, capturar };
}
