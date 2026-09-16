import React from 'react';

export const SamosaIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="samosaCrust" x1="12" y1="2" x2="12" y2="21" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="45%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <linearGradient id="samosaShine" x1="7" y1="5" x2="17" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Crispy Golden Samosa Triangle Shape */}
      <path
        d="M12 2.8C12.7 2.8 13.3 3.3 13.7 4.1L21.2 16.4C21.7 17.3 21.6 18.3 21 19.1C20.4 19.9 19.4 20.3 18.4 20.2C14.2 19.7 9.8 19.7 5.6 20.2C4.6 20.3 3.6 19.9 3 19.1C2.4 18.3 2.3 17.3 2.8 16.4L10.3 4.1C10.7 3.3 11.3 2.8 12 2.8Z"
        fill="url(#samosaCrust)"
        stroke="#b45309"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Baked Crispy Edge Fold / Pleat */}
      <path
        d="M4.5 18.8C8.5 18.2 15.5 18.2 19.5 18.8"
        stroke="#78350f"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.8"
      />

      {/* Fried Crust Highlights */}
      <path
        d="M11.8 5.2L6.2 16.5C7.8 16.1 11.5 16 14.5 16.6L12.5 5.2"
        fill="url(#samosaShine)"
        opacity="0.65"
      />

      {/* Samosa spice/crisp speckles */}
      <circle cx="10" cy="12" r="0.6" fill="#78350f" opacity="0.6" />
      <circle cx="14" cy="13.5" r="0.7" fill="#78350f" opacity="0.6" />
      <circle cx="12" cy="16" r="0.5" fill="#78350f" opacity="0.5" />
    </svg>
  );
};
