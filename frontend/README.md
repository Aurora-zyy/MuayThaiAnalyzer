# Muay Thai Analyzer - Frontend

React + Next.js frontend application for Muay Thai technique analysis.

## 🛠️ Tech Stack

- **Next.js 15** - React framework
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **shadcn/ui** - UI component library

## 📦 Installation

```bash
# Using npm
npm install --legacy-peer-deps

# Or using pnpm (recommended)
pnpm install
```

## 🚀 Start Frontend

### Development Mode

```bash
# Using npm
npm run dev

# Or using pnpm
pnpm dev
```

Application will start at [http://localhost:3000](http://localhost:3000).

### Stop Frontend

```bash
# Press Ctrl+C in terminal
```

### Production Build

```bash
# Build
npm run build
# or pnpm build

# Start production server
npm start
# or pnpm start
```

## 🎯 Feature Pages

- **Home** (`/`) - Application intro and navigation
- **Upload** (`/upload`) - Video upload and analysis
- **Techniques** (`/techniques`) - Muay Thai technique reference
- **Analysis** (`/analysis`) - Detailed analysis results
- **Journey** (`/journey`) - Progress tracking

## 🔗 Backend Integration

Frontend connects to backend via API routes:

- **API Route**: `/api/analyze` - Proxy to backend
- **Backend URL**: Configurable via environment variables
- **CORS**: Handled by backend FastAPI server

## 🌍 Environment Variables

Create `.env.local` for local development:

```bash
BACKEND_URL=http://127.0.0.1:8000
```

## 🎨 UI Components

Using shadcn/ui component library:

- `components.json` - Component configuration
- `tailwind.config.ts` - Tailwind configuration

## 📱 Responsive Design

- Mobile-first design
- Desktop, tablet, mobile support
- Modern Muay Thai theme colors
