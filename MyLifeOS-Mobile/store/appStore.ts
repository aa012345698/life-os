/**
 * React Native 版本的应用状态管理 (Zustand)
 */

import { create } from 'zustand';
import { DataVaultManager } from '../core/dataVault';
import { ModuleManager } from '../core/moduleManager';
import { SyncEngine } from '../core/syncEngine';
import { AIAgent, AISuggestion } from '../core/aiAgent';

export interface AppState {
  // 核心管理器
  vault: DataVaultManager | null;
  modules: ModuleManager | null;
  syncEngine: SyncEngine | null;
  aiAgent: AIAgent | null;

  // UI 状态
  currentModuleId: string | null;
  currentView: 'overview' | 'module' | 'ai' | 'settings';
  systemStatus: {
    online: boolean;
    lastSync: string;
    dataIntegrity: 'ok' | 'warning' | 'error';
    privacyMode: boolean;
  };
  isLoading: boolean;
  error: string | null;

  // AI 相关
  aiSuggestions: AISuggestion[];
  isAnalyzing: boolean;

  // 初始化
  initialize: (apiKey?: string) => Promise<void>;

  // 数据操作
  updateFieldValue: (
    moduleId: string,
    recordId: string,
    fieldId: string,
    value: any
  ) => void;

  // 视图导航
  setCurrentModule: (moduleId: string) => void;
  setCurrentView: (view: AppState['currentView']) => void;

  // AI 操作
  executeAIChat: (message: string) => Promise<string>;
  executeAutoAnalyze: () => Promise<void>;
  applySuggestion: (suggestion: AISuggestion) => Promise<void>;

  // 隐私
  togglePrivacyMode: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  vault: null,
  modules: null,
  syncEngine: null,
  aiAgent: null,

  currentModuleId: null,
  currentView: 'overview',
  systemStatus: {
    online: true,
    lastSync: new Date().toISOString(),
    dataIntegrity: 'ok',
    privacyMode: false,
  },
  isLoading: false,
  error: null,

  aiSuggestions: [],
  isAnalyzing: false,

  initialize: async (apiKey?: string) => {
    try {
      set({ isLoading: true, error: null });

      // 初始化各核心管理器
      const vault = new DataVaultManager({
        password: 'mobile-default-password',
        encryptionEnabled: true,
        storageKey: 'my_life_os_vault_mobile',
      });

      const modules = new ModuleManager();

      const syncEngine = new SyncEngine(vault, modules);

      const aiAgent = new AIAgent(
        {
          apiKey: apiKey || '',
          apiEndpoint: 'https://api.anthropic.com/v1',
          model: 'claude-opus-5-5',
        },
        vault,
        modules,
        syncEngine
      );

      // 订阅 AI 建议
      aiAgent.subscribe((suggestion) => {
        set((state) => ({
          aiSuggestions: [...state.aiSuggestions, suggestion],
        }));
      });

      // 初始计算 KPI
      syncEngine.recomputeAllKPIs();

      set({
        vault,
        modules,
        syncEngine,
        aiAgent,
        currentModuleId: modules.getModules()[0]?.id || null,
        systemStatus: {
          online: true,
          lastSync: new Date().toISOString(),
          dataIntegrity: 'ok',
          privacyMode: vault.isPrivacyModeEnabled(),
        },
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        isLoading: false,
      });
    }
  },

  updateFieldValue: (
    moduleId: string,
    recordId: string,
    fieldId: string,
    value: any
  ) => {
    const { vault, syncEngine } = get();
    if (!vault || !syncEngine) return;

    const records = vault.getModuleData(moduleId);
    const record = records.find((r) => r.recordId === recordId);
    if (!record) return;

    const oldValue = record.data[fieldId];
    const updatedData = { ...record.data, [fieldId]: value };

    vault.setModuleRecord(moduleId, recordId, updatedData, 'manual');
    syncEngine.notifyFieldChange(moduleId, recordId, fieldId, oldValue, value);

    set((state) => ({
      systemStatus: {
        ...state.systemStatus,
        lastSync: new Date().toISOString(),
      },
    }));
  },

  setCurrentModule: (moduleId: string) => {
    set({ currentModuleId: moduleId, currentView: 'module' });
  },

  setCurrentView: (view: AppState['currentView']) => {
    set({ currentView: view });
  },

  executeAIChat: async (message: string) => {
    const { aiAgent } = get();
    if (!aiAgent) throw new Error('AI Agent 未初始化');

    try {
      const response = await aiAgent.chat(message);
      return response;
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  executeAutoAnalyze: async () => {
    const { aiAgent } = get();
    if (!aiAgent) return;

    set({ isAnalyzing: true });

    try {
      const suggestions = await aiAgent.autoAnalyze();
      set({
        aiSuggestions: suggestions,
        isAnalyzing: false,
      });
    } catch (error: any) {
      set({
        error: error.message,
        isAnalyzing: false,
      });
    }
  },

  applySuggestion: async (suggestion: AISuggestion) => {
    const { aiAgent } = get();
    if (!aiAgent) return;

    try {
      const success = await aiAgent.applySuggestion(suggestion);
      if (success) {
        set((state) => ({
          aiSuggestions: state.aiSuggestions.filter((s) => s.id !== suggestion.id),
          systemStatus: {
            ...state.systemStatus,
            lastSync: new Date().toISOString(),
          },
        }));
      }
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  togglePrivacyMode: () => {
    const { vault } = get();
    if (!vault) return;

    const enabled = !vault.isPrivacyModeEnabled();
    vault.togglePrivacyMode(enabled);

    set((state) => ({
      systemStatus: {
        ...state.systemStatus,
        privacyMode: enabled,
      },
    }));
  },
}));
