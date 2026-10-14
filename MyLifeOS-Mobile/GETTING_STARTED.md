# MY_LIFE_OS 移动版 - 5 分钟快速开始

> 从开发到 APK 的完整指南

---

## 第一步：环境准备 (2 分钟)

### 1.1 安装 Node.js

访问 https://nodejs.org，下载 LTS 版本并安装。

验证安装：
```bash
node --version    # 应该输出 v16+ 或更高
npm --version     # 应该输出 8+
```

### 1.2 安装 Expo CLI

```bash
npm install -g expo-cli
```

验证：
```bash
expo --version
```

---

## 第二步：项目设置 (1 分钟)

```bash
# 进入项目目录
cd C:\Users\Wang\Desktop\MyLifeOS-Mobile

# 安装依赖
npm install

# 这会安装所有必要的包 (~500MB，取决于网络)
```

---

## 第三步：启动开发环境 (1 分钟)

### 选项 A: 在 Android 模拟器上运行 (推荐新手)

前置：需要安装 Android Studio

```bash
npm run android
```

Expo 会自动：
1. 启动 Metro 打包服务
2. 编译应用
3. 在模拟器上安装并启动

### 选项 B: 在真机上运行 (推荐体验)

```bash
# 1. 启动 Expo
npm start

# 2. 下载 Expo Go 应用
# App Store: 搜索 "Expo Go"
# Google Play: 搜索 "Expo Go"

# 3. 用手机扫码 (终端显示的二维码)

# 应用会自动安装和启动！
```

### 选项 C: 在浏览器上运行 (快速预览)

```bash
npm run web
```

自动打开 `http://localhost:19006`

---

## 第四步：基本使用 (1 分钟)

### 首次启动

1. 应用加载完成后，你会看到 Onboarding 屏幕
2. 点击 `Start Setup`
3. 输入 Claude API Key (可选，跳过也可以)
4. 选择初始化模板

### 导航

- **总览** (📊) - 查看所有 KPI
- **编辑** (✏️) - 修改数据
- **AI** (⚡) - AI 助理
- **设置** (⚙️) - 模块管理

---

## 第五步：生成 APK (可选)

当你准备好发布时：

```bash
# 方式 1: 使用云构建 (推荐)
npm run build-android

# 方式 2: 使用本地构建 (需要 Android SDK)
eas build --platform android --local
```

完整说明见 [BUILD_APK.md](BUILD_APK.md)

---

## 🎯 接下来的步骤

### 开发建议

1. **阅读文档**
   - [README_MOBILE.md](README_MOBILE.md) - 移动版完整指南
   - [BUILD_APK.md](BUILD_APK.md) - APK 构建详解
   - [../README.md](../README.md) - Web 版核心功能

2. **创建自己的模块**
   - 在"设置"中点击"新建模块"
   - 添加自定义字段
   - 开始记录数据

3. **配置 AI 功能**
   - 获取 Claude API Key: https://console.anthropic.com
   - 在 Onboarding 中输入
   - 使用 AI 标签页进行分析

4. **自定义应用**
   - 替换应用图标 (`assets/icon.png`)
   - 替换启动屏幕 (`assets/splash.png`)
   - 修改主题色

### 开发技巧

- **热重载**: 代码改动会自动刷新
- **日志**: 按 `j` 打开 DevTools
- **调试**: 按 `d` 打开调试菜单

---

## 🚨 常见问题

### 问: 运行时出错怎么办?

**答**: 尝试以下步骤：

```bash
# 1. 清除缓存
npm start -- --clear

# 2. 重新安装依赖
rm -rf node_modules
npm install

# 3. 检查 Node 版本
node --version  # 应该 >= 16
```

### 问: 如何在真机上测试?

**答**:
1. 手机和电脑连接同一 WiFi
2. 下载 Expo Go 应用
3. 运行 `npm start`
4. 用 Expo Go 扫描二维码

### 问: 如何调试应用?

**答**:
```bash
# 启动开发工具
npm start

# 按 'i' 打开 iOS 调试 (macOS)
# 按 'a' 打开 Android 调试 (Windows/Linux)
# 按 'd' 打开调试菜单
# 按 'j' 打开 DevTools
```

### 问: 为什么应用很慢?

**答**: 可能原因：
- 开发模式未优化 (生产构建会快得多)
- API 请求超时
- 本地存储操作缓慢

解决：
```bash
# 构建优化版本
npm run build-android
```

### 问: 如何提交到 Google Play?

**答**: 详见 [BUILD_APK.md - 发布到 Google Play](BUILD_APK.md#发布到-google-play)

---

## 📊 文件位置参考

```
C:\Users\Wang\Desktop\
├── MyLifeOS/                 # Web 版本
│   └── README.md
├── MyLifeOS-Mobile/          # 移动版本 ← 你在这里
│   ├── app/                  # React Native 屏幕
│   ├── core/                 # 核心逻辑
│   ├── store/                # 状态管理
│   ├── package.json
│   ├── app.json              # Expo 配置
│   ├── BUILD_APK.md          # APK 指南
│   ├── README_MOBILE.md      # 完整文档
│   └── GETTING_STARTED.md    # 本文件
```

---

## ✅ 完成检查列表

你现在应该已经：

- [x] 安装了 Node.js 和 Expo CLI
- [x] 安装了项目依赖
- [x] 成功启动了应用
- [x] 看到了首屏
- [x] 了解了基本导航

**恭喜！你已经准备好开始开发了！** 🎉

---

## 🔗 快速链接

| 资源 | 链接 |
|------|------|
| Expo 文档 | https://docs.expo.dev |
| React Native | https://reactnative.dev |
| Claude API | https://console.anthropic.com |
| Android Studio | https://developer.android.com/studio |
| TypeScript | https://www.typescriptlang.org |

---

## 💬 需要帮助?

1. **查看文档** → [README_MOBILE.md](README_MOBILE.md)
2. **查看构建指南** → [BUILD_APK.md](BUILD_APK.md)
3. **查看架构设计** → [../ARCHITECTURE.md](../ARCHITECTURE.md)
4. **查看源代码** → `app/` 和 `core/` 目录

---

**现在就开始！运行：**

```bash
cd C:\Users\Wang\Desktop\MyLifeOS-Mobile
npm install
npm start
```

然后按 `a` 启动 Android 或用 Expo Go 扫二维码！

🚀

