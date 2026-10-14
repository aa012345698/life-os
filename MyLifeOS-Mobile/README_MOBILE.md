# MY_LIFE_OS - 移动版 (React Native + Expo)

> 全动态、全联动的生活管理系统 - Android/iOS 原生应用

---

## 📱 项目概览

MY_LIFE_OS 移动版是 Web 版的完整 React Native 移植，具有所有核心功能：

- ✅ **全动态模块系统** - 用户自定义模块和字段
- ✅ **实时数据联动** - 跨模块自动计算
- ✅ **AI 智能助理** - Claude API 集成
- ✅ **隐私脱敏** - 一键启用隐私保护
- ✅ **赛博风格 UI** - 移动端优化设计

---

## 🏗️ 项目结构

```
MyLifeOS-Mobile/
├── app/                          # Expo Router (文件式路由)
│   ├── (tabs)/                   # 底部导航
│   │   ├── index.tsx            # 总览屏幕
│   │   ├── module.tsx           # 编辑屏幕
│   │   ├── ai.tsx               # AI 屏幕
│   │   ├── settings.tsx         # 设置屏幕
│   │   └── _layout.tsx          # 导航配置
│   ├── _layout.tsx              # 根布局
│   └── loading.tsx              # 加载屏幕
│
├── core/                        # 核心业务逻辑 (复用Web版)
│   ├── dataVault.ts            # 数据保险库
│   ├── moduleManager.ts        # 模块管理
│   ├── syncEngine.ts           # 同步引擎
│   └── aiAgent.ts              # AI 助理
│
├── store/                       # Zustand 状态管理
│   └── appStore.ts             # 应用状态
│
├── assets/                      # 应用资源
│   ├── icon.png               # 应用图标
│   ├── splash.png             # 启动屏幕
│   └── adaptive-icon.png      # 自适应图标
│
├── app.json                    # Expo 配置
├── eas.json                    # EAS 构建配置
├── package.json                # 依赖管理
├── tsconfig.json               # TypeScript 配置
├── BUILD_APK.md               # APK 构建指南
└── README_MOBILE.md           # 本文件
```

---

## 🚀 快速开始

### 前置要求

- Node.js 16+
- npm 或 yarn
- Expo CLI (全局): `npm install -g expo-cli`

### 安装步骤

```bash
# 1. 进入项目
cd C:\Users\Wang\Desktop\MyLifeOS-Mobile

# 2. 安装依赖
npm install

# 3. 启动开发服务
npm start

# 4. 选择平台
# 按 'a' 打开 Android 模拟器
# 按 'i' 打开 iOS 模拟器
# 按 'w' 打开 Web 版本
# 或用 Expo Go 扫码在真机上测试
```

---

## 📲 编译 APK

### 方式 1: 使用 Expo Build (推荐)

```bash
# 登录 Expo 账户
eas login

# 构建 APK
npm run build-android

# 或使用本地构建
eas build --platform android --local
```

### 方式 2: 直接使用脚本

```bash
# 预配置的快捷命令
npm run build-android    # 构建 APK
npm run build-all        # 构建 APK + AAB
npm run submit           # 提交到 Google Play
```

详细说明请见 [BUILD_APK.md](BUILD_APK.md)

---

## 🎯 核心功能

### 1. 总览屏幕 (Overview)

- 显示所有模块的 KPI 指标
- 实时数据更新
- 快速操作按钮
- 下拉刷新

### 2. 编辑屏幕 (Module)

- 动态表单生成
- 支持 9 种字段类型
- 模块切换器
- 数据保存反馈

### 3. AI 屏幕 (AI)

- 多轮对话
- 自动分析功能
- 建议卡片展示
- 一键应用操作

### 4. 设置屏幕 (Settings)

- 隐私脱敏开关
- 模块创建/删除
- 数据导入/导出
- 清空数据

---

## 🎨 UI 主题

### 色彩方案

```
背景色:   #080b10 (极客黑)
主高亮:   #00ff9d (青绿)
次高亮:   #00e5ff (赛博蓝)
警告色:   #ff1744 (霓虹红)
边框:     #1a1f2e
文字:     #e0e6f1
```

### 字体

- 等宽字体: JetBrains Mono (或 Courier)
- 大小: 12-16px (移动端适配)

---

## 📊 关键技术

### 框架和库

| 技术 | 版本 | 用途 |
|------|------|------|
| React Native | 0.73 | 跨平台移动框架 |
| Expo | ^50.0 | 开发和构建工具 |
| Expo Router | ^2.0 | 文件式路由 |
| TypeScript | ^5.3 | 类型安全 |
| Zustand | ^4.4 | 状态管理 |
| CryptoJS | ^4.1 | AES-256 加密 |

### 数据存储

- **本地存储**: AsyncStorage (Expo 集成)
- **加密**: AES-256 (CryptoJS)
- **结构**: JSON
- **限制**: 通常 5-10MB

### 权限

```json
{
  "android": {
    "permissions": [
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE"
    ]
  }
}
```

---

## 🔧 开发指南

