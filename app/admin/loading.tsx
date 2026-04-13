export default function AdminLoading() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-12 h-12 rounded-full border-4 border-brand-teal/20 border-t-brand-teal animate-spin" />
          <div className="w-6 h-6 rounded-full bg-brand-teal/30 animate-pulse flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-brand-teal" />
          </div>
        </div>
        <p className="text-sm text-gray-400 font-medium">Loading panel…</p>
      </div>
    </div>
  );
}
