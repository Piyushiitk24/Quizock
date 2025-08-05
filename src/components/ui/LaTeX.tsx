import React from 'react';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface LaTeXProps {
  children: string;
  block?: boolean;
  className?: string;
}

export const LaTeX: React.FC<LaTeXProps> = ({ 
  children, 
  block = false, 
  className = '' 
}) => {
  try {
    if (block) {
      return (
        <div className={`math-container ${className}`}>
          <BlockMath math={children} />
        </div>
      );
    }
    
    return (
      <span className={`inline-math ${className}`}>
        <InlineMath math={children} />
      </span>
    );
  } catch (error) {
    // Fallback to plain text if LaTeX fails to render
    console.warn('LaTeX rendering failed:', error);
    return (
      <span className={`font-mono bg-gray-100 px-2 py-1 rounded text-gray-800 ${className}`}>
        {children}
      </span>
    );
  }
};
