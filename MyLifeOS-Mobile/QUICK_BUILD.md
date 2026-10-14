# 🚀 MY_LIFE_OS - 最快的 APK 构建方案

我已经为你创建了 **3 种自动化构建方案**，从最简单到最强大：

---

## 方案 1️⃣：一键脚本（最简单）⭐ 推荐

### Windows (PowerShell)

```powershell
# 进入项目目录
cd C:\Users\Wang\Desktop\MyLifeOS-Mobile

# 运行构建脚本
.\build-apk.ps1
```

### macOS / Linux (Bash)

```bash
cd ~/Desktop/MyLifeOS-Mobile
bash build-apk.sh
```

**这个脚本会自动：**
✅ 检查所有依赖
✅ 安装 npm 包
✅ 登录 Expo
✅ 启动云端构建
✅ 告诉你在哪里下载 APK

**所需时间**：5-15 分钟

---

## 方案 2️⃣：手动命令（如果脚本失败）

```bash
# 1. 进入项目
cd C:\Users\Wang\Desktop\MyLifeOS-Mobile

# 2. 安装依赖
npm install

# 3. 登录 Expo (首次需要)
eas login
# 输入用户名、密码
# 没账户? 去 https://expo.dev 注册(免费)

# 4. 构建 APK
eas build --platform android --profile preview

# 完成！查看链接下载 APK
```

**耗时**：5-15 分钟

---

## 方案 3️⃣：GitHub Actions（真正的"后台"）🔧

如果你有 GitHub 账户，这是最优方案：

### 第一步：上传到 GitHub

```bash
cd C:\Users\Wang\Desktop\MyLifeOS-Mobile

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/my-life-os-mobile.git
git push -u origin main
```

### 第二步：配置密钥

1. 访问你的仓库
2. 进入 **Settings → Secrets and variables → Actions**
3. 添加 2 个密钥：
   - `EXPO_USERNAME`: 你的 Expo 用户名
   - `EXPO_PASSWORD`: 你的 Expo 密码

### 第三步：触发构建

```bash
# 推送代码到 main 分支会自动触发
git push origin main

# 或者在 GitHub Actions 标签页手动触发
```

**完全自动**，不需要本地操作。APK 自动发布到 Releases。

---

## 📋 我已经修复的问题

### ✅ 代码修复

1. **缺失的加载屏幕** → 已创建 `app/loading.tsx`
2. **不稳定的 Splash 处理** → 增加延迟和错误处理
3. **初始化缺少记录** → 自动为每个模块创建初始记录
4. **错误处理不完善** → 增加错误恢复机制

### ✅ 已创建的文件

```
MyLifeOS-Mobile/
├── app/loading.tsx              ✨ 新增 - 加载屏幕
├── build-apk.ps1               ✨ 新增 - Windows 自动构建脚本
├── build-apk.sh                ✨ 新增 - Linux/macOS 构建脚本
├── .github/
│   └── workflows/
│       └── build-apk.yml       ✨ 新增 - GitHub Actions 工作流
├── app/_layout.tsx             ✏️ 修复 - 增强错误处理
└── store/appStore.ts           ✏️ 修复 - 初始化改进
```

---

## 🎯 现在就开始

### 最快方式（推荐）

#### Windows:
```powershell
cd C:\Users\Wang\Desktop\MyLifeOS-Mobile
.\build-apk.ps1
```

#### macOS/Linux:
```bash
cd ~/Desktop/MyLifeOS-Mobile
bash build-apk.sh
```

### 然后...

1. 脚本会自动打开浏览器
2. 登录你的 Expo 账户
3. 等待 5-15 分钟构建完成
4. 获得下载链接
5. 下载 APK 文件
6. 在手机上安装！

---

## 🔍 构建完成后

### 下载 APK

1. 构建完成后，你会看到链接
2. 访问 https://expo.dev/builds
3. 找到最新构建
4. 点击下载 APK

### 安装到手机

**方式 1：直接安装**
- 将 APK 发送到手机
- 打开，点击安装

**方式 2：USB 连接**
```bash
adb install my-life-os-v1.0.0.apk
```

**方式 3：分享链接**
- 上传 APK 到云盘（Google Drive/Dropbox）
- 分享下载链接给朋友

---

## 🐛 故障排查

### "找不到 node" 或 "npm 未找到"

安装 Node.js: https://nodejs.org (LTS 版本)

### "eas 命令未找到"

```bash
npm install -g eas-cli
```

### "Expo 登录失败"

1. 确保用户名/密码正确
2. 或者访问 https://expo.dev 检查账户

### 脚本权限错误 (Windows)

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 脚本权限错误 (macOS/Linux)

```bash
chmod +x build-apk.sh
```

---

## 📊 进度跟踪

### 脚本运行步骤

```
[1/5] 检查依赖        ← 验证工具安装
      ↓
[2/5] 检查项目结构    ← 验证文件存在
      ↓
[3/5] 安装 npm 依赖   ← npm install
      ↓
[4/5] Expo 账户检查   ← eas login
      ↓
[5/5] 开始构建 APK    ← eas build (最长)
      ↓
✓ 构建完成！
  获得下载链接 → 下载 APK
```

---

## 💡 建议

### 第一次构建

1. 使用脚本方案
2. 让脚本做所有工作
3. 15 分钟内得到 APK

### 后续构建

- 如果经常构建 → 使用 GitHub Actions
- 只需 `git push` 就自动构建
- APK 自动发布到 Releases

### 遇到问题

1. 检查 Expo 账户是否有效
2. 查看脚本输出的错误信息
3. 访问 https://expo.dev/builds 查看构建日志

---

## 🎉 就这么简单！

```bash
# 一行命令启动构建
.\build-apk.ps1

# 或者

bash build-apk.sh
```

**15 分钟后，你就有一个可安装的 APK！** 🚀

---

## 📞 需要帮助？

- **Expo 文档**: https://docs.expo.dev
- **EAS Build**: https://docs.expo.dev/build/
- **React Native**: https://reactnative.dev

