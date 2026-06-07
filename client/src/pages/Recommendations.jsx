import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as recommendationsApi from '../api/recommendations.js';
import * as resumesApi from '../api/resumes.js';
import AppLayout from '../components/layout/AppLayout.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import PlanGate from '../components/PlanGate.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Recommendations() {
  const { token } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [careerPaths, setCareerPaths] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  async function loadRecommendations(resumeId, refresh = false) {
    setError('');
    const response = refresh
      ? await recommendationsApi.refreshRecommendations(token, resumeId)
      : await recommendationsApi.getRecommendations(token, resumeId);

    setCareerPaths(response.data.career_paths || []);
    setCourses(response.data.courses || []);
  }

  useEffect(() => {
    resumesApi.listResumes(token)
      .then((res) => {
        const list = res.data.resumes;
        setResumes(list);
        if (list.length > 0) {
          setSelectedResumeId(list[0].id);
          return loadRecommendations(list[0].id);
        }
        return null;
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleResumeChange(resumeId) {
    setSelectedResumeId(resumeId);
    setLoading(true);
    try {
      await loadRecommendations(resumeId);
    } catch (err) {
      setError(err.message);
      setCareerPaths([]);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleRefresh() {
    if (!selectedResumeId) return;
    setRefreshing(true);
    setError('');
    try {
      await loadRecommendations(selectedResumeId, true);
    } catch (err) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  }

  if (loading && !selectedResumeId) {
    return (
      <AppLayout>
        <LoadingSpinner />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PlanGate minimumPlan="student">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Recommendations</h1>
            <p className="mt-2 text-gray-text">
              Career paths and courses tailored to your skill gaps
            </p>
          </div>
          {selectedResumeId && (
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn-pill border border-dark/20 bg-white text-dark disabled:opacity-60"
            >
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          )}
        </div>

        {error && (
          <div className="mt-6 rounded-xl bg-pink/10 px-4 py-3 text-sm text-pink">
            {error}
            {error.includes('gap analysis') && (
              <Link to="/analysis" className="ml-2 font-semibold underline">
                Run gap analysis
              </Link>
            )}
          </div>
        )}

        {resumes.length === 0 ? (
          <div className="mt-8 card-rounded p-8 text-center">
            <p className="text-gray-text">Upload a resume and run gap analysis first.</p>
            <Link to="/resume" className="btn-pill-purple mt-4 inline-flex">
              Get started
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-6 max-w-sm">
              <label htmlFor="resume" className="block text-sm font-medium">Resume</label>
              <select
                id="resume"
                value={selectedResumeId || ''}
                onChange={(e) => handleResumeChange(Number(e.target.value))}
                className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple"
              >
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>{r.filename}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <LoadingSpinner className="py-16" />
            ) : (
              <div className="mt-10 space-y-12">
                <section>
                  <h2 className="text-xl font-bold">Career paths</h2>
                  {careerPaths.length === 0 ? (
                    <p className="mt-4 text-sm text-gray-text">No career recommendations yet.</p>
                  ) : (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {careerPaths.map((career) => (
                        <div key={career.id || career.title} className="rounded-2xl bg-purple p-6 text-white">
                          <h3 className="text-lg font-bold">{career.title}</h3>
                          <p className="mt-2 text-sm opacity-90">{career.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                <section>
                  <h2 className="text-xl font-bold">Courses</h2>
                  {courses.length === 0 ? (
                    <p className="mt-4 text-sm text-gray-text">No course recommendations yet.</p>
                  ) : (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {courses.map((course) => (
                        <div key={course.id || course.title} className="card-rounded p-6">
                          <h3 className="font-bold">{course.title}</h3>
                          <p className="mt-2 text-sm text-gray-text">{course.description}</p>
                          {course.url && (
                            <a
                              href={course.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-4 inline-flex text-sm font-semibold text-blue hover:underline"
                            >
                              View course →
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}
          </>
        )}
      </PlanGate>
    </AppLayout>
  );
}
