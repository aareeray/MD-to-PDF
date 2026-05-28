export const sampleMarkdown = `# Welcome to MarkFlow

> Turn Markdown into beautiful documents with professional PDF exports.

## Features

MarkFlow supports the full range of Markdown syntax with extensions:

### Text Formatting

You can write **bold text**, *italic text*, ~~strikethrough~~, and \`inline code\`. You can also combine **_bold and italic_** together.

### Lists

#### Unordered Lists
- Perfect typography rendering
- Custom font support (TTF/OTF)
- Professional PDF export
  - A4 and Letter sizes
  - Portrait and Landscape
  - Custom margins

#### Ordered Lists
1. Write your markdown
2. Preview in real-time
3. Export to beautiful PDF
4. Share with the world

#### Task Lists
- [x] Set up the editor
- [x] Add live preview
- [ ] Export to PDF
- [ ] Share document

---

## Code Blocks

\`\`\`typescript
interface Document {
  title: string;
  content: string;
  author: string;
  createdAt: Date;
}

function exportToPDF(doc: Document): Promise<Blob> {
  const renderer = new PDFRenderer({
    fonts: ['Inter', 'JetBrains Mono'],
    pageSize: 'A4',
    margin: { top: 40, bottom: 40, left: 50, right: 50 }
  });
  
  return renderer.render(doc.content);
}
\`\`\`

## Tables

| Feature | Free | Pro |
|---------|------|-----|
| Live Preview | ✓ | ✓ |
| PDF Export | ✓ | ✓ |
| Custom Fonts | ✗ | ✓ |
| Themes | 3 | 7 |
| Watermark | ✗ | Remove |

## Blockquotes

> "The details are not the details. They make the design."
> 
> — Charles Eames

## Math Equations

Inline math: $E = mc^2$

Block math:

$$
\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}
$$

## Images

Images are supported with full markdown syntax and render beautifully in both the preview and exported PDF.

---

## Getting Started

1. **Write** your content in the editor on the left
2. **Preview** the rendered output on the right
3. **Customize** fonts, themes, and layout options
4. **Export** to a professionally formatted PDF

*Made with MarkFlow — Premium Document Generation*
`;
