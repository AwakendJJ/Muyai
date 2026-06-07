import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as resumesApi from '../api/resumes.js';
import SkillProficiencyChart from '../components/charts/SkillProficiencyChart.jsx';
import AppLayout from '../components/layout/AppLayout.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import SkillTable from '../components/SkillTable.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const PLAN_CARDS = {
  free: { color: 'bg-pink', label: 'Free', desc: '2 scans, basic skill report' },
  student: { color: 'bg-purple', label: 'Student', desc: 'Unlimited scans, gap analysis' },
  pro: { color: 'bg-blue', label: 'Pro', desc: 'Job matching, cover letters, tracker' },
};

export default function Dashboard() {
  const { user, token } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [skills, setSkills] = useState([]);
  const [scanCount, setScanCount] = useState(0);
  const [scanLimit, setScanLimit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    resumesApi.listResumes(token)
      .then(async (response) => {
        setResumes(response.data.resumes);
        setScanCount(response.data.scan_count);
        setScanLimit(response.data.scan_limit);

        if (response.data.resumes.length > 0) {
          const skillsRes = await resumesApi.getSkills(token, response.data.resumes[0].id);
          setSkills(skillsRes.data.skills);
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  const planCard = PLAN_CARDS[user?.plan] || PLAN_CARDS.free;

  if (loading) {
    return (
      <AppLayout>
        <LoadingSpinner />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <h1 className="text-3xl font-bold">Welcome, {user?.name}</h1>
      <p className="mt-2 text-gray-text">Your career development hub</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <div className={`${planCard.color} rounded-2xl p-6 text-white`}>
          <p className="text-sm opacity-80">Your plan</p>
          <p className="mt-1 text-2xl font-bold">{planCard.label}</p>
          <p className="mt-2 text-sm opacity-90">{planCard.desc}</p>
        </div>
        <div className="card-rounded p-6">
          <p className="text-sm text-gray-text">Resumes scanned</p>
          <p className="mt-1 text-2xl font-bold">{scanCount}{scanLimit !== null ? ` / ${scanLimit}` : ''}</p>
        </div>
        <div className="card-rounded p-6">
          <p className="text-sm text-gray-text">Skills found</p>
          <p className="mt-1 text-2xl font-bold">{skills.length}</p>
        </div>
        <div className="card-rounded p-6">
          <p className="text-sm text-gray-text">Latest resume</p>
          <p className="mt-1 truncate text-lg font-bold">{resumes[0]?.filename || 'None yet'}</p>
        </div>
      </div>

      {skills.length > 0 && (
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="card-rounded p-6">
            <h2 className="text-xl font-bold">Skill proficiency</h2>
            <div className="mt-4">
              <SkillProficiencyChart skills={skills} />
            </div>
          </div>
          <div className="card-rounded p-6">
            <h2 className="text-xl font-bold">Quick actions</h2>
            <div className="mt-4 space-y-3">
              <Link to="/resume" className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-4 hover:bg-muted">
                <span className="font-medium">Upload or view resume</span>
                <span className="text-purple">→</span>
              </Link>
              <Link to="/analysis" className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-4 hover:bg-muted">
                <span className="font-medium">Run gap analysis</span>
                <span className="text-purple">→</span>
              </Link>
              <Link to="/recommendations" className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-4 hover:bg-muted">
                <span className="font-medium">View recommendations</span>
                <span className="text-purple">→</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Skill summary</h2>
          <Link to="/resume" className="text-sm font-semibold text-purple hover:underline">
            {resumes.length ? 'View all' : 'Upload resume'}
          </Link>
        </div>
        {skills.length > 0 ? (
          <div className="mt-4">
            <SkillTable skills={skills.slice(0, 8)} />
          </div>
        ) : (
          <div className="mt-4 card-rounded p-8 text-center">
            <p className="text-gray-text">No resume uploaded yet.</p>
            <Link to="/resume" className="btn-pill-purple mt-4 inline-flex">Upload your first resume</Link>
          </div>
        )}
      </div>

      {user?.plan === 'free' && (
        <div className="mt-8 card-rounded border-2 border-purple/20 bg-purple/5 p-6">
          <h3 className="font-bold">Unlock more with Student</h3>
          <p className="mt-1 text-sm text-gray-text">
            Get unlimited scans, gap analysis, and personalized course recommendations.
          </p>
          <a href="/#pricing" className="btn-pill-purple mt-4 inline-flex text-sm">View plans</a>
        </div>
      )}
    </AppLayout>
  );
}
