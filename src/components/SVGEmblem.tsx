import React from 'react';

interface EmblemProps {
  className?: string;
  size?: number;
  withText?: boolean;
}

export default function SVGEmblem({ className = '', size = 120, withText = false }: EmblemProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`} style={{ width: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-md select-none"
      >
        {/* Definition for text paths */}
        <defs>
          {/* Top arch for Baliakandi text */}
          <path
            id="textPathTop"
            d="M 25, 100 A 75,75 0 1,1 175, 100"
            fill="none"
          />
          {/* Bottom arch for Established/Motto text, read clockwise */}
          <path
            id="textPathBottom"
            d="M 175, 100 A 75,75 0 0,1 25, 100"
            fill="none"
          />
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>
          <linearGradient id="leafGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#15803D" />
          </linearGradient>
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0E72C8" />
            <stop offset="100%" stopColor="#0A4E9E" />
          </linearGradient>
        </defs>

        {/* Outer Golden Border Ring */}
        <circle cx="100" cy="100" r="94" fill="#FFFFFF" stroke="url(#goldGrad)" strokeWidth="4" />
        <circle cx="100" cy="100" r="88" fill="none" stroke="#15803D" strokeWidth="2" />

        {/* Outer Circular Bangla Banner Background */}
        <circle cx="100" cy="100" r="76" fill="#F8FAFC" stroke="url(#goldGrad)" strokeWidth="1.5" />

        {/* Outer Circular Bangla Text (top text) */}
        <text fontFamily="Helvetica, Arial, sans-serif" fontSize="13" fontWeight="bold" fill="#0A4E9E">
          <textPath href="#textPathTop" startOffset="50%" textAnchor="middle">
            বালিয়াকান্দি উপজেলা সমিতি, ঢাকা
          </textPath>
        </text>

        {/* Outer Circular Bangla Text (bottom text - Estd / Slogan) */}
        <text fontFamily="Helvetica, Arial, sans-serif" fontSize="11" fontWeight="600" fill="#15803D">
          <textPath href="#textPathBottom" startOffset="50%" textAnchor="middle">
            ঐক্যে শক্তি, সমাজ উন্নয়নে প্রতিশ্রুতিবদ্ধ • ২০০৮
          </textPath>
        </text>

        {/* Inner Blue Shield Base */}
        <circle cx="100" cy="100" r="62" fill="url(#blueGrad)" stroke="url(#goldGrad)" strokeWidth="3" />
        <circle cx="100" cy="100" r="56" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3,3" />

        {/* Central Green Leaf (BADC agricultural motif style) */}
        <g transform="translate(100, 100) scale(0.95)">
          {/* Leaf shapes mirroring each other */}
          <path
            d="M 0,-40 C -25,-15 -25,15 -2,32 C -1,33 1,33 2,32 C 25,15 25,-15 0,-40 Z"
            fill="url(#leafGrad)"
          />
          {/* Leaf center line */}
          <path d="M 0,-40 L 0,32" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          
          {/* Subtle leaf veins */}
          <path d="M 0,-25 Q -10,-15 -16,-10" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <path d="M 0,-25 Q 10,-15 16,-10" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <path d="M 0,-10 Q -12,0 -18,10" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <path d="M 0,-10 Q 12,0 18,10" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        </g>

        {/* Overlaid Golden Handshake (Unity Motif) */}
        <g transform="translate(100, 115) scale(0.35)">
          {/* Dark backing plate */}
          <circle cx="0" cy="0" r="42" fill="#FFFFFF" stroke="url(#goldGrad)" strokeWidth="4" />
          {/* Left sleeve */}
          <path d="M -35,-10 L -20,-15 L -15,10 L -30,15 Z" fill="#0A4E9E" />
          {/* Right sleeve */}
          <path d="M 35,-10 L 20,-15 L 15,10 L 30,15 Z" fill="#15803D" />
          {/* Left Hand */}
          <path d="M -20,-10 Q -5,-15 0,2 L -10,8 Z" fill="#FBBF24" />
          {/* Right Hand */}
          <path d="M 20,-10 Q 5,-15 0,2 L 10,8 Z" fill="#FBBF24" />
          {/* Locked fingers detail */}
          <path d="M -4,-4 L 4,5 M -3,0 L 5,9 M -5,-8 L 2,0" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" />
        </g>

        {/* Stars on left & right sides */}
        <polygon points="26,100 28,104 33,104 29,107 31,112 26,109 21,112 23,107 19,104 24,104" fill="url(#goldGrad)" />
        <polygon points="174,100 176,104 181,104 177,107 179,112 174,109 169,112 171,107 167,104 172,104" fill="url(#goldGrad)" />
      </svg>
      {withText && (
        <div className="text-center mt-3">
          <h1 className="text-xl font-bold text-dark-blue font-sans tracking-tight leading-tight">
            বালিয়াকান্দি উপজেলা সমিতি
          </h1>
          <p className="text-xs font-semibold text-brand-green tracking-wider uppercase font-mono mt-0.5">
            Dhaka, Bangladesh
          </p>
        </div>
      )}
    </div>
  );
}
