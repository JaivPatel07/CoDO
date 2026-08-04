import { useEffect, useState } from "react";

const THEME_STORAGE_KEY = "codo_theme";

const resolveSystemTheme = () =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const resolveAppliedTheme = (theme) => {
  if (theme === "system") {
    return resolveSystemTheme();
  }

  return theme;
};

const applyThemeToDocument = (theme) => {
  if (typeof document === "undefined") {
    return;
  }

  const appliedTheme = resolveAppliedTheme(theme);
  document.documentElement.dataset.theme = appliedTheme;
  document.documentElement.style.colorScheme = appliedTheme;
};

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "system";
    }

    return window.localStorage.getItem(THEME_STORAGE_KEY) || "system";
  });

  useEffect(() => {
    applyThemeToDocument(theme);

    if (typeof window === "undefined") {
      return undefined;
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, theme);

    if (theme !== "system") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyThemeToDocument("system");

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return {
    theme,
    setTheme,
    appliedTheme: resolveAppliedTheme(theme),
  };
}
