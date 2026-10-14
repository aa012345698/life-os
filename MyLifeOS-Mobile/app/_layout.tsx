/**
 * 应用根布局
 */

import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useAppStore } from '../store/appStore';
import * as SplashScreen from 'expo-splash-screen';

// 保持 splash 屏幕显示直到应用初始化完成
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { initialize, vault, isLoading } = useAppStore();

  useEffect(() => {
    async function initializeApp() {
      try {
        const apiKey = process.env.EXPO_PUBLIC_API_KEY || '';
        await initialize(apiKey);
      } catch (error) {
        console.error('初始化失败:', error);
      } finally {
        // 隐藏 splash 屏幕
        await SplashScreen.hideAsync();
      }
    }

    initializeApp();
  }, []);

  if (isLoading || !vault) {
    return (
      <Stack
        screenOptions={{
          headerShown: false,
          animationEnabled: false,
        }}
      >
        <Stack.Screen name="loading" />
      </Stack>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
