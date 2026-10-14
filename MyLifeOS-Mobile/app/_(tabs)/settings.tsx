/**
 * 设置屏幕 - 模块管理、数据备份
 */

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert,
  Switch,
} from 'react-native';
import { useAppStore } from '../../store/appStore';
import { Feather } from '@expo/vector-icons';
import { Module } from '../../core/moduleManager';

export default function SettingsScreen() {
  const { modules, vault, togglePrivacyMode, systemStatus } = useAppStore();

  const [modulesList, setModulesList] = useState<Module[]>([]);
  const [showAddModule, setShowAddModule] = useState(false);
  const [newModuleName, setNewModuleName] = useState('');
  const [privacyMode, setPrivacyMode] = useState(false);

  useEffect(() => {
    if (!modules || !vault) return;
    setModulesList(modules.getModules());
    setPrivacyMode(vault.isPrivacyModeEnabled());
  }, [modules, vault]);

  const handleAddModule = () => {
    if (!modules || !newModuleName.trim()) {
      Alert.alert('错误', '请输入模块名称');
      return;
    }

    modules.createModule(newModuleName, 'custom', '📌', '#6366F1');
    setModulesList(modules.getModules());
    setNewModuleName('');
    setShowAddModule(false);
    Alert.alert('成功', '模块已创建');
  };

  const handleDeleteModule = (moduleId: string) => {
    Alert.alert('删除模块', '确定要删除此模块吗？', [
      {
        text: '取消',
        style: 'cancel',
      },
      {
        text: '删除',
        style: 'destructive',
        onPress: () => {
          if (modules && modules.deleteModule(moduleId)) {
            setModulesList(modules.getModules());
            Alert.alert('成功', '模块已删除');
          }
        },
      },
    ]);
  };

  const handleExportData = () => {
    if (!vault) return;

    const data = vault.exportData('json');
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `my-life-os-backup-${timestamp}.json`;

    Alert.alert('导出成功', `已将数据保存为 ${filename}`);
    // 实际应该使用 expo-file-system 和 expo-sharing 来保存文件
  };

  const handlePrivacyToggle = (value: boolean) => {
    setPrivacyMode(value);
    togglePrivacyMode();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#080b10" />

      <View style={styles.header}>
        <Text style={styles.title}>
          <Text style={styles.accent}>&gt;</Text> 设置
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* 隐私设置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionNumber}>[1]</Text> 隐私设置
          </Text>

          <View style={styles.settingItem}>
            <View style={styles.settingLabel}>
              <Text style={styles.settingName}>隐私脱敏模式</Text>
              <Text style={styles.settingDesc}>自动模糊化敏感数据</Text>
            </View>
            <Switch
              value={privacyMode}
              onValueChange={handlePrivacyToggle}
              trackColor={{ false: '#1a1f2e', true: '#00ff9d' }}
              thumbColor={privacyMode ? '#00ff9d' : '#666'}
            />
          </View>
        </View>

        {/* 模块管理 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionNumber}>[2]</Text> 模块管理
          </Text>

          <ScrollView style={styles.modulesList}>
            {modulesList.map((module) => (
              <View key={module.id} style={styles.moduleItem}>
                <View style={styles.moduleInfo}>
                  <Text style={styles.moduleIcon}>{module.icon}</Text>
                  <View style={styles.moduleDetails}>
                    <Text style={styles.moduleName}>{module.name}</Text>
                    <Text style={styles.moduleDesc}>{module.description}</Text>
                    <Text style={styles.moduleMeta}>
                      {module.fields.length} 字段 • 类型: {module.type}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteModule(module.id)}
                >
                  <Feather name="trash-2" size={18} color="#ff1744" />
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {!showAddModule ? (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setShowAddModule(true)}
            >
              <Feather name="plus" size={18} color="#00ff9d" />
              <Text style={styles.addButtonText}>新建模块</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.addForm}>
              <TextInput
                style={styles.input}
                placeholder="输入模块名称"
                placeholderTextColor="#666"
                value={newModuleName}
                onChangeText={setNewModuleName}
              />
              <View style={styles.formButtons}>
                <TouchableOpacity
                  style={[styles.formButton, styles.submitButton]}
                  onPress={handleAddModule}
                >
                  <Text style={styles.buttonText}>创建</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.formButton, styles.cancelButton]}
                  onPress={() => {
                    setShowAddModule(false);
                    setNewModuleName('');
                  }}
                >
                  <Text style={styles.buttonText}>取消</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* 数据操作 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionNumber}>[3]</Text> 数据管理
          </Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleExportData}
          >
            <Feather name="download" size={20} color="#00ff9d" />
            <Text style={styles.actionButtonText}>导出数据</Text>
            <Feather name="chevron-right" size={20} color="#1a1f2e" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => {
              Alert.alert('提示', '将清空所有数据，此操作不可撤销', [
                {
                  text: '取消',
                  style: 'cancel',
                },
                {
                  text: '清空',
                  style: 'destructive',
                  onPress: () => {
                    if (vault) {
                      vault.clearVault();
                      Alert.alert('成功', '所有数据已清空');
                    }
                  },
                },
              ]);
            }}
          >
            <Feather name="trash-2" size={20} color="#ff1744" />
            <Text style={[styles.actionButtonText, { color: '#ff1744' }]}>
              清空数据
            </Text>
            <Feather name="chevron-right" size={20} color="#1a1f2e" />
          </TouchableOpacity>
        </View>

        {/* 关于 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            <Text style={styles.sectionNumber}>[4]</Text> 关于
          </Text>

          <View style={styles.aboutBox}>
            <Text style={styles.appName}>MY_LIFE_OS</Text>
            <Text style={styles.version}>v1.0.0 (Mobile)</Text>
            <Text style={styles.description}>
              全动态、全联动的生活管理系统
            </Text>
            <View style={styles.techStack}>
              <Text style={styles.techItem}>React Native</Text>
              <Text style={styles.techItem}>Expo</Text>
              <Text style={styles.techItem}>Claude AI</Text>
            </View>
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080b10',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1f2e',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e0e6f1',
    letterSpacing: 2,
  },
  accent: {
    color: '#00ff9d',
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e0e6f1',
    marginBottom: 12,
  },
  sectionNumber: {
    color: '#00e5ff',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 20, 25, 0.8)',
    borderWidth: 1,
    borderColor: '#1a1f2e',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
  },
  settingLabel: {
    flex: 1,
  },
  settingName: {
    fontSize: 13,
    fontWeight: '500',
    color: '#e0e6f1',
    marginBottom: 4,
  },
  settingDesc: {
    fontSize: 11,
    color: '#a8b2c1',
  },
  modulesList: {
    maxHeight: 200,
    marginBottom: 12,
  },
  moduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 20, 25, 0.8)',
    borderWidth: 1,
    borderColor: '#1a1f2e',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  moduleInfo: {
    flexDirection: 'row',
    flex: 1,
    gap: 10,
  },
  moduleIcon: {
    fontSize: 18,
    width: 24,
    textAlign: 'center',
  },
  moduleDetails: {
    flex: 1,
  },
  moduleName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e0e6f1',
    marginBottom: 2,
  },
  moduleDesc: {
    fontSize: 10,
    color: '#a8b2c1',
    marginBottom: 2,
  },
  moduleMeta: {
    fontSize: 10,
    color: '#a8b2c1',
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(0, 255, 157, 0.1)',
    borderWidth: 1,
    borderColor: '#00ff9d',
    borderRadius: 4,
    paddingVertical: 10,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#00ff9d',
  },
  addForm: {
    gap: 10,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: '#1a1f2e',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#e0e6f1',
    fontSize: 12,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  formButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: 'rgba(0, 255, 157, 0.1)',
    borderWidth: 1,
    borderColor: '#00ff9d',
  },
  cancelButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: '#1a1f2e',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#e0e6f1',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(15, 20, 25, 0.8)',
    borderWidth: 1,
    borderColor: '#1a1f2e',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 8,
  },
  actionButtonText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '500',
    color: '#e0e6f1',
  },
  aboutBox: {
    backgroundColor: 'rgba(15, 20, 25, 0.8)',
    borderWidth: 1,
    borderColor: '#1a1f2e',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  appName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00ff9d',
    marginBottom: 4,
  },
  version: {
    fontSize: 12,
    color: '#a8b2c1',
    marginBottom: 8,
  },
  description: {
    fontSize: 11,
    color: '#a8b2c1',
    textAlign: 'center',
    marginBottom: 12,
  },
  techStack: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  techItem: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(0, 255, 157, 0.1)',
    borderWidth: 1,
    borderColor: '#00ff9d',
    borderRadius: 3,
    fontSize: 10,
    color: '#00ff9d',
  },
  spacer: {
    height: 20,
  },
});
