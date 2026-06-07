import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as analysisApi from '../api/analysis.js';
import * as resumesApi from '../api/resumes.js';
import AppLayout from '../components/layout/AppLayout.jsx';
import GapChart from '../components/GapChart.jsx';
import PlanGate from '../components/PlanGate.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const IMPORTANCE_STYLES = {
  high: 'bg-pink/10 text-pink',
  medium: 'bg-orange/10 text-orange',
  low: 'bg-blue/10 text-blue',
};

export default function Analysis() {
  const { token } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [jobRoles, setJobRoles] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [gaps, setGaps] = useState([]);
  const [jobRole, setJobRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const loadGaps = useCallback(async (resumeId, roleId) => {
    if (!resumeId || !roleId) return;
    try {
      const response = await analysisApi.getGaps(token, resumeId, Number(roleId));
      setGaps(response.data.gaps || []);
      setJobRole(response.data.job_role);
    } catch {
      setGaps([]);
      setJobRole(null);
    }
  }, [token]);

  useEffect(() => {
    Promise.all([
      resumesApi.listResumes(token),
      analysisApi.getJobRoles(token),
    ])
      .then(([resumesRes, rolesRes]) => {
        const list = resumesRes.data.resumes;
        setResumes(list);
        setJobRoles(rolesRes.data.job_roles);
        if (list.length > 0) {
          setSelectedResumeId(list[0].id);
        }
        if (rolesRes.data.job_roles.length > 0) {
          setSelectedRoleId(String(rolesRes.data.job_roles[0].id));
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    if (selectedResumeId && selectedRoleId) {
      loadGaps(selectedResumeId, selectedRoleId);
    }
  }, [selectedResumeId, selectedRoleId, loadGaps]);

  async function handleAnalyze() {
    if (!selectedResumeId || !selectedRoleId) return;

    setError('');
    setAnalyzing(true);

    try {
      const response = await analysisApi.runGapAnalysis(
        token,
        selectedResumeId,
        Number(selectedRoleId)
      );
      setGaps(response.data.gaps);
      setJobRole(response.data.job_role);
    } catch (err) {
      setError(err.message);
    } finally {
      setAnalyzing(false);
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple border-t-transparent" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PlanGate minimumPlan="student">
        <h1 className="text-3xl font-bold">Gap Analysis</h1>
        <p className="mt-2 text-gray-text">
          Compare your skills against a target role and find what to learn next
        </p>

        {error && (
          <div className="mt-6 rounded-xl bg-pink/10 px-4 py-3 text-sm text-pink">{error}</div>
        )}

        {resumes.length === 0 ? (
          <div className="mt-8 card-rounded p-8 text-center">
            <p className="text-gray-text">Upload a resume first to run gap analysis.</p>
            <Link to="/resume" className="btn-pill-purple mt-4 inline-flex">
              Upload resume
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="resume" className="block text-sm font-medium">Resume</label>
                <select
                  id="resume"
                  value={selectedResumeId || ''}
                  onChange={(e) => setSelectedResumeId(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple"
                >
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>{r.filename}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium">Target role</label>
                <select
                  id="role"
                  value={selectedRoleId}
                  onChange={(e) => setSelectedRoleId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple"
                >
                  {jobRoles.map((role) => (
                    <option key={role.id} value={role.id}>{role.title}</option>
                  ))}
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAnalyze}
              disabled={analyzing}
              className="btn-pill-purple mt-6 disabled:opacity-60"
            >
              {analyzing ? 'Analyzing...' : 'Run gap analysis'}
            </button>

            {gaps.length > 0 && (
              <div className="mt-10 grid gap-6 lg:grid-cols-2">
                <GapChart gaps={gaps} />

                <div className="card-rounded p-6">
                  <h3 className="font-bold">
                    Missing skills{jobRole ? ` for ${jobRole.title}` : ''}
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {gaps.map((gap) => (
                      <li
                        key={gap.missing_skill || gap.skill}
                        className="rounded-xl border border-gray-100 p-4"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">{gap.missing_skill || gap.skill}</span>
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${IMPORTANCE_STYLES[gap.importance_rank || gap.importance]}`}>
                            {gap.importance_rank || gap.importance}
                          </span>
                        </div>
                        {gap.reason && (
                          <p className="mt-2 text-sm text-gray-text">{gap.reason}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {gaps.length > 0 && (
              <div className="mt-8 text-center">
                <Link to="/recommendations" className="btn-pill-dark inline-flex">
                  View recommendations
                </Link>
              </div>
            )}
          </>
        )}
      </PlanGate>
    </AppLayout>
  );
}
