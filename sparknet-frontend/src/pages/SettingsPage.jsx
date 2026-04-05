import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const SettingsPage = () => {
  const { user } = useAuth();
  const [privacyMode, setPrivacyMode] = useState('public');
  const [dailyLimit, setDailyLimit] = useState(60);

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 page-enter">
      <div>
        <h1 className="font-display font-800 text-3xl text-white">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account preferences and privacy</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Privacy Settings */}
        <div className="spark-card p-6 space-y-6">
          <h2 className="font-display font-700 text-xl text-white flex items-center gap-2">
            <span>🛡️</span> Privacy
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-display font-600 text-gray-300 mb-2">Profile Visibility</label>
              <div className="space-y-2">
                {['public', 'friends', 'private'].map(mode => (
                  <label key={mode} className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${privacyMode === mode ? 'bg-spark-500/10 border-spark-500 text-spark-400' : 'bg-dark-700/50 border-dark-600 text-gray-400 hover:border-dark-500'}`}>
                    <input 
                      type="radio" 
                      name="privacy" 
                      value={mode} 
                      checked={privacyMode === mode}
                      onChange={(e) => setPrivacyMode(e.target.value)}
                      className="hidden"
                    />
                    <div className="flex-1 capitalize font-display font-500">{mode}</div>
                    {privacyMode === mode && <div className="w-3 h-3 rounded-full bg-spark-500" />}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Digital Wellbeing */}
        <div className="spark-card p-6 space-y-6">
          <h2 className="font-display font-700 text-xl text-white flex items-center gap-2">
            <span>🧘</span> Digital Wellbeing
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-display font-600 text-gray-300 mb-2">
                Daily Usage Limit (minutes)
              </label>
              <input 
                type="range" 
                min="15" 
                max="240" 
                step="15"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(Number(e.target.value))}
                className="w-full accent-spark-500"
              />
              <div className="flex justify-between text-xs font-mono text-gray-500 mt-2">
                <span>15m</span>
                <span className="text-spark-400 font-bold">{dailyLimit}m</span>
                <span>4h</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-dark-700 border border-dark-600">
              <div>
                <p className="font-display font-600 text-sm text-gray-200">Smart Breaks</p>
                <p className="text-xs text-gray-500">Remind me every 30 mins</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-dark-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-spark-500"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-4 border-t border-dark-600 pt-6">
        <button className="px-6 py-2 rounded-xl text-sm font-display font-600 text-gray-400 hover:bg-dark-700 transition-colors">
          Cancel
        </button>
        <button onClick={handleSave} className="spark-btn-primary px-8">
          Save Changes
        </button>
      </div>
    </div>
  );
};
