// Error handling utilities
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const handleError = (error: any) => {
  if (error instanceof AppError) {
    return { error: error.message, statusCode: error.statusCode };
  }
  
  if (error.response?.data) {
    return { error: error.response.data.message || 'An error occurred', statusCode: error.response.status };
  }
  
  return { error: error.message || 'An unexpected error occurred', statusCode: 500 };
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  // Nigerian phone number validation
  const re = /^(\+234|0)[0-9]{10}$/;
  return re.test(phone.replace(/\s/g, ''));
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 number
  return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
};

// Format utilities
export const formatCurrency = (amount: number, currency: string = '₦'): string => {
  return `${currency}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `+234${cleaned.slice(1)}`;
  }
  return phone;
};

export const truncateString = (str: string, length: number): string => {
  return str.length > length ? str.slice(0, length) + '...' : str;
};

// Date utilities
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Request utilities
export const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Random utilities
export const generateReference = (): string => {
  return `VD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateTransactionRef = (): string => {
  return `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Safe JSON parse
export const safeJsonParse = (data: string, fallback: any = {}) => {
  try {
    return JSON.parse(data);
  } catch {
    return fallback;
  }
};
