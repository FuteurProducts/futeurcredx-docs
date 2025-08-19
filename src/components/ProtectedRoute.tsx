import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

// This component is now a wrapper around Clerk's SignedIn component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}

export default ProtectedRoute
