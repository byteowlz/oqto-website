# Oqto Website

A modern, minimal documentation website for Oqto - the self-hosted AI agent platform.

## Features

- **Dark/Light Mode**: Automatic theme switching with user preference persistence
- **Modern Design**: Clean, minimal aesthetic inspired by pi.dev but with Oqto's own identity
- **Responsive**: Works beautifully on desktop, tablet, and mobile
- **Fast**: Plain TypeScript with no heavy frameworks - just clean HTML, CSS, and TS
- **Accessible**: Semantic HTML, ARIA labels, keyboard navigation support

## Tech Stack

- **Build Tool**: Bun
- **Language**: TypeScript
- **Linter**: Biome (strict rules)
- **Styling**: Plain CSS with CSS variables for theming
- **Fonts**: Inter (body), JetBrains Mono (code)

## Project Structure

```
oqto-website/
├── public/              # Static assets
│   ├── index.html       # Main HTML file
│   ├── styles/
│   │   └── main.css     # All styles with CSS variables
│   ├── scripts/
│   │   └── main.ts      # Theme toggle, copy button, smooth scroll
│   └── assets/
│       ├── oqto-icon.svg
│       └── oqto-logo.svg
├── src/
│   └── server.ts        # Development server
├── scripts/
│   ├── build.ts         # Production build
│   └── preview.ts       # Preview production build
├── dist/                # Build output (generated)
├── package.json
├── tsconfig.json
└── biome.json           # Strict linting configuration
```

## Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Type checking
bun run typecheck

# Linting
bun run lint

# Format code
bun run format
```

## Building

```bash
# Create production build
bun run build

# Preview production build
bun run preview
```

The build output is in `./dist` and includes:
- Minified JavaScript
- Copied static assets
- Ready for deployment

## Content Sections

1. **Hero**: Install command, CTA buttons, animated terminal
2. **Architecture**: Visual diagram of the system architecture
3. **Features**: 6 key features with icons (Chat, Files, Terminal, Memory, Tasks, Canvas)
4. **Acknowledgments**: Pay tribute to Pi Agent, Claude Code, and other inspirations
5. **Documentation**: Quick links to guides and API reference

## Design Decisions

- **No framework**: Plain TypeScript for maximum performance and simplicity
- **CSS Variables**: Easy theming without preprocessors
- **CSS-only icons**: No icon font dependencies, inline SVGs
- **System fonts**: Inter and JetBrains Mono from Google Fonts
- **Mobile-first**: Responsive design that scales up

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Modern mobile browsers

## License

Proprietary - ByteOwlz
