import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { backendurl } from '../baseurls/baseurls';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${backendurl}/api/auth/forgotpassword`, { email });
      toast.success(res.data?.message || res.data || 'Reset link sent!');
      setSubmitted(true);
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0b0f19] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 lg:p-10 relative z-10">
        
        {/* Branding Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-500/30">
            f
          </div>
          <span className="text-xl font-bold tracking-wider text-white">facebook</span>
        </div>

        {!submitted ? (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">Find Your Account</h2>
              <p className="text-sm text-gray-400 leading-relaxed">
                Enter your registered email address and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3.5 rounded-xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-blue-600/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center space-y-4 py-4">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto border border-emerald-500/30">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-white">Check Your Email</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              We have sent a password reset link to <span className="text-white font-semibold">{email}</span>. Please check your inbox and spam folder.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs text-blue-400 hover:text-blue-300 underline pt-2"
            >
              Didn't receive email? Try again
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-800 text-center">
          <Link
            to="/"
            className="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1"
          >
            ← Back to Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ForgotPassword;