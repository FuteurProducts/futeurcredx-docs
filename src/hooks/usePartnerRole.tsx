import { useUser } from '@clerk/clerk-react';

export const usePartnerRole = () => {
  const { user } = useUser();
  
  // For now, show partner dashboard to all users
  const isPartner = true;
  
  return { isPartner, user };
};


