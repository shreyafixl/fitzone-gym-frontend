import { memo } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = memo(function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  // dark mode → show ☀️ (click to go light)
  // light mode → show 🌙 (click to go dark)
  const icon = theme === 'dark' ? '☀️' : '🌙';
  const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
});

export default ThemeToggle;
