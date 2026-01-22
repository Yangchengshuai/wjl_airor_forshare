# AI项目ROI 评估助手

<div align="center">
  <h3>帮助企业评估 AI 项目投资回报率的全栈 Web 应用</h3>
</div>

---

## ✨ 功能特性

- ✅ **用户注册/登录**：基于 Supabase Auth 的完整认证系统
- ✅ **ROI 智能计算**：自动计算投资回报率、回本周期、净现金流等关键指标
- ✅ **AI 智能分析**：使用 Google Gemini API 生成专业项目分析报告
- ✅ **数据持久化**：所有评估数据安全保存到 Supabase PostgreSQL
- ✅ **数据可视化**：现金流趋势图表展示（Recharts）
- ✅ **离线模式**：无 Supabase 配置时支持本地计算和演示
- ✅ **安全性保障**：Row Level Security (RLS) 策略保护用户数据

---

## 🛠️ 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| **前端框架** | React + TypeScript | 19 |
| **构建工具** | Vite | 6.2 |
| **UI 组件** | Lucide React | - |
| **数据可视化** | Recharts | 3.6 |
| **后端服务** | Supabase | - |
| **AI 服务** | Google Gemini API | - |
| **部署平台** | Vercel | - |
| **代码托管** | GitHub | - |

---

## 🚀 快速开始

### 前置条件

- Node.js 18+
- npm 或 yarn

### 本地运行

1. **克隆仓库**
   ```bash
   git clone https://github.com/Yangchengshuai/wjl_airor_forshare.git
   cd wjl_airor_forshare
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**

   创建 `.env.local` 文件：
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

   参考 [`.env.example`](.env.example) 文件。

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **打开浏览器**
   ```
   http://localhost:3000
   ```

---

## 🌐 生产部署

### 自动部署（推荐）

项目已连接 GitHub 和 Vercel，推送代码到 `main` 分支即可自动部署。

### 手动部署

```bash
# 构建项目
npm run build

# 部署到 Vercel
vercel --prod
```

---

## 📁 项目结构

```
airoi_forshare/
├── components/              # React 组件
│   ├── Auth.tsx            # 认证组件（登录/注册）
│   ├── Dashboard.tsx       # 主仪表盘
│   ├── CalculatorView.tsx  # ROI 计算器
│   ├── InputSection.tsx    # 输入表单
│   └── ResultsPanel.tsx    # 结果展示面板
├── services/                # 服务层
│   ├── supabaseClient.ts   # Supabase 客户端配置
│   └── geminiService.ts    # Gemini AI 服务
├── supabase/                # Supabase 配置
│   └── migrations/         # 数据库迁移文件
│       └── 001_initial_schema.sql
├── types.ts                 # TypeScript 类型定义
├── App.tsx                  # 主应用组件
├── main.tsx                 # 应用入口
├── vite.config.ts           # Vite 配置
└── package.json             # 项目依赖
```

---

## 🔐 环境变量说明

| 变量名 | 说明 | 必需 | 获取方式 |
|--------|------|------|----------|
| `VITE_SUPABASE_URL` | Supabase 项目 URL | ✅ 是 | Supabase Dashboard → Settings → API |
| `VITE_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | ✅ 是 | Supabase Dashboard → Settings → API |
| `GEMINI_API_KEY` | Google Gemini API 密钥 | ⚠️ 可选 | [Google AI Studio](https://ai.studio.google.com/app/apikey) |

---

## 📊 部署状态

| 环境 | 地址 | 状态 |
|------|------|------|
| 🌐 **生产环境** | [https://airoiforshare.vercel.app](https://airoiforshare.vercel.app) | ✅ 运行中 |
| 🔧 **GitHub 仓库** | [https://github.com/Yangchengshuai/wjl_airor_forshare](https://github.com/Yangchengshuai/wjl_airor_forshare) | ✅ |
| 🔑 **Supabase 项目** | `olcnoazqarscpwtrwlhm` | ✅ |

---

## 📚 文档

| 文档 | 说明 |
|------|------|
| 📖 [完整部署指南](DEPLOYMENT_GUIDE.md) | 详细的部署步骤和配置说明 |
| 🔐 [登录问题排查](AUTH_TROUBLESHOOTING.md) | 登录/注册问题的解决方案 |
| ⚙️ [Supabase 邮件配置](SUPABASE_AUTH_CONFIG.md) | 邮件确认功能配置指南 |
| ✅ [功能测试清单](TESTING_CHECKLIST.md) | 完整的功能测试步骤 |
| 📝 [更新日志](CHANGELOG.md) | 版本更新历史和变更记录 |
| 📋 [后续优化任务](TODO.md) | 计划中的优化任务清单 |

---

## 🎉 最新更新 (v1.1.0)

### ✨ 新增功能

- ✅ **用户注册功能**：支持用户自主注册账号
- ✅ **登录/注册切换**：友好的界面切换体验
- ✅ **密码验证**：最小 6 位密码要求
- ✅ **智能提示**：根据 Supabase 配置自动提示是否需要邮件确认

### 🐛 问题修复

- ✅ 修复 Supabase 环境变量注入问题（之前包含 "N" 和换行符）
- ✅ 修复 Gemini API 初始化错误（无 API Key 时优雅降级）
- ✅ 修复 Vite 构建时的环境变量暴露问题

### ⚠️ 已知问题

#### 📧 邮件确认链接问题

**问题描述**：
- Supabase 邮件确认链接默认指向 `localhost:3000`
- 生产环境应指向 `https://airoiforshare.vercel.app`

**临时方案（已实施）**：
- ✅ 在 Supabase Dashboard 中禁用了邮件确认
- ✅ 用户注册后立即可以登录，无需确认邮件

**永久方案（计划中）**：
- ⏳ 在 Supabase 设置中配置正确的 Site URL
- ⏳ 配置 Redirect URLs 允许生产域名
- ⏳ 重新启用邮件确认功能

详细说明请参考：
- [SUPABASE_AUTH_CONFIG.md](SUPABASE_AUTH_CONFIG.md)
- [TODO.md](TODO.md) - 查看优化任务进度

---

## 🔧 常见问题

### Q1: 注册后无法登录？

**A**: 请检查：
1. 是否在 Supabase Dashboard 中禁用了邮件确认（当前已禁用）
2. 使用注册时的邮箱和密码尝试登录
3. 如果启用了邮件确认，需要先点击邮件中的确认链接

详见：[AUTH_TROUBLESHOOTING.md](AUTH_TROUBLESHOOTING.md)

### Q2: AI 分析功能不工作？

**A**: 检查环境变量：
- `GEMINI_API_KEY` 是否已配置
- API Key 是否有效

如果没有配置，应用会显示友好提示，不影响其他功能。

### Q3: 如何重置密码？

**A**: 当前版本暂不支持"忘记密码"功能，计划在 v1.2.0 中添加。如果需要重置密码，请联系管理员。

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 开发流程

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

---

## 👥 维护者

**Yangchengshuai** - [GitHub](https://github.com/Yangchengshuai)

---

## 🙏 致谢

- [Supabase](https://supabase.com/) - 后端即服务平台
- [Vercel](https://vercel.com/) - 部署平台
- [Google Gemini](https://ai.google.dev/) - AI 分析能力
- [Vite](https://vitejs.dev/) - 构建工具

---

<div align="center">
  <b>如果这个项目对您有帮助，请给一个 ⭐️ Star！</b>
</div>

---

**最后更新**：2026-01-22
**当前版本**：v1.1.0
