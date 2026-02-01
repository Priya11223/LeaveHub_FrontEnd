'use client';

interface CircularProgressProps {
  remainingDays: number;
  maxDays: number;
  leaveType: string;
}

export default function CircularProgress({
  remainingDays,
  maxDays,
  leaveType,
}: CircularProgressProps) {
  const percentage = (remainingDays / maxDays) * 100;
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  const getStrokeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'SICK':
        return '#ef4444';
      case 'CASUAL':
        return '#3b82f6';
      case 'EARNED':
        return '#10b981';
      default:
        return '#f97316';
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'SICK':
        return '#fee2e2';
      case 'CASUAL':
        return '#dbeafe';
      case 'EARNED':
        return '#d1fae5';
      default:
        return '#fed7aa';
    }
  };

  const strokeColor = getStrokeColor(leaveType);
  const bgColor = getBackgroundColor(leaveType);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#f0f0f0"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke={strokeColor}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>

        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-foreground">
            {remainingDays}
          </div>
          <div className="text-xs text-muted-foreground">of {maxDays}</div>
        </div>
      </div>

      {/* Label below circle */}
      <div className="mt-4 text-center">
        <p className="text-sm font-semibold text-foreground">{leaveType}</p>
        <p className="text-xs text-muted-foreground mt-1">
          {remainingDays === 0 ? 'No leaves' : `${remainingDays} day${remainingDays !== 1 ? 's' : ''} left`}
        </p>
      </div>
    </div>
  );
}
