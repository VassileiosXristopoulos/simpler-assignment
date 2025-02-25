import React from 'react'

type BaseCardProps = {
  children: React.ReactNode;
  className?: string;
}

export default function BaseCard ({ children, className = "" }: BaseCardProps) {
  return <div className={`bg-white rounded-lg shadow-md p-6 flex flex-col transform transition-transform hover:scale-[1.02] ${className}`}>
    {children}
  </div>
}
