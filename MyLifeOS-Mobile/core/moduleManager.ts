/**
 * 模块管理器
 * 管理用户自定义的生活管理模块（健康、财务、习惯、目标等）
 * 模块定义持久化在 AsyncStorage，支持创建/删除/查询
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export type FieldType =
  | 'text'
  | 'number'
  | 'currency'
  | 'select'
  | 'textarea'
  | 'checkbox'
  | 'date';

export interface FieldDef {
  fieldId: string;
  fieldName: string;
  fieldType: FieldType;
  /** 字段提示文案 */
  fieldLabel: string;
  required: boolean;
  unit?: string;
  options?: string[];
}

export interface Module {
  id: string;
  name: string;
  description: string;
  type: string;
  icon: string;
  color: string;
  fields: FieldDef[];
}

export interface ModuleManagerOptions {
  storageKey?: string;
}

const DEFAULT_STORAGE_KEY = 'my_life_os_modules_mobile';

/** 生成模块 ID */
function genId(prefix: string): string {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

/** 内置默认模块 */
export function createDefaultModules(): Module[] {
  return [
    {
      id: 'mod_health',
      name: '健康管理',
      description: '追踪身体状态与日常健康指标',
      type: 'health',
      icon: '💚',
      color: '#00ff9d',
      fields: [
        { fieldId: 'weight', fieldName: '体重', fieldType: 'number', fieldLabel: '千克', required: false, unit: 'kg' },
        { fieldId: 'sleep', fieldName: '睡眠时长', fieldType: 'number', fieldLabel: '小时', required: false, unit: 'h' },
        { fieldId: 'steps', fieldName: '运动步数', fieldType: 'number', fieldLabel: '步', required: false, unit: 'steps' },
        { fieldId: 'water', fieldName: '饮水量', fieldType: 'number', fieldLabel: '毫升', required: false, unit: 'ml' },
        {
          fieldId: 'mood',
          fieldName: '今日心情',
          fieldType: 'select',
          fieldLabel: '选择心情',
          required: false,
          options: ['极好', '良好', '一般', '较差'],
        },
      ],
    },
    {
      id: 'mod_finance',
      name: '财务管理',
      description: '记录收支与资产状况',
      type: 'finance',
      icon: '💰',
      color: '#00e5ff',
      fields: [
        { fieldId: 'income', fieldName: '月收入', fieldType: 'currency', fieldLabel: '人民币', required: false, unit: '¥' },
        { fieldId: 'expense', fieldName: '月支出', fieldType: 'currency', fieldLabel: '人民币', required: false, unit: '¥' },
        { fieldId: 'savings', fieldName: '储蓄金额', fieldType: 'currency', fieldLabel: '人民币', required: false, unit: '¥' },
        { fieldId: 'roi', fieldName: '投资收益率', fieldType: 'number', fieldLabel: '百分比', required: false, unit: '%' },
      ],
    },
    {
      id: 'mod_habit',
      name: '习惯追踪',
      description: '培养好习惯，告别拖延',
      type: 'habit',
      icon: '⚡',
      color: '#ffaa00',
      fields: [
        { fieldId: 'streak', fieldName: '连续打卡天数', fieldType: 'number', fieldLabel: '天', required: false, unit: 'd' },
        { fieldId: 'completion', fieldName: '今日完成率', fieldType: 'number', fieldLabel: '百分比', required: false, unit: '%' },
        { fieldId: 'focus', fieldName: '专注时长', fieldType: 'number', fieldLabel: '小时', required: false, unit: 'h' },
      ],
    },
    {
      id: 'mod_goal',
      name: '目标进度',
      description: '年度目标与个人成长追踪',
      type: 'goal',
      icon: '🎯',
      color: '#ff6600',
      fields: [
        { fieldId: 'progress', fieldName: '年度目标完成度', fieldType: 'number', fieldLabel: '百分比', required: false, unit: '%' },
        { fieldId: 'books', fieldName: '已读书籍', fieldType: 'number', fieldLabel: '本', required: false, unit: 'books' },
        { fieldId: 'skills', fieldName: '技能等级', fieldType: 'select', fieldLabel: '当前等级', required: false, options: ['入门', '进阶', '熟练', '精通'] },
      ],
    },
  ];
}

export class ModuleManager {
  private modules: Module[] = [];
  private storageKey: string;
  private loaded = false;

  constructor(options: ModuleManagerOptions = {}) {
    this.storageKey = options.storageKey || DEFAULT_STORAGE_KEY;
  }

  /** 从本地存储加载模块定义；首次运行写入默认模块 */
  async load(): Promise<Module[]> {
    if (this.loaded) return this.modules;
    try {
      const raw = await AsyncStorage.getItem(this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.modules = parsed as Module[];
          this.loaded = true;
          return this.modules;
        }
      }
    } catch (error) {
      console.warn('[ModuleManager] 加载失败，使用默认模块:', error);
    }
    this.modules = createDefaultModules();
    await this.persist();
    this.loaded = true;
    return this.modules;
  }

  private async persist(): Promise<void> {
    try {
      await AsyncStorage.setItem(this.storageKey, JSON.stringify(this.modules));
    } catch (error) {
      console.warn('[ModuleManager] 持久化失败:', error);
    }
  }

  getModules(): Module[] {
    return this.modules;
  }

  getModule(id: string): Module | undefined {
    return this.modules.find((m) => m.id === id);
  }

  createModule(name: string, type = 'custom', icon = '📌', color = '#6366F1'): Module {
    const module: Module = {
      id: genId('mod'),
      name,
      description: '自定义模块',
      type,
      icon,
      color,
      fields: [
        { fieldId: 'note', fieldName: '备注', fieldType: 'text', fieldLabel: '自由文本', required: false },
      ],
    };
    this.modules.push(module);
    void this.persist();
    return module;
  }

  deleteModule(id: string): boolean {
    const index = this.modules.findIndex((m) => m.id === id);
    if (index === -1) return false;
    this.modules.splice(index, 1);
    void this.persist();
    return true;
  }
}
