'use client';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gray-50 gap-5">
      {/* Spinning ring with pulsing center */}
      <div className="relative flex items-center justify-center w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-brand-teal/20 border-t-brand-teal animate-spin" />
        <div className="w-7 h-7 rounded-full bg-brand-teal/20 animate-pulse flex items-center justify-center">
          <div className="w-3.5 h-3.5 rounded-full bg-brand-teal" />
        </div>
      </div>

      {/* Staggered bouncing dots */}
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-brand-teal animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 rounded-full bg-brand-teal animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 rounded-full bg-brand-teal animate-bounce [animation-delay:300ms]" />
      </div>

      <p className="text-sm text-gray-400 font-medium tracking-wide">
        Widespread Blogs
      </p>
    </div>
  );
}
