// Inline script to prevent flash of unstyled content
export const themeScript = `
(function() {
  try {
    var theme = localStorage.getItem('linkVaultTheme') || 'dark';
    document.documentElement.classList.add(theme);
    document.documentElement.setAttribute('data-theme', theme);
  } catch (e) {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`
