/**
 * 加载屏幕
 */

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';

export default function LoadingScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          <Text style={styles.accent}>&gt;</Text> MY_LIFE_OS
        </Text>
        <Text style={styles.subtitle}>v1.0.0</Text>

        <ActivityIndicator size="large" color="#00ff9d" style={styles.loader} />

        <Text style={styles.loadingText}>初始化中...</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080b10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e0e6f1',
    letterSpacing: 3,
    marginBottom: 8,
  },
  accent: {
    color: '#00ff9d',
    textShadowColor: '#00ff9d',
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 12,
    color: '#a8b2c1',
    letterSpacing: 2,
    marginBottom: 32,
  },
  loader: {
    marginVertical: 24,
  },
  loadingText: {
    fontSize: 14,
    color: '#00e5ff',
    marginTop: 16,
  },
});
