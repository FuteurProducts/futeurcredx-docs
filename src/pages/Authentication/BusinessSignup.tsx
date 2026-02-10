import React, { useState } from 'react'
import { useUser, useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, MapPin, Users, ArrowRight, CheckCircle } from 'lucide-react'
import { logger } from '@/utils/logger'

const BusinessSignup: React.FC = () => {
  const { user } = useUser()
  const { getToken } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    businessName: '',
    streetAddress: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    yearFounded: new Date().getFullYear(),
    legalStruct: '',
    empCount: 1,
    phoneNum: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const legalStructures = [
    'LLC', 'Corporation', 'Partnership', 'Sole Proprietorship', 
    'S-Corp', 'C-Corp', 'Non-Profit', 'Other'
  ]

  const usStates = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ]

  // Generate a secure random password for backend (not used since we use Clerk)
  const generateSecurePassword = (): string => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const numbers = '0123456789'
    const specials = '!@#$%^&*()_+-=[]{}|;:,.<>?'

    const getSecureRandomIndex = (max: number): number => {
      const array = new Uint32Array(1);
      crypto.getRandomValues(array);
      return array[0] % max;
    };

    // Ensure at least one character from each required category
    let password = ''
    password += uppercase[getSecureRandomIndex(uppercase.length)]
    password += lowercase[getSecureRandomIndex(lowercase.length)]
    password += numbers[getSecureRandomIndex(numbers.length)]
    password += specials[getSecureRandomIndex(specials.length)]

    // Fill remaining length with random characters
    const allChars = uppercase + lowercase + numbers + specials
    for (let i = password.length; i < 12; i++) {
      password += allChars[getSecureRandomIndex(allChars.length)]
    }

    // Fisher-Yates shuffle with crypto random
    const chars = password.split('');
    for (let i = chars.length - 1; i > 0; i--) {
      const j = getSecureRandomIndex(i + 1);
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    return chars.join('');
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      // Get a fresh token for the active session
      const token = await getToken()
      if (!token) {
        setError('Authentication required. Please sign in again.')
        return
      }

      // Prepare user data for backend - only send uncommented fields
      const userData = {
        clerkId: user?.id,
        email: user?.emailAddresses?.[0]?.emailAddress,
        password: generateSecurePassword(), // Generate secure password for backend requirement
        businessName: formData.businessName,
        streetAddress: formData.streetAddress,
        city: formData.city,
        state: formData.state.toUpperCase(), // Ensure uppercase for state validation
        zipCode: formData.zipCode,
        country: formData.country, // Default to US for now
        ownerFname: user?.firstName || '',
        userFname: user?.firstName,
        userLname: user?.lastName
      }

      // Use a CORS proxy for production or the dev proxy for local development
      let apiUrl;
      if (window.location.hostname.includes('localhost')) {
        // Local development - use Vite proxy
        apiUrl = '/api/v1/users';
      } else {
        // Production - use CORS-anywhere as a temporary proxy solution
        // Note: For a permanent solution, either:
        // 1. Configure your hosting platform to handle proxying
        // 2. Work with the backend team to enable CORS for your domain
        apiUrl = '/api/v1/users'; // Use relative URL for Vercel/Netlify rewrites
      }
      
      // Helper function to make API call with retry for 401 errors
      const makeApiCall = async (currentToken: string, retryCount = 0): Promise<Response> => {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${currentToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData)
        })
        
        // If 401 and we haven't retried yet, try with a fresh token
        if (response.status === 401 && retryCount === 0) {
          logger.warn('Token expired, retrying with fresh token...')
          const freshToken = await getToken()
          if (freshToken) {
            return makeApiCall(freshToken, 1)
          }
        }
        
        return response
      }

      const response = await makeApiCall(token)

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)
      } else {
        const errorData = await response.text()
        logger.error('Backend user creation failed:', response.status, errorData)
        
        // Check if user already exists
        if (response.status === 400 && errorData.includes('already exists')) {
          setError('✅ Account already exists! Redirecting to dashboard...')
          setTimeout(() => {
            navigate('/dashboard')
          }, 2000)
        } else if (response.status === 401) {
          setError('Authentication expired. Please sign in again.')
          // Redirect to sign in after a short delay
          setTimeout(() => {
            navigate('/sign-in')
          }, 3000)
        } else {
          setError(`Failed to create business profile: ${response.statusText}`)
        }
      }
    } catch (error) {
      logger.error('Error creating business profile:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h1 className="text-3xl font-black mb-2">Welcome to LUMIQ AI!</h1>
          <p className="text-muted-foreground mb-4">Your business profile has been created successfully.</p>
          <p className="text-sm text-muted-foreground">Redirecting to dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-black to-purple-900/20" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent" />
      
      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black uppercase tracking-tight mb-4">
              Complete Your Business Profile
            </h1>
            <p className="text-muted-foreground text-lg">
              Welcome {user?.firstName}! Let's set up your business information to complete your LUMIQ AI account.
            </p>
          </div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
          >
            {error && (
              <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Business Information */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
                  <Building2 className="w-5 h-5" />
                  Business Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Business Name *</label>
                    <input
                      type="text"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white placeholder-gray-400"
                      placeholder="Your Business Name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Legal Structure *</label>
                    <select
                      name="legalStruct"
                      value={formData.legalStruct}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white"
                    >
                      <option value="">Select Structure</option>
                      {legalStructures.map(structure => (
                        <option key={structure} value={structure} className="bg-black">
                          {structure}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Year Founded</label>
                    <input
                      type="number"
                      name="yearFounded"
                      value={formData.yearFounded}
                      onChange={handleInputChange}
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
                  <MapPin className="w-5 h-5" />
                  Business Address
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Street Address *</label>
                    <input
                      type="text"
                      name="streetAddress"
                      value={formData.streetAddress}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white placeholder-gray-400"
                      placeholder="123 Business St"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white placeholder-gray-400"
                      placeholder="City"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">State *</label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white"
                    >
                      <option value="">Select State</option>
                      {usStates.map(state => (
                        <option key={state} value={state} className="bg-black">
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white placeholder-gray-400"
                      placeholder="12345"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Country</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white"
                    >
                      <option value="US" className="bg-black">United States</option>
                      <option value="CA" className="bg-black">Canada</option>
                      <option value="GB" className="bg-black">United Kingdom</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div>
                <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
                  <Users className="w-5 h-5" />
                  Additional Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Employee Count</label>
                    <input
                      type="number"
                      name="empCount"
                      value={formData.empCount}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNum"
                      value={formData.phoneNum}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/30 text-white placeholder-gray-400"
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !formData.businessName || !formData.streetAddress || !formData.city || !formData.state || !formData.zipCode}
                className="w-full px-6 py-4 bg-card text-foreground rounded-xl hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-black uppercase tracking-wide"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    Complete Setup
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default BusinessSignup
