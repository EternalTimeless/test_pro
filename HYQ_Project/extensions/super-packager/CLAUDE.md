# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个Cocos Creator扩展项目，名为"super-packager"（究极无敌打包工具2.2），用于自动化打包试玩广告到多个广告平台。该扩展提供可视化界面，支持18个广告平台的文件处理，并自动生成三种版本：常规版、强制跳转版(TCE)、KR版本(仅SSD游戏)。

## 开发命令

```bash
# 安装依赖
npm install

# 开发模式（构建+监听）
npm run dev

# 生产构建
npm run build
```

**重要提示**:
- 开发和构建都使用 `vite build`，通过 `--mode development` 区分环境
- 不使用 `vite dev`，因为需要实际构建 JS 文件供 Cocos Creator 编辑器读取
- 开发模式会启用 watch 模式和 sourcemap（Windows 下使用 inline sourcemap）

## 核心架构

### 构建系统 (vite.config.ts)

- **多入口构建**: browser, panel, builder, hook
- **技术栈**: Vue 3 + TypeScript + Element Plus
- **关键插件**:
  - `@cocos-fe/vite-plugin-cocos-panel`: Cocos Creator 面板开发
  - `rollup-plugin-node-externals`: 排除 node 内置模块，将依赖打入 dist
  - `unplugin-auto-import` 和 `unplugin-vue-components`: 自动导入 Element Plus 组件

### 打包引擎 (src/core/packer.ts)

**核心类**: `Packer`
**核心流程**:
1. 创建三个版本目录（常规版、强制跳转版、KR版）
2. 遍历选中的平台，查找符合 `projectname_platform` 格式的文件
3. 应用平台特殊处理逻辑
4. 复制文件并注入变量（HTML/ZIP）
5. 根据可配置的命名规则重命名文件

**支持的平台** (PlatformEnum):
- AppLovin, Bigo, Common, Common Min, Facebook, Google
- IronSource, IronSource2025, Kwai, Liftoff, Mintegral
- Moloco, Nefta, Pangle, TikTok, Unity, Vungle, Snapchat

**平台特殊处理**:
- **MOLOCO** (TH/TW/LW游戏):
  - 在HTML文件中注入 `configs/moloco_head.html` 和 `configs/moloco_body.html`
  - 自动插入到 `</head>` 和 `</body>` 标签前

- **TIKTOK**:
  - 解压ZIP，替换 `config.json` (来自 `configs/configTT.json`)
  - 修复SDK接入问题（`fixTikTokSDK` 方法）：
    - 移除错误的嵌套script标签
    - 在 `<body>` 后立即插入正确的SDK引用

- **SNAPCHAT**:
  - 处理竖版文件 `_snapchat_portrait.zip`
  - 替换 `config.json` (来自 `configs/configSnapchat.json`)

- **FACEBOOK**:
  - 只处理ZIP文件，忽略其他格式

**HTML变量注入**:
- `window.isTCE`: 强制跳转版为 true，常规版为 false
- `window.materialName`: 格式为 `{adName}` / `{adName}TCE` / `{adName}^概率公示`
- `window.isKR`: KR版本为 true（可选）

### 命名规则系统 (src/utils/utils.ts)

**核心类**: `NamingRuleManager`

**配置结构**:
```typescript
interface NamingRuleConfig {
  name: string;              // 规则名称
  normalTemplate: string;    // 普通版模板
  tceTemplate: string;       // TCE版模板
  separator: string;         // 分隔符
  configItems: NamingConfigItem[];  // 配置项
}
```

**命名模板语法**:
- 使用 `{key}` 占位符，如 `{gameAbbr}`, `{packageDate}`, `{adName}`
- 使用 `{separator}` 作为分隔符占位符
- 示例: `{gameAbbr}{separator}{packageDate}{separator}{adName}{separator}{plannerAbbr}{separator}{companyPrefix}{separator}{platformName}{separator}ALL`

**默认配置项**:
- `gameAbbr`: 游戏名称缩写（必填）
- `packageDate`: 打包日期 YYYYMMDD（必填）
- `adName`: 试玩广告名称（必填）
- `plannerAbbr`: 策划名字缩写（必填）
- `companyPrefix`: 公司前缀（可选，默认RBN）
- `platformName`: 平台名称（自动生成）

**配置管理**:
- 配置保存在 Cocos Creator 的 Profile 系统中
- 支持从 `configs/defaultNamingRules.json` 加载默认规则
- 支持导入/导出命名规则配置
- 可创建多个命名规则并切换

### UI界面 (src/panels/App.vue)

