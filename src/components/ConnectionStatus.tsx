import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useRealTime } from '../hooks/useRealTime';

interface ConnectionStatusProps {
  showText?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  size?: 'sm' | 'md' | 'lg';
}

export function ConnectionStatus({ 
  showText = true, 
  position = 'top-right',
  size = 'md' 
}: ConnectionStatusProps) {
  const { connectionStatus, isOnline, isConnected } = useRealTime({ autoConnect: true });

  const getStatusConfig = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        color: 'text-red-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        text: 'Offline',
        message: 'No internet connection'
      };
    }

    switch (connectionStatus) {
      case 'connected':
        return {
          icon: Wifi,
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          text: 'Connected',
          message: 'Real-time sync active'
        };
      case 'connecting':
        return {
          icon: AlertCircle,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          text: 'Connecting',
          message: 'Establishing connection...'
        };
      case 'error':
        return {
          icon: AlertCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          text: 'Error',
          message: 'Connection failed'
        };
      default:
        return {
          icon: WifiOff,
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          text: 'Disconnected',
          message: 'Real-time sync disabled'
        };
    }
  };

  const statusConfig = getStatusConfig();
  const Icon = statusConfig.icon;

  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50`}>
      <div className={`
        flex items-center gap-2 px-3 py-2 rounded-lg border
        ${statusConfig.bgColor} ${statusConfig.borderColor}
        ${sizeClasses[size]}
      `}>
        <Icon className={`${statusConfig.color} ${iconSizes[size]} flex-shrink-0`} />
        {showText && (
          <div className="flex flex-col">
            <span className={`${statusConfig.color} font-medium ${textSizes[size]}`}>
              {statusConfig.text}
            </span>
            <span className={`text-gray-500 ${size === 'sm' ? 'text-xs' : 'text-xs'}`}>
              {statusConfig.message}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

// Simplified version for use in headers/navigation
export function ConnectionIndicator({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const { connectionStatus, isOnline } = useRealTime({ autoConnect: true });

  const getIndicatorConfig = () => {
    if (!isOnline) {
      return {
        color: 'bg-red-500',
        title: 'Offline'
      };
    }

    switch (connectionStatus) {
      case 'connected':
        return {
          color: 'bg-green-500',
          title: 'Connected'
        };
      case 'connecting':
        return {
          color: 'bg-yellow-500',
          title: 'Connecting'
        };
      case 'error':
        return {
          color: 'bg-red-500',
          title: 'Connection Error'
        };
      default:
        return {
          color: 'bg-gray-400',
          title: 'Disconnected'
        };
    }
  };

  const config = getIndicatorConfig();
  const dotSize = size === 'sm' ? 'w-2 h-2' : 'w-3 h-3';

  return (
    <div 
      className={`inline-flex items-center gap-2 ${size === 'sm' ? 'text-xs' : 'text-sm'}`}
      title={config.title}
    >
      <div className={`${config.color} ${dotSize} rounded-full animate-pulse`} />
      {size === 'md' && <span className="text-gray-600">{config.title}</span>}
    </div>
  );
}
