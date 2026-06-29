import React, { Suspense } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SQLiteProvider } from 'expo-sqlite';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AppContextProvider } from './src/context/AppContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { initDatabase } from './src/storage/database';
import { seedDefaultCategories } from './src/storage/categoryRepository';
import type { SQLiteDatabase } from 'expo-sqlite';

async function onInit(db: SQLiteDatabase): Promise<void> {
  await initDatabase(db);
  await seedDefaultCategories(db);
}

function Fallback(): React.JSX.Element {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#2563eb" />
    </View>
  );
}

export default function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <SQLiteProvider databaseName="expense_tracker.db" onInit={onInit}>
        <Suspense fallback={<Fallback />}>
          <AppContextProvider>
            <AppNavigator />
            <StatusBar style="auto" />
          </AppContextProvider>
        </Suspense>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
