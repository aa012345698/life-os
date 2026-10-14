#!/bin/bash

# MY_LIFE_OS 移动版 - 自动化 APK 构建脚本 (Linux/macOS)
# 用法: bash build-apk.sh

set -e

echo ""
echo "╔════════════════════════════════════════════════════════════════════╗"
echo "║       MY_LIFE_OS - React Native APK 自动化构建                    ║"
echo "║                  一键生成 Android 应用                            ║"
echo "╚════════════════════════════════════════════════════════════════════╝"
echo ""

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 检查依赖
echo -e "${YELLOW}[1/5] 检查依赖...${NC}"

for tool in node npm eas; do
    if command -v $tool &> /dev/null; then
        echo -e "${GREEN}  ✓ $tool 已安装${NC}"
    else
        if [ "$tool" == "eas" ]; then
            echo -e "${YELLOW}  ⚠ $tool 未安装，正在安装全局...${NC}"
            npm install -g eas-cli
        else
            echo -e "${RED}  ✗ $tool 未找到！请先安装。${NC}"
            exit 1
        fi
    fi
done

# 检查项目结构
echo ""
echo -e "${YELLOW}[2/5] 检查项目结构...${NC}"

for file in package.json app.json eas.json app/_layout.tsx; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}  ✓ $file 存在${NC}"
    else
        echo -e "${RED}  ✗ $file 缺失！${NC}"
        exit 1
    fi
done

# 安装依赖
echo ""
echo -e "${YELLOW}[3/5] 安装 npm 依赖...${NC}"

if [ -d "node_modules" ]; then
    echo -e "${GREEN}  ✓ node_modules 已存在，跳过安装${NC}"
else
    echo -e "${YELLOW}  正在运行 npm install...${NC}"
    npm install
    echo -e "${GREEN}  ✓ 依赖安装完成${NC}"
fi

# 登录 Expo
echo ""
echo -e "${YELLOW}[4/5] Expo 账户检查...${NC}"

if eas whoami > /dev/null 2>&1; then
    echo -e "${GREEN}  ✓ 已登录到 Expo${NC}"
else
    echo -e "${YELLOW}  未登录 Expo${NC}"
    echo -e "${YELLOW}  正在执行登录...${NC}"
    eas login
fi

# 构建 APK
echo ""
echo -e "${YELLOW}[5/5] 开始构建 APK...${NC}"
echo -e "${CYAN}  这可能需要 5-15 分钟，请耐心等待...${NC}"
echo ""

eas build --platform android --profile preview

if [ $? -ne 0 ]; then
    echo ""
    echo -e "${RED}✗ 构建失败！${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║                    ✓ 构建完成！                                   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}APK 文件已生成！${NC}"
echo ""
echo -e "${CYAN}下一步:${NC}"
echo -e "${CYAN}  1. 在 Expo 网站查看构建结果: https://expo.dev/builds${NC}"
echo -e "${CYAN}  2. 下载生成的 APK 文件${NC}"
echo -e "${CYAN}  3. 在 Android 设备上安装: adb install <apk-file>${NC}"
echo ""
