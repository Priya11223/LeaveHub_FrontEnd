'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, LogOut, Bell } from 'lucide-react';
import KanbanCalendar from '@/components/kanban-calendar';
import { useSearchParams } from 'next/navigation';
import { useUser } from '@/lib/user-context';
import { User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ApplyLeaveRequest {
  leaveType: string | null;
  start: string | null;
  end: string | null;
}

export default function CalendarPage() {
  const { user: contextUser } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchParams = useSearchParams();
  const leaveType = searchParams.get('leaveType');
  const [requestHit, setRequestHit] = useState<boolean | null>(null);
  const router = useRouter();
  const [start, setStart] = useState<string | null>(null);
  const [end, setEnd] = useState<string | null>(null);

  const handleBack = () => {
    router.back();
  } 

  const handleRequestButton = async () => {
    try{
      const req : ApplyLeaveRequest = {
        leaveType: leaveType,
        start: start,
        end: end,
      };
      console.log(user.jwt);
      const res = await fetch('http://localhost:8080/api/leaves/apply', {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.jwt}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req)
      })
      console.log(res);
      if (res.status === 404) throw new Error('Not enough remaining days');
      setRequestHit(true);
      setTimeout(() => {
        router.back();
      }, 5000);
    } catch(e){
      console.log("Failed to request Leave " + e);
      setRequestHit(false);
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } 
  };

  // Sample user data
  const user = {
    name: contextUser?.name as string ?? "USER",
    email: contextUser?.email as string,
    jwt: contextUser?.jwt as string,
  };

  return (
    <>
    {requestHit==true && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl px-8 py-6 text-center border border-border animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-2xl font-semibold text-green-600">
              ✅ Leave Applied Successfully
            </h2>
            <p className="mt-2">
              Check Inbox to track request
            </p>
            <p className="mt-2 text-red-500">
              Redirecting in 5..
            </p>
          </div>
        </div>
      )}
    {requestHit == false && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl px-8 py-6 text-center border border-border animate-in fade-in zoom-in-95 duration-200">
            <p className="text-destructive font-semibold text-lg">Leave Request Unsucessfull</p>
            <p className="text-muted-foreground text-sm mt-1">Not enough remaining days</p>
          </div>
        </div>
      )}
    <div className="min-h-screen bg-linear-to-br from-background to-muted">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-linear-to-br from-accent to-orange-600 flex items-center justify-center text-white font-bold text-lg">
              {user.name.split(' ')
                      .map((n) => n[0])
                      .join('')}
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-foreground">{user.name}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Profile back */}
            <div className="relative">
              <button
                onClick={() => handleBack()}
                className="inline-flex items-center gap-2 cursor-pointer
                rounded-full bg-orange-600 px-4 py-2
              text-white font-medium
              hover:bg-orange-500 transition"
              >
                ← Back
              </button>
            </div>
          </div>
        </div>

        
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Calendar</h2>
          <p className="text-muted-foreground">
            {leaveType
              ? `Select range of dates for your ${leaveType} request`
              : 'Select dates to request or view your leave applications'}
          </p>
        </div>

        {/* Kanban Calendar */}
        <KanbanCalendar 
          leaveType={leaveType ?? undefined} 
          setStart={setStart}
          setEnd={setEnd}
          onRequest={() => handleRequestButton()}
        />
      </main>
    </div>
    </>
  );
}