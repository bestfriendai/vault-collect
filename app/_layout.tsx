import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { colors } from '../src/theme';

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 17,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen 
          name="item/[id]" 
          options={{ 
            title: 'Item Details',
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="item/new" 
          options={{ 
            title: 'Add Item',
            presentation: 'formSheet',
          }} 
        />
        <Stack.Screen 
          name="collection/[id]" 
          options={{ 
            title: 'Collection',
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="collection/new" 
          options={{ 
            title: 'New Collection',
            presentation: 'formSheet',
          }} 
        />
        <Stack.Screen 
          name="settings/index" 
          options={{ 
            title: 'Settings',
            presentation: 'card',
          }} 
        />
        <Stack.Screen 
          name="paywall" 
          options={{ 
            title: 'Premium',
            presentation: 'modal',
          }} 
        />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
