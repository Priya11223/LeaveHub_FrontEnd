'use client';

import React from "react"
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/user-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';


interface SignUpFormProps {
  onSwitchToLogIn?: () => void;
}

export default function SignupForm({onSwitchToLogIn}: SignUpFormProps) {
  const router = useRouter();
  const { setUser } = useUser();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailAlreadyExists, setEmailAlreadyExists] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    try {
      setIsLoading(true);
      const res = await axios.post('http://localhost:8080/user/signIn', formData);
      setUser(res.data as Record<string, unknown>);
      setIsLoading(false);
      router.push('/dashboard');
    } catch (error) {
      setIsLoading(false);
      formData.fullName = '';
      formData.email = '';
      formData.password = '';
      formData.confirmPassword = '';
      setEmailAlreadyExists(true);
      setTimeout(() => {
        setEmailAlreadyExists(false);
      }, 5000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Full Name Field */}
      <div className="space-y-2">
        <Label htmlFor="fullName" className="text-foreground font-medium">
          Full Name
        </Label>
        <div className="relative">
          <Input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="pl-4 py-2.5 border-border focus:ring-2 focus:ring-accent/50 transition-all"
          />
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-foreground font-medium">
          Email Address
        </Label>
        <div className="relative">
          <Input
            id="signup-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="pl-4 py-2.5 border-border focus:ring-2 focus:ring-accent/50 transition-all"
          />
          <svg
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="signup-password" className="text-foreground font-medium">
          Password
        </Label>
        <div className="relative">
          <Input
            id="signup-password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            required
            className="pl-4 py-2.5 border-border focus:ring-2 focus:ring-accent/50 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirm-password" className="text-foreground font-medium">
          Confirm Password
        </Label>
        <div className="relative">
          <Input
            id="confirm-password"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            className="pl-4 py-2.5 border-border focus:ring-2 focus:ring-accent/50 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showConfirmPassword ? (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            ) : (
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Terms Agreement */}
      <div className="flex items-start gap-2 pt-2">
        <label htmlFor="terms" className="text-xs text-muted-foreground leading-tight cursor-pointer">
          Read the {' '}
          <a href="#" className="text-accent hover:text-accent/80 transition-colors font-medium">
            Terms & Conditions
          </a>{' '}
          and{' '}
          <a href="#" className="text-accent hover:text-accent/80 transition-colors font-medium">
            Privacy Policy
          </a>
        </label>
      </div>

      {/* Email already used */}
      <div className="flex justify-center">
        {emailAlreadyExists && (
          <p className="text-destructive font-semibold text-lg">Email already exists</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-accent hover:bg-accent/90 text-white font-semibold transition-all duration-200 disabled:opacity-70"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Creating account...
          </div>
        ) : (
          'Create Account'
        )}
      </Button>

      {/* Sign In Link */}
      <p className="text-center text-sm text-muted-foreground pt-2">
        Already have an account?{' '}
        <button 
        type="button" 
        onClick={onSwitchToLogIn}
        className="font-semibold text-accent hover:text-accent/80 transition-colors">
          Sign in
        </button>
      </p>
    </form>
  );
}
