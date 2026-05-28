# MarkFlow — Premium Markdown to PDF Converter

Turn Markdown into beautiful documents. Professional PDF exports with perfect typography, custom fonts, and elegant layouts.

## Features

- **Live Split-Screen Editor** — Real-time markdown preview as you type
- **Professional PDF Export** — 7 export style presets (Developer Docs, eBook, Research Paper, Resume, Minimal Clean, Luxury Editorial, Dark Cyberpunk)
- **Custom Typography** — Choose from premium font presets (Inter, Poppins, Playfair Display, JetBrains Mono, Fira Code, etc.)
- **Full Markdown Support** — GFM tables, task lists, math equations (LaTeX/KaTeX), code highlighting, blockquotes
- **Export Options** — A4/Letter, Portrait/Landscape, custom margins, headers, footers, page numbers, watermarks
- **Dark/Light Mode** — Beautiful glassmorphism UI with smooth animations
- **Auto-Save** — Documents persist in localStorage
- **Drag & Drop** — Upload `.md` files by dragging into the editor
- **Zen Mode** — Distraction-free writing experience
- **Keyboard Shortcuts** — Efficient workflow with keybindings

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS 4
- **Editor:** CodeMirror 6
- **Markdown:** react-markdown + remark-gfm + remark-math + rehype-highlight + rehype-katex
- **PDF Engine:** html2pdf.js + marked
- **Icons:** Lucide React

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page, then navigate to `/editor` to start writing.

## Export Styles

| Style | Best For |
|-------|----------|
| Minimal Clean | General documents, notes |
| Developer Docs | Technical documentation |
| eBook | Long-form content, books |
| Research Paper | Academic papers |
| Resume | CVs, professional profiles |
| Luxury Editorial | Magazine-style content |
| Dark Cyberpunk | Dark-themed documents |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` | Save document |
| `Ctrl+E` | Toggle export panel |
| `Ctrl+B` | Toggle split view |
| `Ctrl+Shift+F` | Zen mode |
| `Ctrl+?` | Show shortcuts |
| `Esc` | Close panels |

## License

MIT
