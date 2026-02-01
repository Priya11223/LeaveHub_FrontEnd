'use client';

export default function CalendarDecorations() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Floating calendar elements */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute animate-float-up"
          style={{
            left: `${10 + i * 12}%`,
            top: `${20 + (i % 3) * 30}%`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${3 + i * 0.2}s`,
          }}
        >
          {i % 2 === 0 ? (
            <svg
              className="h-8 w-8 text-accent/20 drop-shadow-lg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M7 3h10v1H7V3zm0 3h10v1H7V6z"/>
              <rect x="3" y="2" width="18" height="18" rx="1" fill="none" stroke="currentColor" strokeWidth="1"/>
              <line x1="9" y1="8" x2="9" y2="16" stroke="currentColor" strokeWidth="0.5" opacity="0.5"/>
              <line x1="15" y1="8" x2="15" y2="16" stroke="currentColor" strokeWidth="0.5" opacity="0.5"/>
            </svg>
          ) : (
            <svg
              className="h-8 w-8 text-accent/20 drop-shadow-lg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="1" fill="currentColor"/>
              <circle cx="18" cy="12" r="1" fill="currentColor"/>
              <circle cx="6" cy="12" r="1" fill="currentColor"/>
              <circle cx="12" cy="6" r="1" fill="currentColor"/>
              <circle cx="12" cy="18" r="1" fill="currentColor"/>
              <circle cx="18" cy="6" r="1" fill="currentColor"/>
              <circle cx="6" cy="18" r="1" fill="currentColor"/>
            </svg>
          )}
        </div>
      ))}

      {/* Decorative circles in corners */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 animate-pulse-soft" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 animate-pulse-soft" style={{ animationDuration: '5s', animationDelay: '1s' }} />
    </div>
  );
}
