import './Button.css';

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  onClick,
  type = 'button',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg'
  };

  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-danger'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        btn 
        ${variantClasses[variant]} 
        ${sizeClasses[size]} 
        ${fullWidth ? 'btn-full' : ''} 
        ${loading ? 'btn-loading' : ''}
        ${className}
      `}
    >
      {loading ? (
        <span className="btn-spinner" />
      ) : Icon ? (
        <Icon size={18} />
      ) : null}
      <span>{children}</span>
    </button>
  );
};