# Rsbuild 配置

此文件夹包含 vue-element-admin 项目的 Rsbuild 配置文件。

## 使用方法

### 前置要求

确保已安装所有必要的依赖：

```bash
npm install
```

### 启动开发服务器

在 `rsbuild` 文件夹下运行：

```bash
npm run dev
```

或者在项目根目录运行：

```bash
cd rsbuild && npm run dev
```

### 构建生产版本

在 `rsbuild` 文件夹下运行：

```bash
npm run build
```

或者在项目根目录运行：

```bash
cd rsbuild && npm run build
```

## 配置说明

- `rsbuild.config.js`: Rsbuild 配置文件，包含所有构建选项
- `package.json`: 包含启动脚本

所有路径都是相对于项目根目录（vue-element-admin）的。依赖项使用项目根目录 `package.json` 中定义的依赖。

