# esbuild-ts-node-template

[![Node.js CI](https://github.com/pqcqaq/esbuild-ts-node-template/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/esbuild-ts-node-template/actions)
[![npm version](https://img.shields.io/npm/v/esbuild-ts-node-template.svg)](https://www.npmjs.com/package/esbuild-ts-node-template)
[![License](https://img.shields.io/github/license/pqcqaq/esbuild-ts-node-template.svg)](/LICENSE)

一个基于 **TypeScript** + **esbuild** 的 Node.js 项目模板，支持：

- **热重载** 开发 (nodemon + ts-node)
- **多文件打包**（保留模块结构，bundle: false）
- **类型声明** 输出 (.d.ts)
- **ESLint**、**Prettier** 代码规范
- **Vitest** 单元测试
- **Docker** 多阶段构建

---

## 目录结构

\`\`\`
esbuild-ts-node-template/
├── src/
│ ├── index.ts
│ └── utils/
│ └── helper.ts
├── tests/
│ └── helper.test.ts
├── dist/ # 构建产物
│ ├── index.js
│ └── types/ # d.ts 声明
├── .eslintrc.cjs
├── .gitignore
├── .prettierrc
├── Dockerfile
├── esbuild.config.mjs
├── package.json
├── tsconfig.json
└── README.md
\`\`\`

---

## 快速开始

### 1. 克隆仓库

\`\`\`bash
git clone https://github.com/your-username/esbuild-ts-node-template.git
cd esbuild-ts-node-template
\`\`\`

### 2. 安装依赖

\`\`\`bash
npm install
\`\`\`

### 3. 本地开发

\`\`\`bash
npm run dev
\`\`\`

- 运行 nodemon 监视 src/ 下的 .ts 文件，自动重启并通过 ts-node 执行。

### 4. 构建项目

\`\`\`bash
npm run build
\`\`\`

- 先生成类型声明：npm run build:types
- 再使用 esbuild 多文件构建：node esbuild.config.mjs
- 输出到 dist/，保留目录结构并生成 sourcemap。

### 5. 运行构建产物

\`\`\`bash
node dist/index.js
\`\`\`

### 6. 运行测试

\`\`\`bash
npm test
\`\`\`

- 使用 Vitest 运行 tests/ 下的测试，并生成测试覆盖率报告。

### 7. 代码质量 & 格式化

\`\`\`bash
npm run lint # ESLint 检查
npm run format # Prettier 格式化
\`\`\`

---

## Docker

使用以下命令构建并运行 Docker 镜像：

\`\`\`bash
docker build -t esbuild-ts-node-template .
docker run --rm esbuild-ts-node-template
\`\`\`

Dockerfile 为多阶段构建，仅将 dist/ 和生产依赖打包进最终镜像。

---

## 贡献

1. Fork 本仓库
2. 新建 Feature 分支：git checkout -b feature/fooBar
3. 提交你的修改：git commit -am 'Add some fooBar'
4. 推送到远程：git push origin feature/fooBar
5. 提交 Pull Request

---

## License

MIT © [Your Name](https://github.com/your-username)
