'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ManagerRequestCard from '@/components/manager-request-card';
import { ChevronDown, Bell, LogOut, Loader2 } from 'lucide-react';
import { useUser } from '@/lib/user-context';
import UserNotFound from '@/components/UserNotFound';

interface PendingRequest {
  id: string;
  employeeName: string;
  employeeId: string;
  leaveType: string;
  start: string;
  end: string;
  noDays: number;
  appliedOn: string
}

// Sample pending requests data
const initialRequests: PendingRequest[] = [];

export default function ManagerPage() {
  const router = useRouter();
  const { user : contextUser} = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>(initialRequests);

  const user = {
    name : contextUser?.name as string ?? 'USER',
    email : contextUser?.email as string ?? '',
    jwt : contextUser?.jwt as string ?? '' 
  }

  const handleAccept = async (id: string) => {
    try{
        const res = await fetch(`http://localhost:8080/manage/requests/${id}/approve`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${user.jwt}`,
              'Content-Type': 'application/json',
            },
          });
        if(!res.ok) throw new Error('Problem with request');
        setPendingRequests((requests) => requests.filter((req) => req.id !== id));
    } catch (err){
        console.log('Request already handled or error as ' + err);
    }
  };

  const handleReject = async (id: string) => {
    try{
        const res = await fetch(`http://localhost:8080/manage/requests/${id}/reject`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${user.jwt}`,
              'Content-Type': 'application/json',
            },
          });
        if(!res.ok) throw new Error('Problem with request');
        setPendingRequests((requests) => requests.filter((req) => req.id !== id));
    } catch (err){
        console.log('Request already handled or error as ' + err);
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("leave-tracker-user");
    router.replace("/");
  }

  useEffect(() => {
    if (!user.jwt) return;

    async function fetchRequests() {
      try {
        setLoading(true);
        const res = await fetch('http://localhost:8080/manage/users/pending', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${user.jwt}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error('Failed to fetch leave balance');
        const data: PendingRequest[] = await res.json();
        setPendingRequests(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log('error is ' + err)
        setPendingRequests([]);
      } finally {
        setLoading(false);
      }
    }
    fetchRequests();
  }, [user.jwt]);

  return user.jwt == '' ? <UserNotFound/> : (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left section with back button and title */}
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent animate-slide-in-left">
                  Pending Leave Requests
                </h1>
                <p className="text-sm text-muted-foreground animate-fade-in">
                  {pendingRequests.length} requests awaiting approval
                </p>
              </div>
            </div>

            {/* User info and actions */}
            <div className="flex items-center gap-6">
              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors"
                  aria-label="User menu"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {user.name.split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border p-2 z-10">
                    <hr className="my-2 border-border" />
                    <button 
                        onClick={() => handleLogOut()}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 rounded-lg text-sm font-medium text-red-600 flex items-center gap-2 transition-colors">
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
      <main className="max-w-7xl mx-auto px-6 py-8">
      {loading ? (
            <div className="col-span-full flex items-center justify-center gap-2 py-12 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading leave balance...</span>
            </div>
          ) : 
        pendingRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pendingRequests.map((request, index) => (
              <div
                key={request.id}
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
                className="animate-slide-in-left"
              >
                <ManagerRequestCard
                  id={request.id}
                  employeeName={request.employeeName}
                  employeeId={request.employeeId}
                  leaveType={request.leaveType}
                  start={request.start}
                  end={request.end}
                  noDays={request.noDays}
                  appliedOn={request.appliedOn}
                  onAccept={handleAccept}
                  onReject={handleReject}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 animate-fade-in">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">All caught up!</h2>
            <p className="text-muted-foreground">
              There are no pending leave requests at the moment.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
