import type { PropsWithChildren } from 'react';
import { View } from 'react-native';
export function Cartao({ children }: PropsWithChildren) {
  return (
    <View className="gap-3 rounded-xl border border-borda bg-cartao p-4 shadow-sm">{children}</View>
  );
}
export function EsqueletoCartao() {
  return (
    <View accessible accessibilityLabel="Carregando ocorrência">
      <Cartao>
        {['w-1/3', 'w-full', 'w-2/3'].map((largura) => (
          <View key={largura} className={`h-3 rounded-full bg-borda ${largura}`} />
        ))}
      </Cartao>
    </View>
  );
}
