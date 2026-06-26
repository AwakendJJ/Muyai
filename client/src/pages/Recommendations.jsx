import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Target } from 'lucide-react';
import * as recommendationsApi from '../api/recommendations.js';
import * as resumesApi from '../api/resumes.js';
import AppShell from '../components/layout/AppShell.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import EmptyState from '../components/EmptyState.jsx';
import PlanGate from '../components/PlanGate.jsx';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Skeleton } from '../components/ui/skeleton.jsx';
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
      <AppShell>
        <Skeleton className="h-10 w-56" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PlanGate minimumPlan="student">
        <PageHeader
          title="Recommendations"
          description="Career paths and courses tailored to your skill gaps"
        >
          {selectedResumeId && (
            <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          )}
        </PageHeader>

        {error && (
          <ErrorBanner message={error} className="mt-6">
            {error.includes('gap analysis') && (
              <Link to="/apps/analysis" className="ml-2 font-semibold underline">
                Run gap analysis
              </Link>
            )}
          </ErrorBanner>
        )}

        {resumes.length === 0 ? (
          <EmptyState
            icon={Target}
            title="Get started"
            description="Upload a resume and run gap analysis first."
            actionLabel="Upload resume"
            actionTo="/apps/resume"
            className="mt-8"
          />
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
              <div className="mt-10 grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-40" />
                <Skeleton className="h-40" />
              </div>
            ) : (
              <div className="mt-10 space-y-12">
                <section>
                  <h2 className="text-xl font-bold">Career paths</h2>
                  {careerPaths.length === 0 ? (
                    <p className="mt-4 text-sm text-gray-text">No career recommendations yet.</p>
                  ) : (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {careerPaths.map((career) => (
                        <Card key={career.id || career.title} className="bg-purple text-white border-0">
                          <CardHeader>
                            <CardTitle className="text-white">{career.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-sm opacity-90">{career.description}</p>
                          </CardContent>
                        </Card>
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
                        <Card key={course.id || course.title}>
                          <CardHeader>
                            <CardTitle className="text-base">{course.title}</CardTitle>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-sm text-gray-text">{course.description}</p>
                            {course.url && (
                              <a
                                href={course.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-blue hover:underline"
                              >
                                View course
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            )}
          </>
        )}
      </PlanGate>
    </AppShell>
  );
}
