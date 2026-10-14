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
        // 延迟隐藏 splash，确保 UI 有时间准备
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('初始化失败:', error);
      } finally {
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          // 忽略 splash 隐藏错误
        }
      }
    }

    initializeApp();
  }, [initialize]);

  if (isLoading || !vault) {
    return (
      <Stack
        screenOptions={{
          headerShown: false,
          animationEnabled: false,
        }}
      >
        <Stack.Screen name="loading" options={{ headerShown: false }} />
      </Stack>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
