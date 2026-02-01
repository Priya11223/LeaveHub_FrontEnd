'use client';

import { useState } from 'react';
import { ChevronDown, LogOut, Bell } from 'lucide-react';
import KanbanCalendar from '@/components/kanban-calendar';

export default function CalendarPage() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Sample user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@company.com',
  };

  const userInitials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* User Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-orange-600 flex items-center justify-center text-white font-bold text-lg">
              {userInitials}
            </div>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-foreground">{user.name}</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="w-6 h-6 text-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full"></span>
            </button>

            {/* Leave Requests Button */}
            <button className="px-6 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors active:scale-95">
              Leave Requests
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                <span className="text-sm font-medium text-foreground">Menu</span>
                <ChevronDown
                  className={`w-5 h-5 text-foreground transition-transform ${
                    isDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-border rounded-lg shadow-xl z-50">
                  <button className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center gap-2 text-foreground">
                    <span>Profile</span>
                  </button>
                  <button className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center gap-2 text-foreground">
                    <span>Settings</span>
                  </button>
                  <hr className="my-2 border-border" />
                  <button className="w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center gap-2 text-destructive">
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Calendar</h2>
          <p className="text-muted-foreground">
            Select dates to request or view your leave applications
          </p>
        </div>

        {/* Kanban Calendar */}
        <KanbanCalendar />
      </main>
    </div>
  );
}