**核心功能**:
- 动态表单：根据当前命名规则的 `configItems` 生成输入字段
- 平台多选：支持17个广告平台的多选
- 实时预览：监听表单变化，实时显示生成的文件名预览
- 商店链接管理：Google Play 和 App Store 链接的同步
- 命名规则配置：通过对话框配置命名规则

**状态管理**:
- 使用 Vue 3 Composition API
- 表单数据保存到 `Editor.Profile.getConfig('super-packager', 'config')`
- 命名规则配置由 `NamingRuleManager` 管理

**关键交互**:
1. 加载配置 → 加载商店链接 → 加载命名规则
2. 表单变化 → 更新预览
3. 打包按钮 → 验证表单 → 保存配置 → 执行打包 → 打开文件夹

### 构建钩子系统 (src/core/builder.ts, src/core/hook.ts)

**builder.ts**: 定义构建面板的自定义选项
- 在 Cocos Creator 构建面板中添加 `googlePlayUrl` 和 `appStoreUrl` 输入框
- 仅作用于 `web-mobile` 平台

**hook.ts**: 构建生命周期钩子
- `onBeforeBuild`: 构建前从构建选项读取商店链接，同步到代码文件
- 通过 `Editor.Message.request` 调用 browser 进程的 `set-store-urls` 方法

### 配置文件路径处理

**getConfigPath 方法** (packer.ts:36-51):
- 开发环境: `__dirname` 指向 `src/core`，回退两级到根目录
- 打包环境: `__dirname` 指向 `dist`，回退一级到根目录
- 用于访问 `configs/` 目录下的配置文件

## 文件结构

```
src/
├── browser/          # 浏览器端入口
├── core/
│   ├── packer.ts    # 核心打包引擎
│   ├── builder.ts   # 构建器钩子
│   └── hook.ts      # 编辑器钩子
├── panels/
│   ├── App.vue      # 主应用界面
│   ├── panel.ts     # 面板入口
│   └── components/
│       └── NamingRuleConfig.vue  # 命名规则配置组件
├── utils/
│   └── utils.ts     # 工具类和命名规则管理
└── types/           # TypeScript 类型定义

configs/              # 配置文件目录
├── moloco_head.html        # Moloco平台注入到head的HTML脚本片段
├── moloco_body.html        # Moloco平台注入到body的HTML脚本片段
├── configTT.json           # TikTok平台的config.json替换内容
├── configSnapchat.json     # Snapchat平台的config.json替换内容
├── defaultNamingRules.json # 默认命名规则配置（支持5种预设规则）
└── README.md               # 命名规则配置详细说明

package_assets/       # 扩展资源目录（通过asset-db挂载）
dist/                 # 构建输出目录
```

## 重要约定

### 文件命名规则
- 源文件必须符合 `projectname_platform` 格式才会被处理
- Snapchat 竖版文件使用 `_snapchat_portrait` 后缀

### KR版本处理
- 仅 SSD 游戏生成 KR 版本
- KR 版本文件名添加 `^概率公示` 标识
- `window.materialName` 为 `{adName}^概率公示`

### 配置文件获取
- 使用 `getConfigPath()` 方法获取配置文件路径
- 配置文件必须放在 `configs/` 目录下
- 开发和生产环境都能正确解析

## 调试技巧

1. **查看控制台日志**: 打包过程中会输出详细日志
2. **检查文件路径**: 注意 `project://` 协议的路径转换
3. **验证配置文件**: 确保 `configs/` 目录下的配置文件存在且格式正确
4. **源文件命名**: 确认源文件符合 `projectname_platform` 格式

## 扩展开发

### 添加新平台
1. 在 `PlatformEnum` 中添加平台枚举
2. 在 `App.vue` 的 `platformOptions` 中添加选项
3. 如需特殊处理，在 `processPlatformSpecificLogic` 中添加逻辑
4. 创建对应的配置文件（如需要）

### 添加新的命名配置项
1. 在 `defaultNamingRules.json` 中添加配置项
2. 更新命名模板以包含新的占位符
3. 在 `App.vue` 的 `getMaxLength` 方法中添加长度限制（如需要）

### 自定义平台处理逻辑
参考现有的平台处理方法：
- `processMolocoFiles`: HTML脚本注入
- `processTiktokFiles`: ZIP解压、配置替换、SDK修复
- `processSnapchatFiles`: ZIP配置替换

### 在 Cocos Creator 中使用

1. **打开扩展**: 菜单 → 工具 → 究极无敌打包工具2.2
2. **构建选项**: 在 Cocos Creator 构建面板中配置商店链接（自动同步到代码）
