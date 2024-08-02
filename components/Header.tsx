import React from 'react';
import { Menu, Moon, Sun } from 'lucide-react';
import Link from 'next/link';

interface HeaderProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  toggleMenu: () => void;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  changeLanguage: (language: string) => void;
}

export default function Header({ isDarkMode, toggleDarkMode, toggleMenu, isMenuOpen, changeLanguage }: HeaderProps) {
  return (
    <header className={`flex justify-between items-center mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} p-4 rounded-lg shadow-sm`}>
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 100" className="w-24 h-8 mr-2">
          {/* House */}
          <g transform="translate(0,0)">
            <rect x="10" y="50" width="80" height="50" fill="#FF9800">
              <animate attributeName="height" values="50;48;50" dur="2s" repeatCount="indefinite" />
            </rect>
            <polygon points="50,10 10,50 90,50" fill="#FFC107">
              <animate attributeName="points" values="50,10 10,50 90,50;50,8 10,50 90,50;50,10 10,50 90,50" dur="2s" repeatCount="indefinite" />
            </polygon>
            <rect x="35" y="70" width="20" height="30" fill="#F57C00">
              <animate attributeName="y" values="70;71;70" dur="2s" repeatCount="indefinite" />
            </rect>
          </g>
          
          {/* Airplane */}
          <g transform="translate(100,0)">
            <path d="M50,10 L70,40 L90,40 L90,50 L70,50 L60,80 L50,80 L55,50 L10,60 L10,50 L55,40 Z" fill="#03A9F4">
              <animate attributeName="d" values="M50,10 L70,40 L90,40 L90,50 L70,50 L60,80 L50,80 L55,50 L10,60 L10,50 L55,40 Z;M50,8 L70,38 L90,38 L90,48 L70,48 L60,78 L50,78 L55,48 L10,58 L10,48 L55,38 Z;M50,10 L70,40 L90,40 L90,50 L70,50 L60,80 L50,80 L55,50 L10,60 L10,50 L55,40 Z" dur="2s" repeatCount="indefinite" />
            </path>
            <circle cx="20" cy="50" r="5" fill="#FFFFFF">
              <animate attributeName="cy" values="50;51;50" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="30" cy="50" r="5" fill="#FFFFFF">
              <animate attributeName="cy" values="50;49;50" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="40" cy="50" r="5" fill="#FFFFFF">
              <animate attributeName="cy" values="50;51;50" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
          
          {/* Car */}
          <g transform="translate(200,0)">
            <rect x="10" y="50" width="80" height="30" fill="#E91E63">
              <animate attributeName="y" values="50;51;50" dur="2s" repeatCount="indefinite" />
            </rect>
            <rect x="20" y="35" width="50" height="20" fill="#F48FB1">
              <animate attributeName="y" values="35;36;35" dur="2s" repeatCount="indefinite" />
            </rect>
            <circle cx="30" cy="80" r="10" fill="#424242">
              <animate attributeName="cy" values="80;81;80" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="70" cy="80" r="10" fill="#424242">
              <animate attributeName="cy" values="80;81;80" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>
        <h2 className={`text-lg sm:text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>厳選シェアリングサービス</h2>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={toggleDarkMode}
          className={`p-1.5 rounded-md ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
          aria-label={isDarkMode ? 'ライトモードに切り替え' : 'ダークモードに切り替え'}
        >
          {isDarkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-gray-600" />}
        </button>
        <button
          onClick={toggleMenu}
          className={`p-1.5 rounded-md ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500`}
        >
          <Menu className={`h-5 w-5 ${isDarkMode ? 'text-white' : 'text-gray-600'}`} />
        </button>
        {isMenuOpen && (
          <div className={`absolute right-0 mt-1 w-40 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-md shadow-lg py-1 z-10`}>
            <Link href="/services" className={`block px-3 py-1.5 text-sm ${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
              サービス
            </Link>
            <Link href="/about" className={`block px-3 py-1.5 text-sm ${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}>
              About
            </Link>
            <div className={`border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}></div>
            <button
              onClick={() => changeLanguage('ja')}
              className={`block w-full text-left px-3 py-1.5 text-sm ${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              日本語
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className={`block w-full text-left px-3 py-1.5 text-sm ${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              English
            </button>
          </div>
        )}
      </div>
    </header>
  );
}