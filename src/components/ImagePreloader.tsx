import { useImagePreloader } from '@/hooks/useImagePreloader';

export default function ImagePreloader() {
  const { isLoading, progress } = useImagePreloader();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-br from-[#0E0E10] via-[#1a1a1a] to-[#0E0E10] flex items-center justify-center">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
            <div 
              className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin"
              style={{ animationDuration: '1s' }}
            ></div>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white mb-2">
            FUTEURCREDX
          </h1>
          <p className="text-gray-300 text-sm">Initializing your experience...</p>
        </div>
        
        {/* Progress bar */}
        <div className="w-80 h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-white transition-all duration-500 ease-out rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="mt-4 text-sm text-gray-400">
          {progress < 100 ? `Loading assets... ${progress}%` : 'Almost ready...'}
        </div>
      </div>
    </div>
  );
}

