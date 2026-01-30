const themeStorageKey = "color-pasteboard-theme";

function getPreferredTheme() {
  const stored = localStorage.getItem(themeStorageKey);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return null;
}

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function updateThemeToggle(toggleEl) {
  if (!toggleEl) {
    return;
  }
  const activeTheme = getPreferredTheme() || getSystemTheme();
  const isDark = activeTheme === "dark";
  const label = toggleEl.querySelector(".toggle-label");
  if (label) {
    label.textContent = isDark ? "Use light mode" : "Use dark mode";
  } else {
    toggleEl.textContent = isDark ? "Use light mode" : "Use dark mode";
  }
  toggleEl.dataset.active = activeTheme;
  toggleEl.setAttribute("aria-pressed", isDark.toString());
}

function setTheme(theme) {
  if (theme === "light" || theme === "dark") {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(themeStorageKey, theme);
  }
  updateThemeToggle(document.querySelector("#theme-toggle"));
}

export function initThemeToggle(toggleEl) {
  if (!toggleEl) {
    return;
  }

  const initialTheme = getPreferredTheme();
  if (initialTheme) {
    setTheme(initialTheme);
  } else {
    updateThemeToggle(toggleEl);
  }

  toggleEl.addEventListener("click", () => {
    const current = getPreferredTheme() || getSystemTheme();
    setTheme(current === "dark" ? "light" : "dark");
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (!getPreferredTheme()) {
        updateThemeToggle(toggleEl);
      }
    });
}
