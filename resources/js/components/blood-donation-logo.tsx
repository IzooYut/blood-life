import { FC } from 'react';

interface BloodDonationLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'full' | 'icon-only' | 'text-only';
  className?: string;
  iconClassName?: string;
  textClassName?: string;
  onClick?: () => void;
}

const BloodDonationLogo: FC<BloodDonationLogoProps> = ({
  size = 'md',
  variant = 'full',
  className = '',
  iconClassName = '',
  textClassName = '',
  onClick,
}) => {
  // Size configurations
  const sizeConfig = {
    xs: {
      icon: 'w-6 h-6',
      text: 'text-sm',
      gap: 'gap-1.5',
      cross: 'text-xs',
      crossContainer: 'w-2.5 h-2.5'
    },
    sm: {
      icon: 'w-8 h-8',
      text: 'text-base',
      gap: 'gap-2',
      cross: 'text-xs',
      crossContainer: 'w-3 h-3'
    },
    md: {
      icon: 'w-10 h-10',
      text: 'text-lg',
      gap: 'gap-2.5',
      cross: 'text-sm',
      crossContainer: 'w-3.5 h-3.5'
    },
    lg: {
      icon: 'w-12 h-12',
      text: 'text-xl',
      gap: 'gap-3',
      cross: 'text-sm',
      crossContainer: 'w-4 h-4'
    },
    xl: {
      icon: 'w-16 h-16',
      text: 'text-2xl',
      gap: 'gap-3',
      cross: 'text-base',
      crossContainer: 'w-5 h-5'
    },
    '2xl': {
      icon: 'w-20 h-20',
      text: 'text-3xl',
      gap: 'gap-4',
      cross: 'text-lg',
      crossContainer: 'w-6 h-6'
    }
  };

  const config = sizeConfig[size];

  // Blood drop icon component
  const BloodDropIcon = () => (
    <div 
      className={`${config.icon} relative shadow-lg transition-all duration-300 ${iconClassName}`}
      style={{
        background: 'linear-gradient(to bottom right, var(--color-primary), var(--color-destructive))',
        borderRadius: '50% 50% 50% 0',
        transform: 'rotate(-45deg)',
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className={`${config.crossContainer} bg-background rounded-full flex items-center justify-center shadow-inner`}
          style={{ transform: 'rotate(45deg)' }}
        >
          <span 
            className={`${config.cross} font-bold leading-none`}
            style={{ color: 'var(--color-primary)' }}
          >
            +
          </span>
        </div>
      </div>
    </div>
  );

  // Text component
  const LogoText = () => (
    <div className={`${config.text} font-bold tracking-tight select-none ${textClassName}`}>
      <span style={{ color: 'var(--color-primary)' }}>Donate</span>
      <span className="text-foreground">Life</span>
    </div>
  );

  // Render based on variant
  const renderLogo = () => {
    switch (variant) {
      case 'icon-only':
        return <BloodDropIcon />;
      case 'text-only':
        return <LogoText />;
      case 'full':
      default:
        return (
          <>
            <BloodDropIcon />
            <LogoText />
          </>
        );
    }
  };

  return (
    <div 
      className={`flex items-center ${config.gap} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {renderLogo()}
    </div>
  );
};

export default BloodDonationLogo;