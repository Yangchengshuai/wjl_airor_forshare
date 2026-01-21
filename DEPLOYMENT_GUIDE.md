# AI ROI 评估助手 - 完整部署与使用指南

## 📋 目录

- [一、项目概述](#一项目概述)
- [二、项目架构详解](#二项目架构详解)
- [三、完整部署流程](#三完整部署流程)
- [四、配置文件详解](#四配置文件详解)
- [五、部署后使用指南](#五部署后使用指南)
- [六、测试验证指南](#六测试验证指南)
- [七、常见问题排查](#七常见问题排查)
- [八、后续维护指南](#八后续维护指南)

---

## 一、项目概述

### 1.1 项目简介

**AI ROI 评估助手**是一个帮助企业评估 AI 项目投资回报率的全栈 Web 应用。通过输入项目成本、收益等参数，结合 AI 分析，自动计算项目的 ROI（投资回报率）。

### 1.2 核心功能

- ✅ **用户认证系统**：基于 Supabase Auth 的注册/登录
- ✅ **ROI 计算器**：计算项目的投资回报率、回本周期等关键指标
- ✅ **数据持久化**：所有评估数据保存到 Supabase 数据库
- ✅ **AI 智能分析**：使用 Google Gemini API 生成项目分析报告
- ✅ **数据可视化**：使用 Recharts 展示现金流趋势图
- ✅ **离线模式**：未配置 Supabase 时支持本地计算

### 1.3 技术栈

| 类别 | 技术 | 说明 |
|------|------|------|
| **前端框架** | React 19 + TypeScript | 现代化 React 开发 |
| **构建工具** | Vite 6.2 | 快速的开发构建工具 |
| **UI 组件** | Lucide React | 图标库 |
| **数据可视化** | Recharts 3.6 | 图表库 |
| **后端服务** | Supabase | 数据库 + 认证 + 实时订阅 |
| **AI 服务** | Google Gemini API | AI 分析能力 |
| **部署平台** | Vercel | 自动化部署 + CDN |
| **代码托管** | GitHub | 版本控制 + CI/CD |

---

## 二、项目架构详解

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────────────┐
│                         用户层 (Browser)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │           React 19 + TypeScript + Vite 应用               │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐  │  │
│  │  │ 认证页面 │  │ 仪表盘   │  │ 计算器   │  │ 结果页  │  │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └─────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        服务层 (Services)                          │
│                                                                  │
│  ┌───────────────────┐         ┌───────────────────┐            │
│  │  Supabase Client  │         │  Gemini Service   │            │
│  │  ┌─────────────┐  │         │  ┌─────────────┐  │            │
│  │  │  Auth       │  │         │  │  AI 分析    │  │            │
│  │  │  Database   │  │         │  │  报告生成   │  │            │
│  │  │  Storage    │  │         │  └─────────────┘  │            │
│  │  └─────────────┘  │         └───────────────────┘            │
│  └───────────────────┘                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        基础设施层 (Infrastructure)                  │
│                                                                  │
│  ┌───────────────────┐         ┌───────────────────┐            │
│  │     Vercel        │         │    Supabase       │            │
│  │  ┌─────────────┐  │         │  ┌─────────────┐  │            │
│  │  │  CDN        │  │         │  │ PostgreSQL  │  │            │
│  │  │  Edge       │  │         │  │  Auth       │  │            │
│  │  │  Functions  │  │         │  │  Storage    │  │            │
│  │  └─────────────┘  │         │  └─────────────┘  │            │
│  └───────────────────┘         └───────────────────┘            │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 数据流向

```
用户操作
   │
   ├─► 注册/登录 ──► Supabase Auth ──► 返回 Session Token
   │
   ├─► 创建评估 ──► 前端计算 ROI ──► 保存到 Supabase Database
   │                                    │
   │                                    ▼
   │                              assessments 表
   │
   └─► AI 分析 ──► Gemini Service ──► 生成报告 ──► 更新数据库
```

### 2.3 Supabase 的作用

**Supabase** 是一个开源的 Firebase 替代方案，在本项目中扮演以下角色：

#### 2.3.1 数据库服务 (PostgreSQL)
- **作用**: 存储用户评估数据
- **表结构**:
  ```sql
  assessments 表:
  - id: UUID (主键)
  - user_id: UUID (关联用户)
  - name: TEXT (项目名称)
  - inputs: JSONB (输入参数)
  - ai_analysis: TEXT (AI 分析结果)
  - created_at / updated_at: 时间戳
  ```

#### 2.3.2 认证服务 (Authentication)
- **作用**: 处理用户注册、登录、会话管理
- **特点**:
  - 开箱即用的邮箱密码认证
  - Session 管理
  - 行级安全 (RLS) 策略保护数据

#### 2.3.3 行级安全 (Row Level Security)
- **作用**: 确保用户只能访问自己的数据
- **策略**:
  ```sql
  -- 用户只能查看自己的评估
  POLICY "Users can view own assessments"
  USING (auth.uid() = user_id);

  -- 用户只能插入自己的评估
  POLICY "Users can insert own assessments"
  WITH CHECK (auth.uid() = user_id);
  ```

### 2.4 Vercel 的作用

**Vercel** 是一个现代化的前端部署平台，在本项目中提供：

#### 2.4.1 自动化部署
- **作用**: 每次 GitHub 代码推送自动构建部署
- **流程**:
  ```
  Git Push → GitHub Webhook → Vercel 构建 → 自动部署
  ```

#### 2.4.2 全球 CDN
- **作用**: 将静态资源分发到全球边缘节点
- **优势**:
  - 极快的加载速度
  - 自动 HTTPS
  - 智能路由

#### 2.4.3 环境变量管理
- **作用**: 安全存储敏感配置
- **配置**:
  ```bash
  VITE_SUPABASE_URL=xxxxx
  VITE_SUPABASE_ANON_KEY=xxxxx
  GEMINI_API_KEY=xxxxx
  ```

### 2.5 项目文件结构

```
airoi_forshare/
├── components/                # React 组件
│   ├── Auth.tsx              # 登录/注册组件
│   ├── Dashboard.tsx         # 仪表盘（评估列表）
│   ├── CalculatorView.tsx    # ROI 计算器
│   ├── InputSection.tsx      # 输入表单
│   └── ResultsPanel.tsx      # 结果展示面板
├── services/                  # 服务层
│   ├── supabaseClient.ts     # Supabase 客户端
│   └── geminiService.ts      # Gemini AI 服务
├── supabase/                  # Supabase 配置
│   └── migrations/           # 数据库迁移文件
│       └── 001_initial_schema.sql
├── App.tsx                    # 主应用组件
├── vite.config.ts            # Vite 构建配置
├── vercel.json               # Vercel 部署配置
└── .env.example              # 环境变量示例
```

---

## 三、完整部署流程

### 3.1 前置准备

#### 3.1.1 必需账号

| 服务 | 用途 | 注册地址 |
|------|------|----------|
| GitHub | 代码托管 | https://github.com/signup |
| Supabase | 数据库 + 认证 | https://supabase.com/signup |
| Vercel | 应用部署 | https://vercel.com/signup |
| Google AI | Gemini API Key | https://ai.studio.google.com/app/apikey |

#### 3.1.2 必需工具

```bash
# 检查 Node.js 版本（需要 >= 18）
node --version  # 推荐 v22.19.0

# 安装 Vercel CLI
npm i -g vercel

# 安装 GitHub CLI (可选)
# Ubuntu/Debian
sudo apt install gh
```

### 3.2 第二步：配置 Supabase

#### 3.2.1 创建 Supabase 项目

1. 访问 https://supabase.com/dashboard
2. 点击 "New Project"
3. 填写信息并创建

#### 3.2.2 执行数据库 Migration

在 Supabase SQL Editor 中执行 `supabase/migrations/001_initial_schema.sql` 文件中的 SQL。

#### 3.2.3 获取凭证

从 Supabase Dashboard → Settings → API 获取：
- Project URL
- anon/public key

### 3.3 第三步：部署到 Vercel

#### 3.3.1 连接 Vercel 到 GitHub

```bash
# 登录 Vercel
vercel login

# 部署项目
vercel
```

#### 3.3.2 配置环境变量

```bash
# 添加环境变量
printf "N\n" | vercel env add VITE_SUPABASE_URL production
printf "N\n" | vercel env add VITE_SUPABASE_ANON_KEY production
printf "N\n" | vercel env add GEMINI_API_KEY production

# 重新部署
vercel --yes --prod
```

---

## 十一、总结

### 核心收获

✅ **技术能力**
- 掌握了 React + TypeScript + Vite 现代前端开发
- 学会了 Supabase 作为后端服务的使用
- 熟悉了 Vercel 自动化部署流程

✅ **架构理解**
- 理解了前后端分离架构
- 掌握了 Serverless 部署模式
- 了解了 JAMstack 应用架构

### 项目链接

- **应用地址**: https://airoiforshare.vercel.app
- **GitHub**: https://github.com/Yangchengshuai/wjl_airor_forshare
- **Supabase**: https://supabase.com/dashboard/project/olcnoazqarscpwtrwlhm

---

**文档版本**: v1.0
**最后更新**: 2026-01-22

---

## 四、配置文件详解

### 4.1 环境变量配置

#### 当前配置信息

**Supabase 配置**:
```bash
VITE_SUPABASE_URL=https://olcnoazqarscpwtrwlhm.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable__EKjYXyGVR-9M5caOfWcyQ_ouILgg0x
```

**Gemini API 配置**:
```bash
GEMINI_API_KEY=your_gemini_api_key_placeholder  # 需要更新
```

#### 获取 API Keys

1. **Supabase**: https://supabase.com/dashboard/project/olcnoazqarscpwtrwlhm/settings/api
2. **Gemini**: https://ai.studio.google.com/app/apikey

### 4.2 Vercel 配置

**vercel.json**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### 4.3 本地开发配置

创建 `.env.local` 文件：
```bash
cp .env.example .env.local
```

编辑 `.env.local`:
```bash
VITE_SUPABASE_URL=https://olcnoazqarscpwtrwlhm.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable__EKjYXyGVR-9M5caOfWcyQ_ouILgg0x
GEMINI_API_KEY=your_actual_api_key_here
```

---

## 五、部署后使用指南

### 5.1 访问应用

**生产环境**: https://airoiforshare.vercel.app

### 5.2 用户注册与登录

1. 访问应用
2. 点击 "Sign Up" 注册账号
3. 使用邮箱和密码登录

### 5.3 创建 ROI 评估

1. 点击 "New Assessment"
2. 填写项目信息：
   - 项目名称
   - 每月节省工时
   - HR 运营人员月薪
   - 产研人月数量
   - 单人月成本
   - 年度运营支出
   - 一次性采购成本
3. 点击 "计算 ROI"
4. 查看结果和 AI 分析

### 5.4 管理评估

- 查看 Dashboard 中的所有评估
- 编辑现有评估
- 删除不需要的评估

---

## 六、测试验证指南

### 6.1 功能测试清单

| 功能 | 测试方法 | 预期结果 |
|------|----------|----------|
| 用户注册 | 填写邮箱密码注册 | 注册成功 |
| 用户登录 | 使用注册账号登录 | 登录成功 |
| 创建评估 | 填写表单并提交 | 数据保存到数据库 |
| ROI 计算 | 输入参数计算 | 显示正确结果 |
| 数据持久化 | 刷新页面 | 数据仍然存在 |

### 6.2 数据库验证

在 Supabase SQL Editor 执行：
```sql
SELECT * FROM public.assessments ORDER BY created_at DESC;
```

应该能看到你创建的评估数据。

### 6.3 环境变量验证

打开浏览器控制台（F12）：
```javascript
console.log(import.meta.env.VITE_SUPABASE_URL);
```

应该显示你的 Supabase URL。

---

## 七、常见问题排查

### Q1: 无法连接到 Supabase

**原因**: 环境变量配置错误

**解决方案**:
1. 检查 Vercel 环境变量配置
2. 确保 URL 格式正确：`https://xxxxx.supabase.co`
3. 重新部署：`vercel --prod`

### Q2: 数据保存失败

**原因**: 用户未登录或 RLS 策略问题

**解决方案**:
1. 确认已登录
2. 检查 Supabase RLS 策略
3. 查看浏览器控制台错误信息

### Q3: AI 分析不工作

**原因**: Gemini API Key 未配置或无效

**解决方案**:
1. 获取有效的 Gemini API Key
2. 在 Vercel 环境变量中配置
3. 重新部署

---

## 八、后续维护指南

### 8.1 更新代码

```bash
# 修改代码
git add .
git commit -m "feat: update"
git push origin main
# Vercel 自动部署
```

### 8.2 更新环境变量

```bash
vercel env rm VAR_NAME production
printf "N\n" | vercel env add VAR_NAME production
vercel --prod
```

### 8.3 查看日志

```bash
vercel logs --follow
```

### 8.4 监控性能

- Vercel Dashboard: 查看部署状态和性能指标
- Supabase Dashboard: 查看数据库使用情况

---

## 附录：快速参考

### A. 项目链接

| 服务 | 链接 |
|------|------|
| 应用地址 | https://airoiforshare.vercel.app |
| GitHub 仓库 | https://github.com/Yangchengshuai/wjl_airor_forshare |
| Vercel Dashboard | https://vercel.com/yangchengshuais-projects/airoi_forshare |
| Supabase Dashboard | https://supabase.com/dashboard/project/olcnoazqarscpwtrwlhm |
| Supabase SQL Editor | https://supabase.com/dashboard/project/olcnoazqarscpwtrwlhm/sql/new |

### B. 常用命令

```bash
# 本地开发
npm install
npm run dev

# 构建部署
npm run build
vercel --prod

# Git 操作
git push origin main

# 环境变量
vercel env ls
```

### C. 环境变量清单

| 变量名 | 用途 | 获取地址 |
|--------|------|----------|
| VITE_SUPABASE_URL | Supabase 项目 URL | Supabase Dashboard → Settings → API |
| VITE_SUPABASE_ANON_KEY | Supabase 公开 Key | Supabase Dashboard → Settings → API |
| GEMINI_API_KEY | Gemini AI Key | https://ai.studio.google.com/app/apikey |

---

**文档更新**: 2026-01-22
**维护者**: Yangchengshuai
