# 🥋 Muay Thai Analyzer

AI 驱动的泰拳技术分析应用，使用计算机视觉和机器学习技术帮助练习者改进技术。

_Built with [v0.dev](https://v0.dev) and deployed on [Vercel](https://vercel.com)_

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/aurorazyys-projects/v0-muay-thai-app-features)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/ZWKFDdyUkFg)

## 🏗️ 项目结构

```
MuayThaiAnalyzer/
├── frontend/          # Next.js + React 前端
│   ├── app/           # Next.js 应用路由
│   ├── components/    # React 组件
│   ├── lib/           # 工具库
│   ├── public/        # 静态文件
│   └── package.json   # 前端依赖
├── backend/           # Python 后端
│   ├── pose_estimation.py      # 姿态估计
│   ├── technique_classifier.py # 技术分类
│   ├── scoring_engine.py       # 评分引擎
│   ├── main_pipeline.py        # 主分析管道
│   └── requirements.txt        # Python依赖
├── input_test.mov     # 测试视频文件
└── README.md          # 项目文档
```

## 🚀 快速开始

### 🖥️ 前端启动

```bash
# 进入前端目录
cd frontend

# 安装依赖
pnpm install
# 或 npm install

# 启动开发服务器
pnpm dev
# 或 npm run dev

# 打开浏览器访问 http://localhost:3000
```

### 🐍 后端启动

```bash
# 进入后端目录
cd backend

# 创建虚拟环境（推荐）
python3 -m venv venv
source venv/bin/activate  # macOS/Linux

# 安装依赖
pip install -r requirements.txt

# 测试姿态估计（使用测试视频）
python3 pose_estimation.py ../input_test.mov

# 测试完整分析管道
python3 main_pipeline.py
```

## 🎯 核心功能

### 📹 姿态估计

- 使用 MediaPipe 分析人体关键点
- 实时视频处理和分析
- 生成带标注的输出视频

### 🤖 技术分类

- 识别 8 种泰拳技术：
  - jab, cross, hook, uppercut
  - roundhouse_kick, teep
  - elbow_strike, knee_strike

### 📊 评分系统

- **Form** (形态): 姿势正确性
- **Chain of Power** (力量链): 动力学效率
- **Explosiveness** (爆发力): 速度和流畅性

### 🌐 Web 界面

- 视频上传和分析
- 实时反馈和建议
- 进度追踪和历史记录

## 🛠️ 技术栈

### 前端

- **Next.js 15** + **React 19**
- **TypeScript** + **Tailwind CSS**
- **shadcn/ui** 组件库

### 后端

- **Python 3.11+**
- **MediaPipe** (姿态估计)
- **OpenCV** (视频处理)
- **scikit-learn** (机器学习)

## 🔄 开发工作流

### 1. 测试当前功能

```bash
# 测试后端
cd backend
python3 pose_estimation.py ../input_test.mov

# 测试前端
cd frontend
pnpm dev
```

### 2. 开发新功能

- 后端：在 `backend/` 目录修改 Python 文件
- 前端：在 `frontend/app/` 目录添加新页面

### 3. 连接前后端

- 选项 1：Next.js API Routes (`frontend/app/api/`)
- 选项 2：独立 API 服务器 (FastAPI/Flask)

## 📝 部署

### 前端部署

- **Vercel**：自动部署 (已配置)
- **其他平台**：`pnpm build` 后部署

### 后端部署

- **本地运行**：直接运行 Python 脚本
- **API 服务器**：需要创建 Flask/FastAPI 包装器

## 🤝 贡献

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

**🎯 现在你可以分别启动前端和后端进行开发！**
