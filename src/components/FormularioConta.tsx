import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function FormularioConta({ children, rodape }: { children: ReactNode; rodape: ReactNode }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="grow gap-4 px-5 pb-4 pt-5"
        >
          <View className="grow gap-4">{children}</View>
          {rodape}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
