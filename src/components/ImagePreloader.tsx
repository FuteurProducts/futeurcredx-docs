import { useImagePreloader } from '@/hooks/useImagePreloader';

export default function ImagePreloader() {
  const { isLoading, progress } = useImagePreloader();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <div className="text-center">
        <div className="mb-4">
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">
            FUTEURCREDX
          </h1>
        </div>
        
        {/* Progress bar */}
        <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="mt-2 text-sm text-gray-400">
          Loading assets... {progress}%
        </div>
      </div>
    </div>
  );
}
