import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="">
        {/* Enabler DAOのブランディングを追加 */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 160" className="w-64 h-32">
          <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{stopColor:"#7fb3ec",stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:"#5c7a9e",stopOpacity:1}} />
            </linearGradient>
          </defs>

          <rect x="0" y="0" width="300" height="160" fill="url(#bgGradient)"/>
          
          <text x="150" y="50" fontFamily="Poppins, sans-serif" fontSize="28" fill="#ffffff" textAnchor="middle" fontWeight="700">
            Enabler DAO
            <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
          </text>
          
          <g transform="translate(20,65) scale(0.75)">
            <rect x="10" y="50" width="80" height="50" fill="#FF9800">
              <animate attributeName="fill" values="#FF9800;#FFA726;#FF9800" dur="2s" repeatCount="indefinite" />
            </rect>
            <polygon points="50,10 10,50 90,50" fill="#FFC107"/>
            <rect x="35" y="70" width="20" height="30" fill="#F57C00"/>
          </g>
          
          <g transform="translate(110,65) scale(0.75)">
            <path d="M50,10 L70,40 L90,40 L90,50 L70,50 L60,80 L50,80 L55,50 L10,60 L10,50 L55,40 Z" fill="#03A9F4">
              <animateTransform attributeName="transform" type="translate" values="0,0; 0,-10; 0,0" dur="2s" repeatCount="indefinite" />
            </path>
          </g>
          
          <g transform="translate(200,65) scale(0.75)">
            <rect x="10" y="50" width="80" height="30" fill="#E91E63"/>
            <rect x="20" y="35" width="50" height="20" fill="#F48FB1"/>
            <circle cx="30" cy="80" r="10" fill="#424242">
              <animateTransform attributeName="transform" type="rotate" values="0 30 80; 360 30 80" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="70" cy="80" r="10" fill="#424242">
              <animateTransform attributeName="transform" type="rotate" values="0 70 80; 360 70 80" dur="2s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>
      </div>
    </div>
  );
};

export default LoadingSpinner;