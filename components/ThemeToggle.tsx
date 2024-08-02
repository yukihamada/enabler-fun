import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    // ここでダークモードの切り替えロジックを実装
  };

  return (
    <button onClick={toggleDarkMode}>
      {isDarkMode ? <Sun /> : <Moon />}
    </button>
  );
}