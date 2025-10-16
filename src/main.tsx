import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

console.log('Environment:', import.meta.env.MODE);
console.log('Clerk Key exists:', !!PUBLISHABLE_KEY);
console.log('Clerk Key preview:', PUBLISHABLE_KEY ? `${PUBLISHABLE_KEY.substring(0, 20)}...` : 'Not found');
console.log('Using test key:', PUBLISHABLE_KEY?.startsWith('pk_test_'));

if (!PUBLISHABLE_KEY) {
  console.error('Clerk Publishable Key not found!');
  console.error('Available env vars:', Object.keys(import.meta.env));
  throw new Error('Add your Clerk Publishable Key to the .env file')
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/business-signup"
      signInUrl="/sign-in"
      signUpUrl="/register"
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: "#3b82f6",
          colorInputBackground: "#000000",
          colorInputText: "#ffffff",
          colorText: "#ffffff",
          colorInputBorder: "#ffffff",
          colorInputBorderFocus: "#ffffff",
        },
      }}
    >
      <App />
    </ClerkProvider>
  </StrictMode>
);

