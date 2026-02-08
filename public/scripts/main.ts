/**
 * Theme management — uses .dark class on <html> (matches Octo app)
 */
const THEME_KEY = "octo-theme";
type Theme = "light" | "dark";

function getStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "light" || stored === "dark") {
      return stored;
    }
  } catch {
    // localStorage unavailable
  }
  return null;
}

function getSystemTheme(): Theme {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

function getInitialTheme(): Theme {
  return getStoredTheme() ?? getSystemTheme();
}

function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
    root.style.background = "#222624";
    root.style.colorScheme = "dark";
  } else {
    root.classList.remove("dark");
    root.style.background = "#f2f5f3";
    root.style.colorScheme = "light";
  }
}

function setTheme(theme: Theme): void {
  applyTheme(theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // localStorage unavailable
  }
}

function toggleTheme(): void {
  const isDark = document.documentElement.classList.contains("dark");
  setTheme(isDark ? "light" : "dark");
}

/**
 * Copy to clipboard
 */
async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }
}

/**
 * Initialize
 */
function init(): void {
  // Apply theme (inline script already set .dark, but this ensures full state)
  applyTheme(getInitialTheme());

  // Theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // Copy install command
  const copyButton = document.querySelector(".hero__copy");
  const commandElement = document.querySelector(".hero__command");

  if (copyButton && commandElement) {
    copyButton.addEventListener("click", async () => {
      const text = commandElement.textContent || "";
      await copyToClipboard(text);

      const originalHTML = copyButton.innerHTML;
      copyButton.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      `;

      setTimeout(() => {
        copyButton.innerHTML = originalHTML;
      }, 2000);
    });
  }

  // Listen for system theme changes (only if user hasn't explicitly chosen)
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => {
      if (!getStoredTheme()) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });

  // Smooth scroll for anchor links
  for (const anchor of document.querySelectorAll('a[href^="#"]')) {
    anchor.addEventListener("click", (e: Event) => {
      const href = (anchor as HTMLAnchorElement).getAttribute("href");
      if (href && href !== "#") {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
