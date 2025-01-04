// src/components/shared/LoadingSpinner.tsx
interface LoadingSpinnerProps {
  size?: 'small' | 'default' | 'large';
  className?: string;
}

export function LoadingSpinner({ size = 'default', className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    default: 'w-5 h-5',  // Matches existing loading-spinner size
    large: 'w-8 h-8 border-[3px]'
  };

  return (
    <span className={`loading-spinner ${sizeClasses[size]} ${className}`} />
  );
}
