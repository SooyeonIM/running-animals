import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "font-bold rounded-full shadow-[0_4px_0_rgb(0,0,0,0.2)] active:shadow-[0_2px_0_rgb(0,0,0,0.2)] active:translate-y-[2px] transition-all border-2 border-white/50";
  
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-400",
    secondary: "bg-yellow-400 text-amber-900 hover:bg-yellow-300",
    danger: "bg-red-500 text-white hover:bg-red-400",
    success: "bg-green-500 text-white hover:bg-green-400",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-xl",
    lg: "px-10 py-5 text-3xl",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;