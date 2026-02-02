'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RequestCard from '@/components/request-card';
import { ChevronDown, Calendar, LogOut, ArrowLeft } from 'lucide-react';

interface LeaveRequest {
  id: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  status: 'approved' | 'pending' | 'rejected' | 'cancelled';
  appliedOn: string;
}

export default function RequestsPage() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // Sample user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@company.com',
    department: 'Engineering',
  };

  // Sample leave requests data
  const allRequests: LeaveRequest[] = [
    {
      id: '1',
      leaveType: 'CASUAL',
      startDate: '2026-02-10',
      endDate: '2026-02-12',
      days: 3,
      status: 'approved',
      appliedOn: '2026-01-28',
    },
    {
      id: '2',
      leaveType: 'EARNED',
      startDate: '2026-03-15',
      endDate: '2026-03-20',
      days: 6,
      status: 'pending',
      appliedOn: '2026-02-01',
    },
    {
      id: '3',
      leaveType: 'SICK',
      startDate: '2026-01-20',
      endDate: '2026-01-21',
      days: 2,
      status: 'approved',
      appliedOn: '2026-01-19',
    },
    {
      id: '4',
      leaveType: 'CASUAL',
      startDate: '2025-12-22',
      endDate: '2025-12-26',
      days: 5,
      status: 'rejected',
      appliedOn: '2025-12-01',
    },
    {
      id: '5',
      leaveType: 'EARNED',
      startDate: '2026-04-01',
      endDate: '2026-04-05',
      days: 5,
      status: 'pending',
      appliedOn: '2026-02-02',
    },
    {
      id: '6',
      leaveType: 'CASUAL',
      startDate: '2025-11-10',
      endDate: '2025-11-12',
      days: 3,
      status: 'cancelled',
      appliedOn: '2025-11-01',
    },
  ];

  const filteredRequests = filterStatus
    ? allRequests.filter((req) => req.status === filterStatus)
    : allRequests;

  const getStatusCounts = () => {
    return {
      all: allRequests.length,
      approved: allRequests.filter((r) => r.status === 'approved').length,
      pending: allRequests.filter((r) => r.status === 'pending').length,
      rejected: allRequests.filter((r) => r.status === 'rejected').length,
      cancelled: allRequests.filter((r) => r.status === 'cancelled').length,
    };
  };

  const counts = getStatusCounts();

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-muted">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and title with back button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">LeaveHub</h1>
                  <p className="text-xs text-muted-foreground">Leave Management</p>
                </div>
              </div>
            </div>

            {/* User info and actions */}
            <div className="flex items-center gap-6">
              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-semibold text-foreground">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground transition-transform ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border py-2 animate-fade-in">
                    <div className="px-4 py-2 border-b border-border mb-2">
                      <p className="text-sm font-semibold text-foreground">
                        {user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                    <button className="w-full text-left px-4 py-2 hover:bg-muted text-foreground text-sm flex items-center gap-2 transition-colors">
                      <Calendar className="w-4 h-4" />
                      Profile
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-muted text-foreground text-sm flex items-center gap-2 transition-colors">
                      <Calendar className="w-4 h-4" />
                      Settings
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-destructive/10 text-destructive text-sm flex items-center gap-2 transition-colors border-t border-border mt-2">
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title Section */}
        <div className="mb-8 animate-slide-in-left">
          <h2 className="text-4xl font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent mb-2">
            Leave Request History
          </h2>
          <p className="text-muted-foreground">
            View all your leave requests and their current status
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 animate-fade-in">
          <button
            onClick={() => setFilterStatus(null)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              filterStatus === null
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            All ({counts.all})
          </button>
          <button
            onClick={() => setFilterStatus('approved')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              filterStatus === 'approved'
                ? 'bg-green-500 text-white'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            Approved ({counts.approved})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              filterStatus === 'pending'
                ? 'bg-blue-500 text-white'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            Pending ({counts.pending})
          </button>
          <button
            onClick={() => setFilterStatus('rejected')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              filterStatus === 'rejected'
                ? 'bg-red-500 text-white'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            Rejected ({counts.rejected})
          </button>
          <button
            onClick={() => setFilterStatus('cancelled')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              filterStatus === 'cancelled'
                ? 'bg-gray-500 text-white'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            Cancelled ({counts.cancelled})
          </button>
        </div>

        {/* Request Cards Grid */}
        {filteredRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request, index) => (
              <div
                key={request.id}
                className="animate-fade-in"
                style={{
                  animationDelay: `${index * 75}ms`,
                }}
              >
                <RequestCard request={request} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-2">
              No leave requests found
            </p>
            <p className="text-sm text-muted-foreground">
              Try changing your filter to see different requests
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
