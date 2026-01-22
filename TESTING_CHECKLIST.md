# AI ROI 评估助手 - 功能测试清单

## 📅 测试时间
部署时间：2026-01-22 00:35 UTC+8
生产地址：https://airoiforshare.vercel.app

## ✅ 部署验证

### 1. 基础功能检查
- [ ] 访问 https://airoiforshare.vercel.app
- [ ] 看到登录/注册页面
- [ ] 控制台没有红色错误（警告可以忽略）

### 2. 用户注册测试
1. 点击"注册"标签
2. 输入邮箱和密码
3. 点击"注册"按钮
4. 检查邮箱是否收到验证链接（Supabase Auth）

### 3. 用户登录测试
1. 输入已注册的邮箱和密码
2. 点击"登录"按钮
3. 应该跳转到主应用界面

### 4. 创建评估测试
登录后：
1. 填写项目基本信息
   - 项目名称：测试项目
   - 项目背景：AI自动化测试工具
   - HR运营月薪：15000
   - 每月节省工时：40
   - 产研投入：10人月
   - 人月成本：2万
   - 外部CAPEX：5万
   - 年度OPEX：6万
2. 点击"计算ROI"
3. 查看计算结果：
   - 月度收益：¥10,000
   - 月度净现金流：¥5,000
   - 回本周期：约17个月
   - 3年期ROI：85.7%
4. 点击"保存到Supabase"
5. 检查是否保存成功

### 5. 数据持久化验证
1. 刷新页面
2. 查看"历史评估"列表
3. 确认刚才保存的项目在列表中
4. 点击项目可以查看详情

### 6. AI分析功能（可选，需要API Key）
⚠️ 当前状态：已禁用（未配置 Gemini API Key）

如需启用：
1. 访问 https://ai.studio.google.com/app/apikey
2. 创建新的 API Key
3. 在 Vercel 项目设置中添加环境变量：
   ```
   GEMINI_API_KEY=your_actual_api_key
   ```
4. Vercel 会自动重新部署
5. 重新测试"生成AI分析"功能

## 🔍 Supabase 数据验证

登录 Supabase Dashboard：
1. 进入 Table Editor → assessments 表
2. 确认有新的记录
3. 检查字段：
   - user_id：当前用户ID
   - name：项目名称
   - inputs：JSON格式的输入数据
   - created_at：创建时间

## 📱 移动端测试
- [ ] 使用手机浏览器访问
- [ ] 验证响应式布局
- [ ] 测试触摸交互

## 🎯 性能检查
- [ ] 首屏加载时间 < 3秒
- [ ] 页面交互响应流畅
- [ ] 没有明显的卡顿

## ⚠️ 已知限制（不影响使用）

1. **Tailwind CDN**：生产环境建议安装为项目依赖
2. **Bundle 大小**：约 1.1MB（可后续代码分割优化）
3. **AI 分析**：需要配置 Gemini API Key

## 📞 问题排查

如果遇到问题：
1. 检查控制台是否有红色错误
2. 检查 Supabase 项目状态
3. 检查 Vercel 部署日志
4. 参考 `DEPLOYMENT_GUIDE.md` 详细文档

---

## ✅ 部署成功指标

当前状态：
- ✅ GitHub 仓库：https://github.com/Yangchengshuai/wjl_airor_forshare
- ✅ Vercel 生产：https://airoiforshare.vercel.app
- ✅ Supabase 数据库：已配置
- ✅ 用户认证：正常
- ✅ ROI 计算：正常
- ✅ 数据保存：正常
- ⚠️ AI 分析：需要 API Key（可选）
