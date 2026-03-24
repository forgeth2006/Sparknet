import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    interests: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // 1. Fetch current data on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/api/profiles/me');
        const { profile } = data.data;
        setFormData({
          displayName: profile.displayName || '',
          bio: profile.bio || '',
          location: profile.location || '',
          interests: profile.interests?.join(', ') || '',
        });
        setLoading(false);
      } catch (err) {
        console.error("Error loading profile", err);
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setAvatar(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('displayName', formData.displayName);
    data.append('bio', formData.bio);
    data.append('location', formData.location);
    data.append('interests', formData.interests.split(',').map(i => i.trim()));
    if (avatar) data.append('avatar', avatar);

    try {
      await axios.put('/api/profiles/update', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Failed to update profile.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      {message && <p className="mb-4 text-blue-600">{message}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Display Name</label>
          <input type="text" name="displayName" value={formData.displayName} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        
        <div>
          <label className="block text-sm font-medium">Bio</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} className="w-full border p-2 rounded" rows="3" />
        </div>

        <div>
          <label className="block text-sm font-medium">Profile Picture</label>
          <input type="file" onChange={handleFileChange} className="w-full" />
        </div>

        <div>
          <label className="block text-sm font-medium">Interests (comma separated)</label>
          <input type="text" name="interests" value={formData.interests} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Coding, Cooking, Sports" />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;