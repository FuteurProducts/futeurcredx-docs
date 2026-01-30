/**
 * Session Timeout Warning Component
 * Displays warning modal before session expires
 */

import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { useCallback, useState } from 'react';
import { Clock, RefreshCw } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useNavigate } from 'react-router-dom';

interface SessionTimeoutWarningProps {
  warningMinutes?: number;
  timeoutMinutes?: number;
}

export function SessionTimeoutWarning({
  warningMinutes = 5,
  timeoutMinutes = 30,
}: SessionTimeoutWarningProps) {
  const navigate = useNavigate();
  const [showWarning, setShowWarning] = useState(false);

  const handleWarning = useCallback(() => {
    setShowWarning(true);
  }, []);

  const handleTimeout = useCallback(() => {
    setShowWarning(false);
    navigate('/login');
  }, [navigate]);

  const { minutesRemaining, extendSession } = useSessionTimeout({
    warningMinutes,
    timeoutMinutes,
    onWarning: handleWarning,
    onTimeout: handleTimeout,
  });

  const handleExtend = async () => {
    await extendSession();
    setShowWarning(false);
  };

  const handleLogout = () => {
    setShowWarning(false);
    navigate('/login');
  };

  return (
    <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-warning" />
            Session Expiring Soon
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your session will expire in{' '}
            <span className="font-semibold text-foreground">
              {minutesRemaining} minute{minutesRemaining !== 1 ? 's' : ''}
            </span>{' '}
            due to inactivity. Would you like to extend your session?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleLogout}>
            Log Out
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleExtend} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Extend Session
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default SessionTimeoutWarning;
