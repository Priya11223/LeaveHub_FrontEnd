'use client';

import React from 'react';
import { CheckCircle2, XCircle, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ManagerRequestCardProps {
  id: string;
  employeeName: string;
  employeeId: string;
  leaveType: string;
  start: string;
  end: string;
  noDays: number;
  appliedOn: string;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

const getLeaveTypeColor = (type: string) => {
  switch (type.toUpperCase()) {
    case 'SICK':
      return 'bg-red-100 text-red-700 border-red-300';
    case 'CASUAL':
      return 'bg-blue-100 text-blue-700 border-blue-300';
    case 'EARNED':
      return 'bg-green-100 text-green-700 border-green-300';
    default:
      return 'bg-primary/10 text-primary border-primary/30';
  }
};

const getLeaveTypeEmoji = (type: string) => {
  switch (type.toUpperCase()) {
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

export default function ManagerRequestCard({
  id,
  employeeName,
  employeeId,
  leaveType,
  start,
  end,
  noDays,
  appliedOn,
  onAccept,
  onReject,
}: ManagerRequestCardProps) {
  return (
    <div className="bg-white rounded-2xl border-2 border-border p-6 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 group">
      {/* Header with Employee Info */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {employeeName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-foreground">{employeeName}</p>
            <p className="text-sm text-muted-foreground">ID: {employeeId}</p>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium border ${getLeaveTypeColor(
            leaveType
          )}`}
        >
          {getLeaveTypeEmoji(leaveType)} {leaveType}
        </span>
      </div>

      {/* Date and Days Info */}
      <div className="space-y-3 mb-6 pb-6 border-b border-border">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">From:</span>
          <span className="font-medium text-foreground">{start}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">To:</span>
          <span className="font-medium text-foreground">{end}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Duration:</span>
          <span className="font-bold text-lg text-primary">{noDays}</span>
          <span className="text-muted-foreground">days</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Applied on:</span>
          <span className="font-medium text-foreground">{appliedOn}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => onAccept(id)}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
        >
          <CheckCircle2 className="w-4 h-4" />
          Accept
        </button>
        <button
          onClick={() => onReject(id)}
          className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 active:scale-95"
        >
          <XCircle className="w-4 h-4" />
          Reject
        </button>
      </div>
    </div>
  );
}
