import './Card.css';

export const Card = ({ 
  children, 
  title, 
  subtitle,
  icon: Icon,
  gradient = false,
  hover = false,
  className = '',
  onClick 
}) => {
  return (
    <div 
      className={`
        card 
        ${gradient ? 'card-gradient' : ''} 
        ${hover ? 'card-hover' : ''}
        ${onClick ? 'card-clickable' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      {(title || Icon) && (
        <div className="card-header">
          {Icon && (
            <div className="card-icon">
              <Icon size={24} />
            </div>
          )}
          <div>
            {title && <h3 className="card-title">{title}</h3>}
            {subtitle && <p className="card-subtitle">{subtitle}</p>}
          </div>
        </div>
      )}
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};