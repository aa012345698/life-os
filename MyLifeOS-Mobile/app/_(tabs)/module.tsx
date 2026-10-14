/**
 * 模块编辑屏幕 - 数据输入
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
  Picker,
  Switch,
  Alert,
} from 'react-native';
import { useAppStore } from '../../store/appStore';
import { Feather } from '@expo/vector-icons';
import { Module } from '../../core/moduleManager';

export default function ModuleScreen() {
  const {
    vault,
    modules,
    currentModuleId,
    setCurrentModule,
    updateFieldValue,
  } = useAppStore();

  const [currentModule, setCurrentModuleData] = useState<Module | null>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [editingRecord, setEditingRecord] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [moduleList, setModuleList] = useState<Module[]>([]);

  useEffect(() => {
    if (!modules) return;

    const list = modules.getModules();
    setModuleList(list);

    const id = currentModuleId || list[0]?.id;
    if (id) {
      const module = modules.getModule(id);
      setCurrentModuleData(module || null);

      if (vault && module) {
        const moduleRecords = vault.getModuleData(id);
        setRecords(moduleRecords);

        if (moduleRecords.length > 0) {
          setFormData(moduleRecords[0].data);
          setEditingRecord(moduleRecords[0].recordId);
        }
      }
    }
  }, [currentModuleId, modules, vault]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const handleSave = () => {
    if (!editingRecord || !currentModule) return;

    const record = records.find((r) => r.recordId === editingRecord);
    if (!record) return;

    Object.keys(formData).forEach((fieldId) => {
      if (record.data[fieldId] !== formData[fieldId]) {
        updateFieldValue(
          currentModule.id,
          editingRecord,
          fieldId,
          formData[fieldId]
        );
      }
    });

    Alert.alert('成功', '数据已保存');
  };

  if (!currentModule) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.emptyText}>加载中...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#080b10" />

      {/* 顶部栏 */}
      <View style={styles.header}>
        <Text style={styles.title}>
          <Text style={styles.accent}>&gt;</Text> {currentModule.name}
        </Text>
      </View>

      {/* 模块选择器 */}
      {moduleList.length > 1 && (
        <View style={styles.modulePicker}>
          <Picker
            selectedValue={currentModule.id}
            onValueChange={(itemValue) => {
              setCurrentModule(itemValue);
            }}
            style={styles.picker}
            itemStyle={styles.pickerItem}
          >
            {moduleList.map((m) => (
              <Picker.Item
                key={m.id}
                label={`${m.icon} ${m.name}`}
                value={m.id}
              />
            ))}
          </Picker>
        </View>
      )}

      {/* 模块说明 */}
      <View style={styles.description}>
        <Text style={styles.descriptionText}>
          <Text style={styles.descriptionIcon}>[INFO]</Text> {currentModule.description}
        </Text>
      </View>

      {/* 表单 */}
      <ScrollView style={styles.form}>
        {currentModule.fields.map((field) => (
          <View key={field.fieldId} style={styles.formGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>
                <Text style={styles.bullet}>•</Text> {field.fieldName}
                {field.required && <Text style={styles.required}> *</Text>}
              </Text>
              <Text style={styles.hint}>{field.fieldLabel}</Text>
            </View>

            {field.fieldType === 'text' && (
              <TextInput
                style={styles.input}
                value={formData[field.fieldId]?.toString() || ''}
                onChangeText={(text) => handleFieldChange(field.fieldId, text)}
                placeholder={`输入 ${field.fieldName}`}
                placeholderTextColor="#666"
              />
            )}

            {field.fieldType === 'number' && (
              <TextInput
                style={styles.input}
                value={formData[field.fieldId]?.toString() || ''}
                onChangeText={(text) =>
                  handleFieldChange(field.fieldId, parseFloat(text) || 0)
                }
                placeholder={`输入 ${field.fieldName}`}
                placeholderTextColor="#666"
                keyboardType="numeric"
              />
            )}

            {field.fieldType === 'currency' && (
              <View style={styles.currencyInput}>
                <TextInput
                  style={[styles.input, styles.currencyField]}
                  value={formData[field.fieldId]?.toString() || ''}
                  onChangeText={(text) =>
                    handleFieldChange(field.fieldId, parseFloat(text) || 0)
                  }
                  placeholder="金额"
                  placeholderTextColor="#666"
                  keyboardType="decimal-pad"
                />
                {field.unit && (
                  <Text style={styles.currencyUnit}>{field.unit}</Text>
                )}
              </View>
            )}

            {field.fieldType === 'select' && field.options && (
              <View style={styles.selectInput}>
                <Picker
                  selectedValue={formData[field.fieldId] || ''}
                  onValueChange={(value) =>
                    handleFieldChange(field.fieldId, value)
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="-- 请选择 --" value="" />
                  {field.options.map((opt) => (
                    <Picker.Item key={opt} label={opt} value={opt} />
                  ))}
                </Picker>
              </View>
            )}

            {field.fieldType === 'textarea' && (
              <TextInput
                style={[styles.input, styles.textarea]}
                value={formData[field.fieldId]?.toString() || ''}
                onChangeText={(text) => handleFieldChange(field.fieldId, text)}
                placeholder={`输入 ${field.fieldName}`}
                placeholderTextColor="#666"
                multiline
                numberOfLines={3}
              />
            )}

            {field.fieldType === 'checkbox' && (
              <Switch
                style={styles.checkbox}
                value={formData[field.fieldId] || false}
                onValueChange={(value) =>
                  handleFieldChange(field.fieldId, value)
                }
                trackColor={{ false: '#1a1f2e', true: '#00ff9d' }}
                thumbColor={formData[field.fieldId] ? '#00ff9d' : '#666'}
              />
            )}

            {field.fieldType === 'date' && (
              <TextInput
                style={styles.input}
                value={formData[field.fieldId]?.toString() || ''}
                onChangeText={(text) => handleFieldChange(field.fieldId, text)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#666"
              />
            )}
          </View>
        ))}

        {/* 保存按钮 */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            <Text style={styles.accent}>&gt;</Text> 保存
          </Text>
        </TouchableOpacity>

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
  modulePicker: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1f2e',
  },
  picker: {
    color: '#e0e6f1',
  },
  pickerItem: {
    color: '#e0e6f1',
    fontSize: 14,
  },
  description: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 229, 255, 0.05)',
  },
  descriptionText: {
    fontSize: 12,
    color: '#e0e6f1',
  },
  descriptionIcon: {
    color: '#00e5ff',
  },
  form: {
    flex: 1,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  formGroup: {
    marginBottom: 16,
  },
  labelRow: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#e0e6f1',
    marginBottom: 4,
  },
  bullet: {
    color: '#00ff9d',
  },
  required: {
    color: '#ff1744',
  },
  hint: {
    fontSize: 11,
    color: '#a8b2c1',
    marginTop: 2,
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: '#1a1f2e',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#e0e6f1',
    fontSize: 14,
  },
  currencyInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyField: {
    flex: 1,
    marginRight: 8,
  },
  currencyUnit: {
    color: '#a8b2c1',
    fontSize: 12,
    paddingVertical: 8,
  },
  selectInput: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 1,
    borderColor: '#1a1f2e',
    borderRadius: 4,
    overflow: 'hidden',
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  checkbox: {
    marginVertical: 4,
  },
  saveButton: {
    backgroundColor: 'rgba(0, 255, 157, 0.1)',
    borderWidth: 1,
    borderColor: '#00ff9d',
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00ff9d',
  },
  spacer: {
    height: 20,
  },
  emptyText: {
    color: '#e0e6f1',
    textAlign: 'center',
    marginTop: 32,
  },
});
