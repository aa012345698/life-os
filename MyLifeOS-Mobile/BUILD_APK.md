# MY_LIFE_OS 移动版 - APK 构建指南

## 📱 技术栈

- **框架**: React Native 0.73
- **开发工具**: Expo (最新版本)
- **构建服务**: EAS Build (Expo Application Services)
- **目标平台**: Android (APK)、iOS (可选)

---

## 🚀 快速开始

### 方式 1：本地开发 (推荐用于测试)

#### 前置要求
- Node.js 16+
- npm 或 yarn
- Expo CLI: `npm install -g expo-cli`

#### 安装步骤

```bash
# 1. 进入项目
cd C:\Users\Wang\Desktop\MyLifeOS-Mobile

# 2. 安装依赖
npm install

# 3. 启动 Expo 开发服务
npm start

# 4. 用 Expo Go 扫码测试
# 下载 Expo Go 应用并扫描二维码
```

### 方式 2：生成 APK (推荐用于发布)

#### 前置要求
- EAS CLI: `npm install -g eas-cli`
- Expo 账户: https://expo.dev
- GitHub 账户 (可选)

#### 构建步骤

##### 第一步: 配置 Expo 账户

```bash
eas login
# 输入你的 Expo 用户名和密码
```

##### 第二步: 初始化 EAS

```bash
eas build:configure
# 选择 Android 平台
```

##### 第三步: 构建 APK

```bash
# 预发布版本 (APK 格式，便于测试)
npm run build-android

# 或者直接使用 EAS
eas build --platform android --local
```

##### 第四步: 下载 APK

构建完成后，你会收到一个链接来下载 APK。

---

## 📋 详细配置说明

### app.json 配置

主要配置项:

```json
{
  "expo": {
    "name": "MY_LIFE_OS",
    "slug": "my-life-os",
    "version": "1.0.0",
    
    // Android 特定配置
    "android": {
      "package": "com.mylifeos.app",
      "versionCode": 1,
      "permissions": [
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    
    // 应用图标和启动屏幕
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "backgroundColor": "#080b10"
    }
  }
}
```

### eas.json 配置

APK 构建配置:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"  // APK 格式（推荐测试）
      }
    },
    "production": {
      "android": {
        "buildType": "aab"  // AAB 格式（用于 Google Play）
      }
    }
  }
}
```

---

## 🎨 自定义应用外观

### 1. 添加应用图标

替换 `assets/icon.png`:
- 大小: 1024x1024 px
- 格式: PNG (推荐透明背景)
- 路径: `./assets/icon.png`

### 2. 添加启动屏幕

替换 `assets/splash.png`:
- 大小: 1080x1920 px
- 格式: PNG
- 路径: `./assets/splash.png`

### 3. 添加自适应图标

添加 `assets/adaptive-icon.png`:
- 大小: 108x108 dp (1080x1080 px)
- 配置: `app.json` 中的 `android.adaptiveIcon`

---

## 📦 构建输出

### APK 文件

```
my-life-os-v1.0.0.apk  (~30-50 MB)
- 包含所有资源
- 可直接安装到 Android 设备
- 支持 Android 5.0+
```

### AAB 文件

```
my-life-os-v1.0.0.aab
- Google Play 专用格式
- 更小的下载体积
- 自动适配不同设备
```

---

## 🔧 环境变量配置

创建 `.env` 文件 (可选):

```env
EXPO_PUBLIC_API_KEY=sk-ant-...
EXPO_PUBLIC_API_ENDPOINT=https://api.anthropic.com/v1
```

或在构建时通过 `eas.json` 配置:

```json
{
  "build": {
    "production": {
      "android": {
        "env": {
          "EXPO_PUBLIC_API_KEY": "sk-ant-..."
        }
      }
    }
  }
}
```

---

## 📲 安装 APK 到设备

### 方式 1: 通过 ADB (Android Debug Bridge)

```bash
# 前置要求: 连接 Android 设备或模拟器

# 安装 APK
adb install my-life-os-v1.0.0.apk

# 运行应用
adb shell am start -n com.mylifeos.app/.MainActivity

# 查看日志
adb logcat
```

### 方式 2: 直接安装

1. 将 APK 文件传到 Android 设备
2. 打开文件管理器，点击 APK 文件
3. 允许安装来自未知来源的应用
4. 点击"安装"

### 方式 3: 通过浏览器

1. 上传 APK 到服务器
2. 在 Android 设备上访问下载链接
3. 浏览器会自动下载并提示安装

---

## 🐛 常见问题

### Q1: 构建失败 "Java SDK not found"

**解决**:
```bash
# 安装 Java Development Kit (JDK)
# 从 https://www.oracle.com/java/technologies/downloads/ 下载

