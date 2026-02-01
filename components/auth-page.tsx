'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from './login-form';
import SignupForm from './signup-form';
import CalendarDecorations from './calendar-decorations';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="relative min-h-screen w-full bg-background overflow-hidden">
      {/* Animated background with calendar pattern */}
      <div className="absolute inset-0 bg-linear-to-br from-background via-muted/20 to-background opacity-70">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute h-24 w-24 border border-accent/30 rounded-lg animate-pulse-soft"
              style={{
                left: `${((i * 7) % 91) + 5}%`,
                top: `${((i * 11 + 13) % 86) + 5}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating calendar icons */}
      <CalendarDecorations />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-10 w-10 bg-accent rounded-lg flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">LeaveHub</h1>
            <p className="text-muted-foreground">Manage your leaves effortlessly</p>
          </div>

          {/* Auth Card with animated background */}
          <div className="relative">
            {/* Animated gradient background */}
            <div
              className="absolute inset-0 bg-linear-to-br from-accent/10 via-accent/5 to-orange-50 rounded-xl blur-2xl animate-gradient-shift"
              style={{
                backgroundSize: '200% 200%',
              }}
            />

            {/* Card content */}
            <div className="relative bg-white/95 backdrop-blur-sm rounded-xl border border-border shadow-xl p-8">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" className="data-[state=active]:bg-accent data-[state=active]:text-white">
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="data-[state=active]:bg-accent data-[state=active]:text-white">
                    Sign Up
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="animate-fade-in">
                  <LoginForm onSwitchToSignup={() => setActiveTab('signup')} />
                </TabsContent>

                <TabsContent value="signup" className="animate-fade-in">
                  <SignupForm onSwitchToLogIn={() => setActiveTab('login')}/>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Footer info */}
          <div className="mt-8 text-center text-sm text-muted-foreground animate-slide-in-left">
            <p>Keep track of your leave requests in one place</p>
          </div>
        </div>
      </div>
    </div>
  );
}
