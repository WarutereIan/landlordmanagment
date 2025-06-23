import { useState } from 'react';
import { Phone, Lock, Droplet, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const isDevelopment = true

const Login: React.FC = () => {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const { signInWithPhone, verifyOtp, loading, error } = useAuth();

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits and ensure it starts with +254
    let cleaned = value.replace(/\D/g, '');
    
    if (cleaned.startsWith('254')) {
      cleaned = '254' + cleaned.slice(3);
    } else if (cleaned.startsWith('0')) {
      cleaned = '254' + cleaned.slice(1);
    } else if (!cleaned.startsWith('254')) {
      cleaned = '254' + cleaned;
    }
    
    return '+' + cleaned;
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedPhone = formatPhoneNumber(phoneNumber);
    setPhoneNumber(formattedPhone);
    const success = await signInWithPhone(formattedPhone);
    if (success) setStep('otp');
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await verifyOtp(phoneNumber, otp);
    if (success) {
      // Navigation will be handled automatically by the auth state change
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPhoneNumber(value);
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Droplet className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Smarta Landlord</h2>
          <p className="mt-2 text-sm text-gray-600">
            {step === 'phone' 
              ? 'Enter your phone number to continue'
              : 'Enter the verification code sent to your phone'}
          </p>
        </div>

        {isDevelopment && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-amber-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-amber-800">Development Mode</h3>
                <p className="mt-1 text-xs text-amber-700">
                  SMS is disabled. Use any 6-digit code to verify.
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="0700000000 or +254700000000"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {isDevelopment 
                  ? "Enter any Kenyan phone number for testing."
                  : "Enter your Kenyan phone number. We'll send you a verification code."
                }
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !phoneNumber.trim()}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : isDevelopment ? 'Continue' : 'Send Verification Code'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
                Verification Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  className="appearance-none rounded-lg relative block w-full px-3 py-3 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm text-center text-lg tracking-widest"
                  placeholder="000000"
                  value={otp}
                  onChange={handleOtpChange}
                  maxLength={6}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                {isDevelopment 
                  ? `Enter any 6-digit code for ${phoneNumber}`
                  : `Enter the 6-digit code sent to ${phoneNumber}`
                }
              </p>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setStep('phone');
                  setOtp('');
                }}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Use a different phone number
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login; 