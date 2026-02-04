'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RequestCard from '@/components/request-card';
import { ChevronDown, Calendar, LogOut, ArrowLeft, Loader2 } from 'lucide-react';
import { useUser } from '@/lib/user-context';


interface LeaveRequest {
  id: string;
  leaveType: string;
  start: string;
  end: string;
  noDays: number;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  appliedDate: string;
}

export default function RequestsPage() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const { user: contextUser } = useUser();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(false);

  // Sample user data
  const user = {
    name: contextUser?.name as string ?? 'User',
    email: contextUser?.email as string ?? '',
    jwt: contextUser?.jwt as string,
  };

  //const requests: LeaveRequest[]
  useEffect(() => {
    if (!user.jwt) return;

    async function fetchRequests() {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:8080/api/leaves/my', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${user.jwt}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('Failed to fetch leave balance');
        const data: LeaveRequest = await res.json();
        setRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log('error is ' + err);
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, [user.jwt]);

  const handleLogOut = () => {
    localStorage.removeItem("leave-tracker-user")

    router.replace("/")
  }

  const filteredRequests = filterStatus
    ? requests.filter((req) => req.status === filterStatus)
    : requests;

  const getStatusCounts = () => {
    return {
      all: requests.length,
      APPROVED: requests.filter((r) => r.status === 'APPROVED').length,
      PENDING: requests.filter((r) => r.status === 'PENDING').length,
      REJECTED: requests.filter((r) => r.status === 'REJECTED').length,
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
                    {user.name.split(' ')
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
            onClick={() => setFilterStatus('APPROVED')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              filterStatus === 'APPROVED'
                ? 'bg-green-500 text-white'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            APPROVED ({counts.APPROVED})
          </button>
          <button
            onClick={() => setFilterStatus('PENDING')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              filterStatus === 'PENDING'
                ? 'bg-blue-500 text-white'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            PENDING ({counts.PENDING})
          </button>
          <button
            onClick={() => setFilterStatus('REJECTED')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              filterStatus === 'REJECTED'
                ? 'bg-red-500 text-white'
                : 'bg-muted text-foreground hover:bg-muted/80'
            }`}
          >
            REJECTED ({counts.REJECTED})
          </button>
        </div>

        {/* Request Cards Grid */}
        {loading ? (
            <div className="col-span-full flex items-center justify-center gap-2 py-12 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading  Requests...</span>
            </div>
          ) : 
        filteredRequests.length > 0 ? (
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
