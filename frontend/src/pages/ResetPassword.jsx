// ResetPassword.jsx
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { backendurl } from '../baseurls/baseurls';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { id, token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post(
        `${backendurl}/api/auth/resetpassword/${id}/${token}`,
        { newPassword, confirmPassword }
      );

      toast.success(res.data?.message || res.data || 'Password reset successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data || 'Reset link invalid or expired');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0b0f19] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md bg-gray-900/60 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 lg:p-10 relative z-10">
        
        {/* Branding Header */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center font-black text-2xl shadow-lg shadow-emerald-500/30">
            f
          </div>
          <span className="text-xl font-bold tracking-wider text-white">facebook</span>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white mb-1">Choose New Password</h2>
          <p className="text-sm text-gray-400">Create a strong password for your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* New Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="w-full px-4 py-3.5 rounded-xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-sm"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-200"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
              Confirm New Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              className="w-full px-4 py-3.5 rounded-xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 text-sm"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 active:scale-[0.99] text-white font-semibold py-3.5 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-sm mt-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Reset Password'
            )}
          </button>
        </form>

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

export default ResetPassword;