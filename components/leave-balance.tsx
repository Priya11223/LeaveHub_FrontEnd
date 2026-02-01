'use client';

import CircularProgress from './circular-progress';

interface LeaveBalanceCardProps {
  leaveType: string;
  remainingDays: number;
  maxDays: number;
  onViewDetails?: () => void;
  onRequest?: () => void;
}

export default function LeaveBalanceCard({
  leaveType,
  remainingDays,
  maxDays,
  onViewDetails,
  onRequest,
}: LeaveBalanceCardProps) {
  const getCardBorderColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'SICK':
        return 'border-red-200';
      case 'CASUAL':
        return 'border-blue-200';
      case 'EARNED':
        return 'border-green-200';
      default:
        return 'border-orange-200';
    }
  };

  const getIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'SICK':
        return '🏥';
      case 'CASUAL':
        return '🎉';
      case 'EARNED':
        return '⭐';
      default:
        return '📅';
    }
  };

  return (
    <div
      onClick={onViewDetails}
      className={`bg-white rounded-2xl border-2 ${getCardBorderColor(
        leaveType
      )} p-8 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-center gap-6 ${
        onViewDetails ? 'cursor-pointer hover:scale-105' : ''
      }`}
    >
      {/* Icon and title */}
      <div className="flex items-center gap-3">
        <span className="text-4xl">{getIcon(leaveType)}</span>
        <div>
          <h3 className="text-lg font-bold text-foreground">{leaveType}</h3>
          <p className="text-xs text-muted-foreground">Leave Balance</p>
        </div>
      </div>

      {/* Circular progress */}
      <CircularProgress
        remainingDays={remainingDays}
        maxDays={maxDays}
        leaveType={leaveType}
      />

      {/* Stats */}
      <div className="w-full border-t pt-4 mt-2">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Total Allocation</span>
          <span className="font-semibold text-foreground">{maxDays} days</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span className="text-muted-foreground">Used</span>
          <span className="font-semibold text-foreground">
            {maxDays - remainingDays} days
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Remaining</span>
          <span className="font-bold text-primary">{remainingDays} days</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full mt-2 group/progress">
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden transition-all duration-300 ease-out group-hover/progress:h-3 group-hover/progress:shadow-inner">
          <div
            className="bg-primary h-full rounded-full transition-all duration-300 group-hover/progress:brightness-110"
            style={{
              width: `${(remainingDays / maxDays) * 100}%`,
            }}
          />
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRequest?.();
        }}
        className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium shadow-sm hover:shadow-md hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 ease-out"
      >
        Request
      </button>
    </div>
  );
}
