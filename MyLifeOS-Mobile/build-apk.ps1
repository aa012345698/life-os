# MY_LIFE_OS 移动版 - 自动化 APK 构建脚本
# 用法: .\build-apk.ps1

$ErrorActionPreference = "Stop"

Write-Host "╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║       MY_LIFE_OS - React Native APK 自动化构建                    ║" -ForegroundColor Cyan
Write-Host "║                  一键生成 Android 应用                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# 检查依赖
Write-Host "[1/5] 检查依赖..." -ForegroundColor Yellow
$tools = @("node", "npm", "eas")

foreach ($tool in $tools) {
    $exists = Get-Command $tool -ErrorAction SilentlyContinue
    if ($null -eq $exists) {
        if ($tool -eq "eas") {
            Write-Host "  ⚠ $tool 未安装，正在安装全局..." -ForegroundColor Yellow
            npm install -g eas-cli
        } else {
            Write-Host "  ✗ $tool 未找到！请先安装。" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "  ✓ $tool 已安装" -ForegroundColor Green
    }
}

# 检查项目结构
Write-Host ""
Write-Host "[2/5] 检查项目结构..." -ForegroundColor Yellow
$requiredFiles = @("package.json", "app.json", "eas.json", "app\_layout.tsx")

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file 存在" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file 缺失！" -ForegroundColor Red
        exit 1
    }
}

# 安装依赖
Write-Host ""
Write-Host "[3/5] 安装 npm 依赖..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "  ✓ node_modules 已存在，跳过安装" -ForegroundColor Green
} else {
    Write-Host "  正在运行 npm install..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  ✗ npm install 失败！" -ForegroundColor Red
        exit 1
    }
    Write-Host "  ✓ 依赖安装完成" -ForegroundColor Green
}

# 登录 Expo
Write-Host ""
Write-Host "[4/5] Expo 账户检查..." -ForegroundColor Yellow
$expoStatus = eas whoami 2>&1
if ($expoStatus -match "Not logged in") {
    Write-Host "  未登录 Expo" -ForegroundColor Yellow
    Write-Host "  正在执行登录..." -ForegroundColor Yellow
    eas login
} else {
    Write-Host "  ✓ 已登录到 Expo" -ForegroundColor Green
}

# 构建 APK
Write-Host ""
Write-Host "[5/5] 开始构建 APK..." -ForegroundColor Yellow
Write-Host "  这可能需要 5-15 分钟，请耐心等待..." -ForegroundColor Cyan
Write-Host ""

eas build --platform android --profile preview

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "✗ 构建失败！" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                    ✓ 构建完成！                                   ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "APK 文件已生成！" -ForegroundColor Green
Write-Host ""
Write-Host "下一步:" -ForegroundColor Cyan
Write-Host "  1. 在 Expo 网站查看构建结果: https://expo.dev/builds" -ForegroundColor Cyan
Write-Host "  2. 下载生成的 APK 文件" -ForegroundColor Cyan
Write-Host "  3. 在 Android 设备上安装: adb install <apk-file>" -ForegroundColor Cyan
Write-Host ""
