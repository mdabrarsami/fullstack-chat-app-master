import { create } from "zustand";

// Helper function to update PWA theme colors
const updatePWAThemeColor = (theme) => {
  try {
    // Get theme color based on daisyUI theme
    const div = document.createElement('div');
    div.className = 'bg-primary';
    div.setAttribute('data-theme', theme);
    document.body.appendChild(div);
    const themeColor = window.getComputedStyle(div).backgroundColor;
    document.body.removeChild(div);

    // Update meta theme-color for browsers
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    metaThemeColor.content = themeColor;

    // Add iOS specific meta tags
    let metaAppleStatusBar = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
    if (!metaAppleStatusBar) {
      metaAppleStatusBar = document.createElement('meta');
      metaAppleStatusBar.name = 'apple-mobile-web-app-status-bar-style';
      document.head.appendChild(metaAppleStatusBar);
    }
    metaAppleStatusBar.content = theme.includes('dark') ? 'black-translucent' : 'default';

    // Update manifest.json dynamically through service worker
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'UPDATE_THEME',
        theme: themeColor,
        isDark: theme.includes('dark')
      });
    }
  } catch (error) {
    console.error('Error updating PWA theme:', error);
  }
};

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
    // Update PWA theme colors whenever theme changes
    updatePWAThemeColor(theme);
  },
  initTheme: () => {
    const theme = localStorage.getItem("chat-theme") || "coffee";
    // Initialize PWA theme colors on app start
    updatePWAThemeColor(theme);
    return theme;
  }
}));