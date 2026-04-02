import React, { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  [key: string]: any;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    success: 'btn-success',
    outline: 'btn-outline',
  };
  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${
        disabled || loading ? 'btn-disabled' : ''
      } ${className}`}
      {...props}
    >
      {loading ? <span className="loader"></span> : null}
      {children}
    </button>
  );
};

interface CardProps {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', dark = false }) => {
  return <div className={`${dark ? 'card-dark' : 'card'} ${className}`}>{children}</div>;
};

interface InputProps {
  label?: string;
  error?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  [key: string]: any;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  type = 'text',
  placeholder,
  className = '',
  ...props
}) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        className={`input ${error ? 'input-error' : ''} ${className}`}
        {...props}
      />
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

interface SelectProps {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
  className?: string;
  [key: string]: any;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className = '',
  ...props
}) => {
  return (
    <div className="form-group">
      {label && <label className="form-label">{label}</label>}
      <select className={`input ${error ? 'input-error' : ''} ${className}`} {...props}>
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
};

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'gray';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  className = '',
}) => {
  const variants = {
    primary: 'badge-primary',
    success: 'badge-success',
    warning: 'badge-warning',
    danger: 'badge-danger',
    gray: 'badge-gray',
  };

  return <span className={`badge ${variants[variant]} ${className}`}>{children}</span>;
};

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  children: ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({ type = 'info', children, className = '' }) => {
  const types = {
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error',
  };

  return <div className={`alert ${types[type]} ${className}`}>{children}</div>;
};

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  return <div className={`loader ${sizes[size]} ${className}`}></div>;
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