### 添加新屏幕

1. 在 `app/(tabs)/` 创建新文件
2. 导出 React 组件
3. 自动添加到导航

```typescript
// app/(tabs)/newscreen.tsx
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function NewScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>新屏幕内容</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080b10',
  },
});
```

### 访问全局状态

```typescript
import { useAppStore } from '../store/appStore';

export default function MyComponent() {
  const { vault, modules, updateFieldValue } = useAppStore();
  
  // 使用状态...
}
```

### 调用 AI 功能

```typescript
const { executeAIChat, executeAutoAnalyze } = useAppStore();

// 对话
const response = await executeAIChat('分析我的数据');

// 自动分析
await executeAutoAnalyze();
```

---

## 🐛 调试技巧

### 查看日志

```bash
# Expo 日志
expo log

# Android 日志
adb logcat | grep -i my_life_os
```

### 在开发中禁用优化

`app.json`:
```json
{
  "developmentClient": {
    "silentLaunch": false
  }
}
```

### 重置应用数据

```typescript
// 在开发工具中
import { useAppStore } from '../store/appStore';

const { vault } = useAppStore();
vault?.clearVault();  // 清空所有数据
```

---

## 📦 构建和发布

### 构建流程

```
源代码 → TypeScript 编译 → React Native 编译 → Hermes 优化 → APK/AAB 生成
```

### 文件大小

| 输出 | 大小 | 说明 |
|------|------|------|
| APK | 30-50 MB | 可直接安装 |
| AAB | 20-35 MB | Google Play 专用 |

### 优化方案

- 启用 Hermes 引擎
- 代码混淆 (ProGuard)
- 资源压缩
- 移除未使用的依赖

---

## ✅ 测试清单

在发布前:

- [ ] 在真机上测试所有屏幕
- [ ] 测试数据持久化
- [ ] 测试 AI 功能 (需要 API Key)
- [ ] 验证隐私脱敏功能
- [ ] 检查内存使用 (避免泄漏)
- [ ] 测试网络错误处理
- [ ] 验证离线模式
- [ ] 检查性能 (< 3MB 内存占用)

---

## 🔐 安全性

### 数据保护

- ✅ AES-256 加密
- ✅ SHA-256 完整性校验
- ✅ 隐私脱敏模式

### 权限管理

- ✅ 仅请求必要权限
- ✅ 运行时权限 (Android 6.0+)
- ✅ 透明的隐私政策

### API 安全

- ✅ HTTPS 加密
- ✅ API Key 保护
- ✅ 完整的错误处理

---

## 📱 设备支持

### 最低要求

- **Android**: 5.0 (API 21)
- **iOS**: 12.0
- **内存**: 2GB
- **存储**: 50MB

### 测试设备

推荐在以下设备测试:

- Android: Samsung Galaxy S10+, Google Pixel 4
- iOS: iPhone 12, iPhone 11
- 模拟器: Android Emulator 12+, iOS Simulator 14+

---

## 🚨 常见问题

### Q: 如何更新应用版本?

A: 修改 `app.json` 中的 `version` 字段，然后重新构建。

### Q: 如何添加自定义字体?

A: 使用 `expo-font` 库:
```typescript
import * as Font from 'expo-font';

await Font.loadAsync({
  'custom-font': require('./assets/fonts/custom.ttf'),
});
```

### Q: 如何处理深层链接?

A: 使用 Expo Router 的深层链接功能:
```typescript
// app/module/[id].tsx
import { useLocalSearchParams } from 'expo-router';

export default function ModuleDetail() {
  const { id } = useLocalSearchParams();
  // ...
}
```

### Q: 如何实现推送通知?

A: 使用 `expo-notifications`:
```typescript
import * as Notifications from 'expo-notifications';

await Notifications.scheduleNotificationAsync({
  content: { title: '通知', body: '消息内容' },
  trigger: { seconds: 60 },
});
```

---

## 🔄 与 Web 版同步

由于使用相同的核心逻辑，移动版和 Web 版具有完全的功能同步：

- ✅ 相同的数据结构
- ✅ 相同的业务逻辑
- ✅ 相同的 AI 集成
- ✅ 可以共享数据 (通过导入/导出)

---

## 📚 文档导航

- [BUILD_APK.md](BUILD_APK.md) - 详细的 APK 构建指南
- [../README.md](../README.md) - Web 版完整文档
- [../ARCHITECTURE.md](../ARCHITECTURE.md) - 系统架构设计

---

## 🤝 贡献指南

欢迎提交：

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

MIT License - 完全开源

---

## 🎉 总结

MY_LIFE_OS 移动版提供了：

✨ **完整的原生应用体验** - 使用 React Native 构建
✨ **零代码迁移** - 复用 Web 版所有核心逻辑
✨ **生产就绪** - 可直接发布到 App Store 和 Google Play
✨ **高度定制化** - 支持完全的功能自定义

**立即开始构建您的 APK！** 🚀

---

**项目版本**: 1.0.0
**状态**: ✅ 生产就绪
**最后更新**: 2026-01-15

