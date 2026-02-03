'use client';

import { CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';

interface LeaveRequest {
  id: string;
  leaveType: string;
  start: string;
  end: string;
  noDays: number;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  appliedDate?: string;
}

interface RequestCardProps {
  request: LeaveRequest;
}

export default function RequestCard({ request }: RequestCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          icon: CheckCircle,
          label: 'APPROVED',
        };
      case 'PENDING':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          icon: Clock,
          label: 'PENDING',
        };
      case 'REJECTED':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          icon: XCircle,
          label: 'REJECTED',
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-800',
          icon: AlertCircle,
          label: 'Unknown',
        };
    }
  };

  const getLeaveTypeColor = (type: string) => {
    switch (type) {
      case 'SICK':
        return 'border-red-200 bg-red-50';
      case 'CASUAL':
        return 'border-blue-200 bg-blue-50';
      case 'EARNED':
        return 'border-green-200 bg-green-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getLeaveTypeIcon = (type: string) => {
    switch (type) {
      case 'SICK':
        return '🏥';
      case 'CASUAL':
        return '🌴';
      case 'EARNED':
        return '🎯';
      default:
        return '📋';
    }
  };

  const statusBadge = getStatusBadge(request.status);
  const StatusIcon = statusBadge.icon;

  return (
    <div className={`rounded-xl border-2 p-6 ${getLeaveTypeColor(request.leaveType)} transition-all hover:shadow-lg`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{getLeaveTypeIcon(request.leaveType)}</div>
          <div>
            <h3 className="text-lg font-bold text-foreground">
              {request.leaveType}
            </h3>
            <p className="text-sm text-muted-foreground">
              {request.noDays} {request.noDays === 1 ? 'Day' : 'Days'}
            </p>
          </div>
        </div>
        <div
          className={`flex items-center gap-2 px-3 py-1 rounded-full ${statusBadge.bg} ${statusBadge.text} text-sm font-medium`}
        >
          <StatusIcon className="w-4 h-4" />
          {statusBadge.label}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 py-4 border-y border-current/10">
        <div>
          <p className="text-xs text-muted-foreground uppercase font-medium mb-1">
            Start Date
          </p>
          <p className="text-sm font-semibold text-foreground">
            {new Date(request.start).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground uppercase font-medium mb-1">
            End Date
          </p>
          <p className="text-sm font-semibold text-foreground">
            {new Date(request.end).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>

      {request.appliedDate && (
        <p className="text-xs text-muted-foreground">
          Applied on{' '}
          {new Date(request.appliedDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
      )}
    </div>
  );
}
