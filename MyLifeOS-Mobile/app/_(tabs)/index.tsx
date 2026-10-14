/**
 * MY_LIFE_OS - 移动版主屏幕
 * 显示总览面板和快速操作
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { useAppStore } from '../../store/appStore';
import { Feather } from '@expo/vector-icons';

export default function OverviewScreen() {
  const { syncEngine, vault, currentView, setCurrentView } = useAppStore();
  const [overview, setOverview] = useState<any>({});
  const [refreshing, setRefreshing] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);

  useEffect(() => {
    if (!syncEngine || !vault) return;

    const updateOverview = () => {
      const data = syncEngine.generateOverview();
      setOverview(data);
      setPrivacyMode(vault.isPrivacyModeEnabled());
    };

    updateOverview();

    // 订阅数据变化
    const unsubscribe = vault.subscribe(updateOverview);
    return unsubscribe;
  }, [syncEngine, vault]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#080b10" />

      {/* 顶部栏 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>
            <Text style={styles.accent}>&gt;</Text> OVERVIEW
          </Text>
          {privacyMode && (
            <View style={styles.privacyBadge}>
              <Text style={styles.privacyText}>🔒 PRIVACY ON</Text>
            </View>
          )}
        </View>
        <TouchableOpacity
          style={styles.settingsButton}
          onPress={() => setCurrentView('settings')}
        >
          <Feather name="settings" size={24} color="#00ff9d" />
        </TouchableOpacity>
      </View>

      {/* 内容区 */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {Object.entries(overview).map(([moduleName, moduleData]: any) => (
          <View key={moduleName} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={[styles.moduleIcon, { color: moduleData.color }]}>
                {moduleData.icon}
              </Text>
              <Text style={styles.moduleName}>{moduleName}</Text>
            </View>

            <View style={styles.cardContent}>
              {moduleData.fields.map((field: any) => (
                <View key={field.fieldId} style={styles.kpiRow}>
                  <Text style={styles.kpiLabel}>{field.fieldName}</Text>
                  <View style={styles.kpiValue}>
                    <Text style={styles.value}>
                      {field.value !== null && field.value !== undefined
                        ? field.value
                        : '-'}
                    </Text>
                    {field.unit && (
                      <Text style={styles.unit}>{field.unit}</Text>
                    )}
                    <Text style={[styles.trend, styles[`trend_${field.trend}`]]}>
                      {field.trend === 'up' && '↑'}
                      {field.trend === 'down' && '↓'}
                      {field.trend === 'stable' && '→'}
                      {field.trend === 'unknown' && '·'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* 卡片底部线 */}
            <View style={styles.cardFooter} />
          </View>
        ))}

        {/* 快速操作 */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>快速操作</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setCurrentView('module')}
            >
              <Feather name="edit-2" size={24} color="#00ff9d" />
              <Text style={styles.actionLabel}>编辑数据</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setCurrentView('ai')}
            >
              <Feather name="zap" size={24} color="#00e5ff" />
              <Text style={styles.actionLabel}>AI 分析</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => {
                if (vault) {
                  vault.togglePrivacyMode(!privacyMode);
                }
              }}
            >
              <Feather name={privacyMode ? 'lock' : 'unlock'} size={24} color="#ff1744" />
              <Text style={styles.actionLabel}>隐私</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* 底部状态栏 */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          <Text style={styles.footerLabel}>SYS_STATUS</Text>
          <Text style={styles.footerValue}> ONLINE</Text>
        </Text>
        <Text style={styles.footerText}>
          <Text style={styles.footerLabel}>PRIVACY</Text>
          <Text style={[styles.footerValue, privacyMode && styles.active]}>
            {privacyMode ? ' ON' : ' OFF'}
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080b10',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1f2e',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e0e6f1',
    letterSpacing: 2,
  },
  accent: {
    color: '#00ff9d',
    textShadowColor: '#00ff9d',
    textShadowRadius: 8,
  },
  privacyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#00e5ff',
    borderRadius: 4,
  },
  privacyText: {
    fontSize: 12,
    color: '#00e5ff',
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  card: {
    backgroundColor: 'rgba(15, 20, 25, 0.8)',
    borderWidth: 1,
    borderColor: '#1a1f2e',
    borderRadius: 4,
    padding: 12,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  moduleIcon: {
    fontSize: 20,
  },
  moduleName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e0e6f1',
  },
  cardContent: {
    gap: 8,
  },
  kpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  kpiLabel: {
    fontSize: 12,
    color: '#a8b2c1',
    flex: 1,
  },
  kpiValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00ff9d',
  },
  unit: {
    fontSize: 11,
    color: '#a8b2c1',
  },
  trend: {
    fontSize: 12,
    fontWeight: 'bold',
    width: 16,
    textAlign: 'center',
  },
  trend_up: {
    color: '#00ff00',
  },
  trend_down: {
    color: '#ff1744',
  },
  trend_stable: {
    color: '#00e5ff',
  },
  cardFooter: {
    marginTop: 8,
    height: 1,
    backgroundColor: 'rgba(0, 255, 157, 0.3)',
  },
  quickActions: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e0e6f1',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  actionGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    backgroundColor: 'rgba(15, 20, 25, 0.8)',
    borderWidth: 1,
    borderColor: '#1a1f2e',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 8,
  },
  actionLabel: {
    fontSize: 11,
    color: '#a8b2c1',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(15, 20, 25, 0.9)',
    borderTopWidth: 1,
    borderTopColor: '#1a1f2e',
  },
  footerText: {
    fontSize: 10,
    color: '#a8b2c1',
  },
  footerLabel: {
    color: '#a8b2c1',
  },
  footerValue: {
    color: '#e0e6f1',
  },
  active: {
    color: '#00e5ff',
  },
});
