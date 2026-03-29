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
          navigate('/guardian-link'); // Redirect minors to link a parent
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
    <div className="onboarding-card">
      <h2>Complete Your Profile</h2>
      <p>Sparknet requires a few more details to keep our community safe.</p>

      <form onSubmit={handleSubmit}>
        {/* Username Selection */}
        <div className="form-group">
          <label>Choose a Username</label>
          <input
            type="text"
            placeholder="e.g. nithiish_cool"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
          />
        </div>

        {/* Date of Birth */}
        <div className="form-group">
          <label>Date of Birth *</label>
          <input
            type="date"
            required
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
          />
        </div>

        {/* Terms and Conditions */}
        <div className="form-check">
          <input
            type="checkbox"
            id="terms"
            required
            checked={formData.termsAccepted}
            onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
          />
          <label htmlFor="terms"> I agree to the Terms of Service and Privacy Policy</label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Start Exploring Sparknet"}
        </button>
      </form>
    </div>
  );
};

export default OnboardingPage;
