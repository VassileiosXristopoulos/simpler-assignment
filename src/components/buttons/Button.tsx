import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  styles?: React.CSSProperties;
  icon?: JSX.Element;
}

export function Button({ children, styles, icon, className = '', ...props }: ButtonProps) {
  return (
    <button 
      style={styles} 
      className={`inline-flex items-center gap-2 ${className}`}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
