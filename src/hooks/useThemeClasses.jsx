// hooks/useThemeClasses.jsx
import { useTheme } from '../context/ThemeContext.jsx'

export const useThemeClasses = (baseClasses = '') => {
  const { theme } = useTheme()
  const darkClasses = theme === 'dark' ? 'inverted' : ''
  return `${baseClasses} ${darkClasses}`.trim()
}
// Usage
// Returns: "ui segment inverted" (dark) or "ui segment" (ligh``