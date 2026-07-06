import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import * as analysisApi from '../api/analysis.js';
import * as resumesApi from '../api/resumes.js';
import AppShell from '../components/layout/AppShell.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import GapBarChart from '../components/charts/GapBarChart.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import EmptyState from '../components/EmptyState.jsx';
import PlanGate from '../components/PlanGate.jsx';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Skeleton } from '../components/ui/skeleton.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { useAuth } from '../context/AuthContext.jsx';

const IMPORTANCE_VARIANT = {
  high: 'free',
  medium: 'warning',
  low: 'student',
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
        if (list.length > 0) setSelectedResumeId(list[0].id);
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
      <AppShell>
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-8 h-32" />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PlanGate minimumPlan="student">
        <PageHeader
          title="Gap Analysis"
          description="Compare your skills against a target role and find what to learn next"
        />

        {error && <ErrorBanner message={error} className="mt-6" />}

        {resumes.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No resume uploaded"
            description="Upload a resume first to run gap analysis."
            actionLabel="Upload resume"
            actionTo="/apps/resume"
            className="mt-8"
          />
        ) : (
          <>
            <Card className="mt-8">
              <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
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
                    disabled={jobRoles.length === 0}
                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-purple disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {jobRoles.length === 0 ? (
                      <option value="">No roles available</option>
                    ) : (
                      jobRoles.map((role) => (
                        <option key={role.id} value={String(role.id)}>{role.title}</option>
                      ))
                    )}
                  </select>
                </div>
              </CardContent>
            </Card>

            <Button
              variant="purple"
              className="mt-6"
              onClick={handleAnalyze}
              disabled={analyzing || !selectedRoleId || jobRoles.length === 0}
            >
              {analyzing ? 'Analyzing...' : 'Run gap analysis'}
            </Button>

            {gaps.length > 0 && (
              <Tabs defaultValue="chart" className="mt-10">
                <TabsList>
                  <TabsTrigger value="chart">Chart</TabsTrigger>
                  <TabsTrigger value="list">Skill gaps</TabsTrigger>
                </TabsList>

                <TabsContent value="chart">
                  <Card>
                    <CardHeader>
                      <CardTitle>Gap importance breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <GapBarChart gaps={gaps} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="list">
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Missing skills{jobRole ? ` for ${jobRole.title}` : ''}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {gaps.map((gap) => {
                        const rank = gap.importance_rank || gap.importance;
                        return (
                          <div
                            key={gap.missing_skill || gap.skill}
                            className="rounded-xl border border-gray-100 p-4"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-medium">{gap.missing_skill || gap.skill}</span>
                              <Badge variant={IMPORTANCE_VARIANT[rank] || 'default'} className="capitalize">
                                {rank}
                              </Badge>
                            </div>
                            {gap.reason && (
                              <p className="mt-2 text-sm text-gray-text">{gap.reason}</p>
                            )}
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}

            {gaps.length > 0 && (
              <div className="mt-8 text-center">
                <Button variant="default" asChild>
                  <Link to="/apps/recommendations">View recommendations</Link>
                </Button>
              </div>
            )}
          </>
        )}
      </PlanGate>
    </AppShell>
  );
}
