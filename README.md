 # Cyber Security Toolkit

## 🛡️ Project Purpose & Overview
The **Cyber Security Toolkit** is a comprehensive, interactive dashboard designed for cybersecurity professionals, students, and enthusiasts. It serves as a centralized hub for managing and exploring various cybersecurity resources.

**Key Features:**
- **📚 Knowledge Base:** curated lists of cybersecurity books, certifications, and educational resources (YouTubers, courses).
- **🛠️ Tools & Platforms:** A directory of essential security tools, platforms, and breach check services.
- **📋 Compliance & Frameworks:** Detailed information on cybersecurity frameworks (NIST, ISO, etc.) and checklists.
- **🚀 Interactive UI:** Built with a modern, glassmorphic design aesthetic using React and Framer Motion.
- **☁️ Cloud Sync:** Integrated with Supabase for user authentication, data persistence, and community tool submissions.
- **🤖 AI Integration:** Features integration with Google's Gemini AI for enhanced assistance.

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- A Supabase project (for backend features)
- Google Gemini API Key

### Installation Steps
1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd testings-main
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your keys:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   The application will start at `http://localhost:5173`.

### Administrative Scripts
- **Export Data:** `npm run export-data` - Exports current database content to local files.
- **Import Data:** `npm run import-data` - Imports local data files into Supabase.

## 📂 File Structure

```
testings-main/
├── 📁 components/       # Reusable React components (Modals, UI elements)
│   ├── UpdatesModal.tsx
│   ├── IconComponents.tsx
│   └── ...
├── 📁 data/            # Static data and typescript definitions
│   ├── books.ts        # Library of cybersecurity books
│   ├── certifications.ts
│   ├── frameworks.ts
│   ├── tools.ts
│   └── ...
├── 📁 services/        # Backend service layers
│   └── supabaseService.ts
├── 📁 scripts/         # Utility scripts for data management
├── App.tsx             # Main application entry point & routing
├── main.tsx           # React DOM rendering
├── types.ts            # Global TypeScript type definitions
├── fix_*.sql          # SQL migration and fix scripts for Supabase
└── package.json        # Project dependencies and scripts
```

## 🛠️ Tech Stack
- **Frontend:** React, TypeScript, Vite
- **Styling:** CSS (Custom Glassmorphism), Tailwind CSS
- **Animations:** Framer Motion (`motion`), GSAP
- **Backend:** Supabase (PostgreSQL, Auth, Realtime).
- **Utilities:** `date-fns`, `uuid`, `@dnd-kit` (Drag & Drop)