# 设置 JAVA_HOME
set JAVA_HOME=C:\Program Files\Java\jdk-17
```

### Q2: 构建失败 "Android SDK not found"

**解决**:
```bash
# 方式 1: 安装 Android Studio
# 从 https://developer.android.com/studio 下载

# 方式 2: 使用 EAS 云构建 (推荐)
npm run build-android --no-local
```

### Q3: APK 太大 (> 100 MB)

**优化**:
```json
{
  "android": {
    "buildType": "aab",    // 使用 AAB 格式
    "gradle": {
      "enableProguard": true  // 启用代码混淆
    }
  }
}
```

### Q4: 应用在设备上闪退

**调试**:
```bash
# 查看日志
adb logcat | grep MY_LIFE_OS

# 重新安装
adb uninstall com.mylifeos.app
adb install my-life-os-v1.0.0.apk
```

### Q5: 无法访问文件系统

**解决**:
```bash
# 请求必要的权限 (已在 app.json 中配置)
# READ_EXTERNAL_STORAGE
# WRITE_EXTERNAL_STORAGE

# 在 Android 6.0+ 上需要运行时权限请求
# 使用 expo-permissions 库
```

---

## 🔐 安全性和签名

### APK 签名 (发布前必需)

#### 生成签名密钥

```bash
# 一次性生成
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

#### 配置 eas.json

```json
{
  "build": {
    "production": {
      "android": {
        "keystore": "my-release-key.jks",
        "keystorePassword": "password",
        "keyAlias": "my-key-alias",
        "keyPassword": "password"
      }
    }
  }
}
```

### 代码混淆

启用 ProGuard 保护代码:

```json
{
  "android": {
    "gradle": {
      "enableProguard": true
    }
  }
}
```

---

## 📊 性能优化

### 1. 减小包大小

```bash
# 移除不必要的依赖
npm prune --production

# 使用 tree-shaking
npm install --save-dev @react-native-community/eslint-config
```

### 2. 启用资源压缩

```json
{
  "android": {
    "gradle": {
      "minSdkVersion": 21,  // 支持 Android 5.0+
      "shrinkResources": true
    }
  }
}
```

### 3. 使用 Hermes 引擎

```json
{
  "android": {
    "enableHermes": true  // 更快的 JS 引擎
  }
}
```

---

## 🚀 发布到 Google Play

### 前置要求

- Google Play 开发者账户 ($25 一次性费用)
- 签名的 APK 或 AAB
- 应用描述和截图

### 发布步骤

#### 1. 准备发布包

```bash
# 生成 AAB (Google Play 推荐)
eas build --platform android --local
# 选择 production 配置
```

#### 2. 在 Google Play Console 中创建应用

1. 访问 https://play.google.com/console
2. 点击"创建应用"
3. 填写应用名称和详细信息

#### 3. 上传 AAB 文件

1. 进入"版本发布" > "生产"
2. 点击"创建版本"
3. 上传 AAB 文件

#### 4. 添加应用详情

- 应用描述
- 截图 (最多 8 张)
- 特色图片
- 隐私政策

#### 5. 审核和发布

- Google Play 审核通常需要 2-4 小时
- 通过审核后点击"发布"

---

## 📝 构建脚本参考

### package.json 脚本

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "build-android": "eas build --platform android",
    "build-all": "eas build --platform all",
    "submit": "eas submit --platform android",
    "prebuild": "expo prebuild --clean"
  }
}
```

### 常用命令

```bash
# 开发
npm start
npm run android          # 在模拟器/设备上运行

# 构建
npm run build-android    # 构建 APK
eas build --platform android --local  # 本地构建

# 提交
npm run submit           # 提交到 Google Play

# 清理
npm run prebuild         # 清除构建缓存
```

---

## 🔗 相关资源

- **Expo 文档**: https://docs.expo.dev
- **React Native 文档**: https://reactnative.dev
- **EAS Build**: https://docs.expo.dev/build/
- **Google Play Console**: https://play.google.com/console
- **Android 官方指南**: https://developer.android.com/

---

## ✅ 检查清单

在构建前检查:

- [ ] 更新 `app.json` 中的版本号
- [ ] 替换应用图标 (`assets/icon.png`)
- [ ] 替换启动屏幕 (`assets/splash.png`)
- [ ] 配置 API Key (`.env` 或 `eas.json`)
- [ ] 测试所有功能
- [ ] 检查日志中是否有警告
- [ ] 验证权限设置 (`android.permissions`)
- [ ] 生成签名密钥 (发布版本)

---

## 📞 支持

遇到问题?

1. 查看 Expo 官方文档: https://docs.expo.dev
2. 查看 React Native 文档: https://reactnative.dev
3. 提交 Issue 到 GitHub
4. 在 Expo 论坛寻求帮助

---

**祝你成功构建 MY_LIFE_OS APK!** 🎉

