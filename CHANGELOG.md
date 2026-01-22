# 更新日志 (CHANGELOG)

本文档记录 AI ROI 评估助手的所有重要变更。

---

## [1.1.1] - 2026-01-22

### ✨ 功能改进

#### 邮件确认功能配置完成
- **完成**：Supabase Site URL 配置为生产域名
- **完成**：Redirect URLs 配置允许生产环境回调
- **完成**：邮件确认功能已启用并测试通过
- **结果**：用户注册后可收到确认邮件，点击链接可成功验证

### 📝 配置记录

**Supabase 配置**：
- Site URL: `https://airoiforshare.vercel.app`
- Redirect URLs:
  - `https://airoiforshare.vercel.app/**`
  - `https://airoiforshare.vercel.app/auth/callback`
- 邮件确认：已启用
- 邮件模板：使用默认模板

**测试验证**：
- ✅ 注册新账号收到确认邮件
- ✅ 邮件链接指向正确的生产域名
- ✅ 点击链接成功完成邮箱验证
- ✅ 验证后可以正常登录

### 📚 文档更新

- **更新**：`README.md` - 标记邮件确认问题已解决
- **更新**：`CHANGELOG.md` - 添加 v1.1.1 发布记录
- **更新**：`TODO.md` - 标记邮件确认任务为已完成
- **参考**：`PLAN_A_EMAIL_CONFIRMATION.md` - 完整配置方案

---

## [1.1.0] - 2026-01-22

### 🎉 新增功能

#### 用户注册功能
- **新增**：在 Auth 组件中添加用户注册功能
- **新增**：登录/注册模式切换（"还没有账号？立即注册"链接）
- **新增**：注册成功后的智能提示（自动检测是否需要邮件确认）
- **新增**：密码最小长度验证（6位）
- **新增**：友好的错误提示和成功消息

#### 用户体验改进
- **改进**：登录按钮文字动态显示（"正在登录..."/"正在注册..."）
- **改进**：密码输入框提示文字更新为"至少6位"
- **改进**：表单提交时的加载状态显示

### 🐛 修复问题

#### 环境变量注入问题
- **修复**：Vite 配置中正确注入 `VITE_SUPABASE_URL` 和 `VITE_SUPABASE_ANON_KEY`
- **修复**：环境变量格式错误（之前包含 "N" 和换行符）

#### Gemini API 初始化错误
- **修复**：防止在 API Key 未配置时初始化 GoogleGenAI 客户端
- **修复**：AI 分析功能在无 API Key 时优雅降级，显示友好提示

### 📝 文档更新

- **新增**：`AUTH_TROUBLESHOOTING.md` - 登录问题排查指南
- **新增**：`SUPABASE_AUTH_CONFIG.md` - Supabase 邮件确认配置指南
- **新增**：`TESTING_CHECKLIST.md` - 功能测试清单
- **新增**：`debug-auth.html` - Supabase Auth 诊断工具
- **新增**：`CHANGELOG.md` - 本更新日志
- **新增**：`TODO.md` - 后续优化任务清单

### 🔧 技术细节

**修改文件**：
- `components/Auth.tsx` - 添加注册逻辑和 UI

**提交记录**：
- `19f56b5` - feat: add user registration functionality to Auth component
- `5967468` - fix: prevent Gemini API init error when API key is not configured
- `a5b57d4` - fix: remove debug logging and fix environment variable format

---

## [1.0.0] - 2026-01-21

### 🎉 首次发布

#### 核心功能
- ✅ 用户认证系统（基于 Supabase Auth）
- ✅ ROI 计算器（投资回报率、回本周期、净现金流等）
- ✅ 数据持久化（Supabase PostgreSQL）
- ✅ AI 智能分析（Google Gemini API 集成）
- ✅ 数据可视化（Recharts 现金流趋势图）
- ✅ 离线模式（无 Supabase 配置时的降级方案）

#### 技术栈
- React 19 + TypeScript + Vite 6.2
- Supabase（数据库 + 认证）
- Google Gemini API（AI 分析）
- Vercel（自动化部署）
- GitHub（代码托管）

#### 部署信息
- **生产环境**：https://airoiforshare.vercel.app
- **GitHub 仓库**：https://github.com/Yangchengshuai/wjl_airor_forshare
- **Supabase 项目**：`olcnoazqarscpwtrwlhm`

#### 安全特性
- Row Level Security (RLS) 策略
- 用户数据隔离
- 自动更新时间戳触发器

---

## 已知问题

### 📧 邮件确认链接问题（已记录，待优化）

**问题描述**：
- Supabase 邮件确认链接默认指向 `localhost:3000`
- 生产环境应指向 `https://airoiforshare.vercel.app`

**临时解决方案（已实施）**：
- ✅ 在 Supabase Dashboard 中禁用邮件确认
- ✅ 用户注册后立即可以登录，无需确认邮件

**永久解决方案（待实施）**：
- ⏳ 在 Supabase 设置中配置正确的 Site URL
- ⏳ 配置 Redirect URLs 允许生产域名
- ⏳ 重新启用邮件确认功能

**相关文档**：
- `SUPABASE_AUTH_CONFIG.md` - 详细配置指南
- `TODO.md` - 后续优化任务

---

## 即将发布

### v1.2.0（计划中）

- [ ] Supabase Site URL 配置优化
- [ ] 邮件确认功能重新启用
- [ ] 忘记密码功能
- [ ] 用户资料编辑
- [ ] 多语言支持（英文版）

---

**最后更新**：2026-01-22
**维护者**：Yangchengshuai
