import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../api/axios'; // Your axios instance

const OnboardingPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: '', // Optional: let them change the ugly Google-generated one
    dateOfBirth: '',
    termsAccepted: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Call your completeOnboarding backend route
      const { data } = await api.patch('/oauth/complete-onboarding', formData);

      if (data.success) {
        // 2. IMPORTANT: Replace the old token with the fresh one from backend
        // This new token reflects their new role (e.g., 'child' vs 'user')
        localStorage.setItem('accessToken', data.accessToken);

        toast.success("Profile completed successfully!");

        // 3. Redirect based on the role the backend assigned
        if (data.user.role === 'child' || data.user.status === 'pending_guardian_approval') {
          navigate('/guardian'); // Redirect minors to link a parent
        } else {
          navigate('/dashboard');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Onboarding failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 py-8 px-2">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-2">Complete Your Profile</h2>
        <p className="text-center text-gray-500 mb-6">Sparknet requires a few more details to keep our community safe.</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Choose a Username</label>
            <input
              type="text"
              placeholder="e.g. nithiish_cool"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth <span className="text-red-500">*</span></label>
            <input
              type="date"
              required
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              required
              checked={formData.termsAccepted}
              onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="text-sm text-gray-700 select-none">I agree to the <a href="#" className="underline text-blue-600 hover:text-blue-800">Terms of Service</a> and <a href="#" className="underline text-blue-600 hover:text-blue-800">Privacy Policy</a></label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Start Exploring Sparknet"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;
