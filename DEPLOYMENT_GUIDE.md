# 部署指南 - AI ROI 评估助手

本指南包含完整的 Supabase + Vercel 部署步骤。

## 项目信息

### Supabase 项目
- **项目名称**: airoi-forshare
- **Project Ref**: `qgzgjbyazgmghgjqwkzi`
- **项目 URL**: `https://qgzgjbyazgmghgjqwkzi.supabase.co`
- **状态**: ACTIVE_HEALTHY

### Vercel 项目
- **项目名称**: airoi_forshare
- **项目 ID**: `prj_650OhR9GzRqSJh51hMjOFlQsEL5K`
- **组织 ID**: `team_JUM4yA2RxfO5WPo7V4Tvt5P4`

## 步骤 1: Supabase 数据库配置

### 1.1 获取 Supabase Anon Key

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择项目 `airoi-forshare`
3. 进入 **Settings** → **API**
4. 复制 **anon/public** key

### 1.2 执行数据库迁移

有两种方式执行迁移：

#### 方式 A: 通过 Supabase Dashboard（推荐）

1. 访问项目 Dashboard: https://supabase.com/dashboard/project/qgzgjbyazgmghgjqwkzi
2. 进入 **SQL Editor**
3. 复制 `supabase/migrations/001_initial_schema.sql` 文件内容
4. 粘贴到 SQL Editor
5. 点击 **Run** 执行

#### 方式 B: 使用 Supabase CLI

```bash
# 安装 Supabase CLI
npm install -g supabase

# 登录（使用提供的 Token）
export SUPABASE_ACCESS_TOKEN=sbp_2d84406add7808f1015bf1fbdb16dd20d05593f0

# 链接项目
supabase link --project-ref qgzgjbyazgmghgjqwkzi

# 执行迁移
supabase db push
```

### 1.3 验证数据库配置

在 Supabase Dashboard 中：
1. 进入 **Table Editor**
2. 确认 `assessments` 表已创建
3. 检查 RLS 策略是否启用（**Authentication** → **Policies**）

## 步骤 2: Vercel 环境变量配置

### 2.1 通过 Vercel Dashboard 配置

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择项目 `airoi_forshare`
3. 进入 **Settings** → **Environment Variables**
4. 添加以下环境变量：

| 变量名 | 值 | 环境 |
|--------|-----|------|
| `VITE_SUPABASE_URL` | `https://qgzgjbyazgmghgjqwkzi.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | (从 Supabase Dashboard 获取) | Production, Preview, Development |
| `VITE_API_KEY` | (你的 Google Gemini API Key) | Production, Preview, Development |

### 2.2 通过 Vercel CLI 配置（可选）

```bash
# 使用提供的 Token
export VERCEL_TOKEN=n7J4VRhIurcfmfF8PMwdMBfU

# 添加环境变量
vercel env add VITE_SUPABASE_URL production
# 输入值: https://qgzgjbyazgmghgjqwkzi.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# 输入值: (从 Supabase Dashboard 获取)

vercel env add VITE_API_KEY production
# 输入值: (你的 Google Gemini API Key)
```

### 2.3 获取 Google Gemini API Key

1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 创建新的 API Key
3. 复制 API Key 并添加到 Vercel 环境变量

## 步骤 3: 连接 GitHub 仓库（如果未连接）

### 3.1 通过 Vercel Dashboard

1. 访问项目设置: https://vercel.com/dashboard
2. 进入 **Settings** → **Git**
3. 点击 **Connect Git Repository**
4. 选择 `ryan202478/airoi_forshare`
5. 确认连接

### 3.2 推送代码到 GitHub

如果代码还未推送：

```bash
cd /home/ycs/work/wjl/airoi_forshare

# 添加所有文件
git add .

# 提交
git commit -m "Add deployment configuration and database migrations"

# 推送（如果网络有问题，可以稍后重试）
git push origin main
```

## 步骤 4: 部署

### 4.1 自动部署

一旦 GitHub 仓库连接成功，Vercel 会自动：
- 检测到新的 push
- 触发构建
- 部署到生产环境

### 4.2 手动部署

```bash
cd /home/ycs/work/wjl/airoi_forshare

# 使用 Vercel CLI 部署
export VERCEL_TOKEN=n7J4VRhIurcfmfF8PMwdMBfU
vercel --prod
```

## 步骤 5: 验证部署

### 5.1 检查部署状态

1. 访问 Vercel Dashboard
2. 查看 **Deployments** 标签页
3. 确认最新部署状态为 **Ready**

### 5.2 功能验证

访问部署的 URL，测试以下功能：

- [ ] 用户注册/登录功能
- [ ] 创建新的评估项目
- [ ] 保存评估数据
- [ ] AI 分析功能
- [ ] 查看项目列表
- [ ] 编辑/删除项目

### 5.3 检查 Supabase 数据

1. 访问 Supabase Dashboard
2. 进入 **Table Editor** → **assessments**
3. 确认数据可以正常写入和读取

## 故障排查

### 问题 1: 环境变量未生效

**解决方案**:
- 确认环境变量已添加到所有环境（Production, Preview, Development）
- 重新部署项目
- 检查变量名是否正确（注意 `VITE_` 前缀）

### 问题 2: Supabase 连接失败

**解决方案**:
- 检查 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY` 是否正确
- 确认 Supabase 项目状态为 ACTIVE
- 检查 Supabase Dashboard 中的 API 设置

### 问题 3: RLS 策略阻止数据访问

**解决方案**:
- 确认已执行数据库迁移
- 检查 RLS 策略是否正确配置
- 验证用户已正确登录

### 问题 4: AI 分析功能不工作

**解决方案**:
- 检查 `VITE_API_KEY` 是否正确配置
- 验证 Google Gemini API Key 是否有效
- 查看浏览器控制台错误信息

## 安全注意事项

1. **不要**将 Token 或 API Key 提交到 Git 仓库
2. **使用** Vercel 环境变量管理敏感信息
3. **定期**轮换 API Key 和 Token
4. **启用** Supabase RLS 策略保护数据
5. **监控** API 使用量，避免超出配额

## 后续优化

- [ ] 配置自定义域名
- [ ] 设置预览部署（Preview Deployments）
- [ ] 添加错误监控（如 Sentry）
- [ ] 配置 CI/CD 流程
- [ ] 添加性能监控

## 相关资源

- [Supabase 文档](https://supabase.com/docs)
- [Vercel 文档](https://vercel.com/docs)
- [项目 GitHub 仓库](https://github.com/ryan202478/airoi_forshare)
