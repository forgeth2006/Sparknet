import { useParams, Link } from 'react-router-dom';
import { LeaderboardTable, ProgressBar } from '../../components/challenges/ChallengeSystem';

const dummyLeaderboard = [
  { id: 1, username: 'Alex Mercer', score: 1200 },
  { id: 2, username: 'Sarah Chen', score: 1050 },
  { id: 3, username: 'John Doe', score: 980 },
  { id: 4, username: 'Jane Smith', score: 850 },
];

export const ChallengeDetailsPage = () => {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto space-y-8 page-enter">
      {/* Back link */}
      <div>
        <Link to="/challenges" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-spark-400 transition-colors">
          <span>←</span> Back to Explorer
        </Link>
      </div>

      {/* Hero */}
      <div className="relative spark-card overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-spark-500/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="p-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">💻</span>
                <span className="px-3 py-1 rounded-full bg-dark-700 border border-dark-500 text-xs font-mono text-spark-400">
                  500 pts
                </span>
                <span className="px-3 py-1 rounded-full bg-dark-700 border border-dark-500 text-xs font-mono text-purple-400">
                  Coding
                </span>
              </div>
              <h1 className="font-display font-800 text-3xl text-white mb-2">Daily Coding Streak</h1>
              <p className="text-gray-400 max-w-xl line-clamp-2">Solve one algorithmic puzzle every day for 7 days to master fundamental data structures and earn the consistent learner badge.</p>
            </div>
            <button className="spark-btn-primary px-8 py-3 w-full md:w-auto shrink-0 shadow-lg shadow-spark-500/20">
              Join Challenge
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <div className="space-y-4">
            <h2 className="font-display font-700 text-xl text-white">About this Challenge</h2>
            <div className="prose prose-invert max-w-none text-gray-400 text-sm">
              <p>This challenge is designed to build consistency in your learning journey. You'll face a new algorithmic problem every day, ranging from arrays and strings to dynamic programming.</p>
              <ul>
                <li>Submit your solution daily before midnight.</li>
                <li>Code must pass all hidden test cases.</li>
                <li>Missing a day resets your streak to 0.</li>
              </ul>
            </div>
          </div>

          {/* Submission Area */}
          <div className="spark-card p-6 border-l-4 border-l-purple-500">
            <h3 className="font-display font-700 text-lg text-white mb-4">Today's Submission</h3>
            <textarea 
              className="w-full bg-dark-800 border border-dark-600 rounded-xl p-4 text-gray-300 font-mono text-sm focus:border-purple-500 focus:outline-none min-h-[150px] mb-4"
              placeholder="Paste your solution or link here..."
            ></textarea>
            <button className="bg-purple-600 hover:bg-purple-500 text-white font-display font-600 px-6 py-2 rounded-xl transition-colors">
              Submit Entry
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="spark-card p-6 space-y-4">
             <h3 className="font-display font-700 text-lg text-white mb-2">Your Progress</h3>
             <ProgressBar progress={0} label="0 / 7 Days Completed" />
          </div>

          <div>
            <h3 className="font-display font-700 text-lg text-white mb-4">Leaderboard</h3>
            <LeaderboardTable entries={dummyLeaderboard} />
          </div>
        </div>
      </div>
    </div>
  );
};
