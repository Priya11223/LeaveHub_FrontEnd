'use client';

import { useState, useEffect } from 'react';
import LeaveBalanceCard from '@/components/leave-balance';
import { ChevronDown, Calendar, LogOut, Loader2, AlertCircle } from 'lucide-react';
import { useUser } from '@/lib/user-context';
import { useRouter } from 'next/navigation';
import UserNotFound from '@/components/UserNotFound';

interface LeaveBalance {
  leaveType: string;
  remainingDays: number;
  maxDays: number;
}

export default function DashboardPage() {
  const { user: contextUser } = useUser();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState<string | null>(null);
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use context user with fallbacks for display
  const userName = (contextUser?.name as string) ?? 'User';
  const userEmail = (contextUser?.email as string) ?? '';
  const token = (contextUser?.jwt as string) ?? '';

  useEffect(() => {
    if (!token) return;

    async function fetchLeaveBalance() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('http://localhost:8080/api/balance/all', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('Failed to fetch leave balance');
        const data: LeaveBalance[] = await res.json();
        setLeaveBalances(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
        setLeaveBalances([]);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaveBalance();
  }, [token]);

  const handleCardClick = (leaveType: string) => {
    setSelectedLeaveType(leaveType);
    console.log('[v0] Leave card clicked:', leaveType);
    // You can add navigation or modal logic here
  };

  const handleLogOut = () => {
    localStorage.removeItem("leave-tracker-user")

    router.replace("/")
  }

  const handleRequestHistory = () => {
    router.push("/dashboard/requests");
  }

  const handleRequest = (leaveType: string) => {
    console.log('[v0] Request clicked:', leaveType);
    router.push(`/dashboard/calendar?leaveType=${encodeURIComponent(leaveType)}`);
    // You can add navigation or modal logic here
  };

  return token == '' ? <UserNotFound/> : (
    <div className="min-h-screen bg-linear-to-br from-background to-muted">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">LeaveHub</h1>
                <p className="text-xs text-muted-foreground">Leave Management</p>
              </div>
            </div>

            {/* User info and actions */}
            <div className="flex items-center gap-6">
              {/* Leave Requests Button */}
              <button
                className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
                aria-label="View leave requests"
                onClick={() => handleRequestHistory()}
              >
                <Calendar className="w-4 h-4" />
                Requests History
              </button>

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="true"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                    {userName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-sm font-semibold text-foreground">
                      {userName}
                    </p>
                    <p className="text-xs text-muted-foreground">{userEmail}</p>
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
                    <button 
                      onClick={() => handleLogOut()}
                      className="w-full text-left px-4 py-2 hover:bg-destructive/10 text-destructive text-sm flex items-center gap-2 transition-colors border-t border-border mt-2">
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
        {/* Welcome Section */}
        <div className="mb-12 animate-slide-in-left">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {userName.split(' ')[0]}!
          </h2>
          <p className="text-muted-foreground">
            Here's your leave balance overview for this year
          </p>
        </div>

        {/* Leave Balance Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {loading && (
            <div className="col-span-full flex items-center justify-center gap-2 py-12 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading leave balance...</span>
            </div>
          )}
          {error && !loading && (
            <div className="col-span-full flex flex-col items-center justify-center gap-3 py-12 rounded-2xl bg-destructive/10 border border-destructive/20">
              <AlertCircle className="w-10 h-10 text-destructive" />
              <p className="text-destructive font-medium">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-destructive/20 hover:bg-destructive/30 text-destructive rounded-lg text-sm font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          )}
          {!loading && !error && leaveBalances.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No leave balance data available.
            </div>
          )}
          {!loading && !error &&
            leaveBalances.map((balance, index) => (
              <div
                key={balance.leaveType}
                className="animate-fade-in"
                style={{
                  animationDelay: `${index * 150}ms`,
                }}
              >
                <LeaveBalanceCard
                  leaveType={balance.leaveType}
                  remainingDays={balance.remainingDays}
                  maxDays={balance.maxDays}
                  onViewDetails={() => handleCardClick(balance.leaveType)}
                  onRequest={() => handleRequest(balance.leaveType)}
                />
              </div>
            ))}
        </div>

        {/* Quick Actions Section */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-border animate-slide-in-right">
          <h3 className="text-xl font-bold text-foreground mb-6">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <button className="p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground font-medium text-sm">
              View History
            </button>
            <button className="p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground font-medium text-sm">
              Calendar View
            </button>
            <button className="p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground font-medium text-sm">
              Download Report
            </button>
            <button className="p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground font-medium text-sm">
              Guidelines
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
