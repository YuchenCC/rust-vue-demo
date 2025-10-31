# Vue Element Admin - Rsbuild 工程化改造

基于 Vue 2.6 的 admin-template 项目，从 Vue CLI 4.x 迁移到 Rsbuild 的工程化改造实践。

## 📋 项目概述

本项目是基于 [vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)（Vue 2.6）的管理后台模板，进行了构建工具的现代化改造。将原有的 Vue CLI 4.x 构建系统迁移到 [Rsbuild](https://rsbuild.dev/)，以获得更好的构建性能和开发体验。

## 🎯 改造目标

- ✅ 从 Vue CLI 4.x 迁移到 Rsbuild
- ✅ 保持与原有配置的功能对等
- ✅ 提升构建速度和开发体验
- ✅ 支持 Vue 2.7 和相关生态
- ✅ 保持向后兼容，同时支持两种构建方式

## ⚠️ 迁移前首要步骤

在进行 Rsbuild 迁移之前，**必须先升级 Vue 至 2.7 版本**。这是迁移成功的先决条件。

### 1. 升级 Vue 和相关依赖

在 `package.json` 中更新以下依赖：

```json
{
  "dependencies": {
    "vue": "^2.7.14"
  },
  "devDependencies": {
    "vue-template-compiler": "^2.7.14"
  }
}
```

### 2. 安装依赖

```bash
npm install
```

### 3. 验证升级

确认 Vue 版本已成功升级：

```bash
npm list vue vue-template-compiler
```

应该看到类似输出：
```
vue@2.7.14
vue-template-compiler@2.7.14
```

### 4. 测试原有构建方式

确保升级后，原有的 Vue CLI 构建方式仍能正常工作：

```bash
npm run dev
```

### 5. 检查兼容性

- ✅ 确认项目可以正常启动
- ✅ 确认页面功能正常
- ✅ 确认没有 Vue 2.7 相关的破坏性变更影响

**重要提示**: 只有在 Vue 2.7 升级完成并验证无误后，才能进行后续的 Rsbuild 迁移工作。

## 🏗️ 项目结构

```
vue-element-admin/
├── rsbuild/                    # Rsbuild 构建配置
│   ├── rsbuild.config.js      # Rsbuild 主配置文件
│   ├── package.json           # Rsbuild 启动脚本
│   └── README.md              # Rsbuild 使用说明
├── src/                       # 源代码目录
├── public/                    # 静态资源目录
├── vue.config.js              # Vue CLI 配置（保留）
└── package.json               # 项目依赖和脚本
```

## 🚀 快速开始

### 前置要求

- **Node.js**: >= 18.0.0
- **npm**: >= 9.0.0（或使用 yarn/pnpm）

### 安装依赖

```bash
cd vue-element-admin
npm install
```

### 使用 Rsbuild 启动项目

#### 在 rsbuild 文件夹下运行

```bash
cd rsbuild
npm run dev    # 开发模式
npm run build  # 生产构建
```

### 使用 Vue CLI（原有方式，仍支持）

```bash
npm run dev          # 开发模式
npm run build:prod   # 生产构建
```

## 🔧 技术栈对比

### 原技术栈（Vue CLI 4.x）

- **构建工具**: Webpack 4
- **配置方式**: `vue.config.js`
- **插件生态**: Vue CLI 插件体系

### 新技术栈（Rsbuild）

- **构建工具**: Rspack（基于 Rust 的打包器）
- **配置方式**: `rsbuild/rsbuild.config.js`
- **插件生态**: Rsbuild 插件体系

## 📦 主要依赖

### Rsbuild 核心依赖

```json
{
  "@rsbuild/core": "^1.5.17",
  "@rsbuild/plugin-vue2": "^1.0.4",
  "@rsbuild/plugin-vue2-jsx": "^1.0.4",
  "@rsbuild/plugin-babel": "^1.0.6",
  "@rsbuild/plugin-sass": "^1.4.0",
  "@rsbuild/plugin-node-polyfill": "^1.4.2"
}
```

## 🔄 配置迁移对照

### Vue CLI 配置 → Rsbuild 配置

| Vue CLI 配置项 | Rsbuild 对应配置 | 说明 |
|--------------|----------------|------|
| `publicPath` | `output.assetPrefix` | 公共资源路径 |
| `outputDir` | `output.distPath.root` | 输出目录 |
| `assetsDir` | `output.distPath.js/css/media` | 静态资源目录 |
| `devServer.port` | `server.port` | 开发服务器端口 |
| `devServer.proxy` | `server.proxy` | 代理配置 |
| `configureWebpack.resolve.alias` | `resolve.alias` | 路径别名 |
| `chainWebpack` | `tools.bundlerChain` | Webpack Chain 配置 |
| `css.loaderOptions.sass` | `pluginSass.sassOptions` | Sass 选项 |

## ✨ 改造亮点

### 1. 性能提升

- **构建速度**: 基于 Rspack（Rust 实现），构建速度显著提升
- **HMR 性能**: 热模块替换响应更快
- **打包体积**: 优化的代码分割策略

### 2. 功能对等

- ✅ Vue 2.7 支持
- ✅ JSX 支持（通过 `@rsbuild/plugin-vue2-jsx`）
- ✅ Sass/SCSS 支持
- ✅ SVG Sprite 支持
- ✅ 代码分割和优化
- ✅ 环境变量支持（`VUE_APP_*`、`PUBLIC_*`）

## 📝 配置说明

### Rsbuild 配置文件位置

配置文件位于 `vue-element-admin/rsbuild/rsbuild.config.js`

### 主要配置项

#### 1. 插件配置

```javascript
plugins: [
  pluginVue2(),           // Vue 2 支持
  pluginSass(),           // Sass/SCSS 支持
  pluginVue2Jsx(),       // JSX 支持
  pluginBabel(),         // Babel 转换
  pluginNodePolyfill()    // Node.js Polyfill
]
```

#### 2. 路径别名

```javascript
resolve: {
  alias: {
    '@': resolve('src')  // @ 指向 src 目录
  }
}
```

#### 3. 开发服务器

```javascript
server: {
  port: 9527,
  open: true,
  proxy: {
    '/dev-api': {
      target: 'http://localhost:9528',
      changeOrigin: true
    }
  }
}
```

#### 4. 构建输出

```javascript
output: {
  assetPrefix: '/',
  distPath: {
    root: 'dist',
    js: 'static/js',
    css: 'static/css',
    media: 'static/media'
  },
  filenameHash: true
}
```

## 📚 相关文档

- [Rsbuild 官方文档](https://rsbuild.dev/)
- [Rspack 官方文档](https://rspack.dev/)
- [vue-element-admin 原项目](https://github.com/PanJiaChen/vue-element-admin)

## 📄 许可证

MIT License

---

**注意**: 本项目同时保留了 Vue CLI 4.x 和 Rsbuild 两种构建方式，可以根据需求选择使用。
