import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, FileText, LayoutDashboard } from 'lucide-react';
import * as resumesApi from '../api/resumes.js';
import * as applicationsApi from '../api/applications.js';
import CareerProgress from '../components/dashboard/CareerProgress.jsx';
import RecruiterDashboard from '../components/dashboard/RecruiterDashboard.jsx';
import SkillProficiencyChart from '../components/charts/SkillProficiencyChart.jsx';
import AppShell from '../components/layout/AppShell.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import StatCard from '../components/StatCard.jsx';
import SkillTable from '../components/SkillTable.jsx';
import AppLockOverlay from '../components/AppLockOverlay.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import { Skeleton } from '../components/ui/skeleton.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.jsx';
import { APPS, canAccessApp } from '../config/apps.js';
import { useAuth } from '../context/AuthContext.jsx';

const PLAN_CARDS = {
  free: { color: 'bg-accent-warm', label: 'Free', desc: '2 scans, basic skill report' },
  student: { color: 'bg-primary', label: 'Student', desc: 'Unlimited scans, gap analysis' },
  pro: { color: 'bg-blue', label: 'Pro', desc: 'Job matching, cover letters, tracker' },
};

const LAUNCHER_APPS = APPS.filter((a) => !a.adminOnly && a.id !== 'profile');

function CareerDashboardContent({
  user,
  planCard,
  scanCount,
  scanLimit,
  skills,
  resumes,
  appStats,
}) {
  const hasResume = resumes.length > 0;
  const hasSkills = skills.length > 0;
  const hasApplications = (appStats?.total ?? 0) > 0;
  const hasInterviewStage = (appStats?.interviewing ?? 0) > 0 || (appStats?.offer ?? 0) > 0;

  return (
    <>
      <div className="mt-8">
        <CareerProgress
          hasResume={hasResume}
          hasSkills={hasSkills}
          hasApplications={hasApplications}
          hasInterviewStage={hasInterviewStage}
        />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Your plan"
          value={planCard.label}
          description={planCard.desc}
          accent
          accentColor={planCard.color}
          delay={0}
        />
        <StatCard
          label="Resumes scanned"
          value={scanLimit !== null ? `${scanCount} / ${scanLimit}` : scanCount}
          delay={0.05}
        />
        <StatCard label="Skills found" value={skills.length} delay={0.1} />
        <StatCard
          label="Applications"
          value={appStats ? appStats.total : '—'}
          description={appStats ? `${appStats.applied} applied · ${appStats.interviewing} interviewing` : 'Track your job search'}
          delay={0.15}
        />
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold">Apps</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LAUNCHER_APPS.map((app) => {
            const Icon = app.icon;
            const accessible = canAccessApp(app, user?.plan);
            const locked = !accessible;

            const card = (
              <Card className="relative h-full transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{app.label}</CardTitle>
                      {app.status === 'coming_soon' && (
                        <Badge variant="locked" className="mt-1">Coming soon</Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-text">{app.description}</p>
                </CardContent>
                {locked && <AppLockOverlay app={app} />}
              </Card>
            );

            if (locked) {
              return <div key={app.id}>{card}</div>;
            }

            return (
              <Link key={app.id} to={app.path} className="block">
                {card}
              </Link>
            );
          })}
        </div>
      </div>

      {skills.length > 0 && (
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Skill proficiency</CardTitle>
            </CardHeader>
            <CardContent>
              <SkillProficiencyChart skills={skills} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { to: '/apps/resume', label: 'Upload or view resume' },
                { to: '/apps/analysis', label: 'Run gap analysis' },
                { to: '/apps/jobs', label: 'Find matching jobs' },
                { to: '/apps/applications', label: 'Track applications' },
              ].map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-3 text-sm font-medium transition-colors hover:bg-muted"
                >
                  {action.label}
                  <ArrowRight className="h-4 w-4 text-primary" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      )}

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Skill summary</h2>
          <Link to="/apps/resume" className="text-sm font-semibold text-primary hover:underline">
            {resumes.length ? 'View all' : 'Upload resume'}
          </Link>
        </div>
        {skills.length > 0 ? (
          <div className="mt-4">
            <SkillTable skills={skills.slice(0, 8)} />
          </div>
        ) : (
          <Card className="mt-4 p-8 text-center">
            <FileText className="mx-auto h-10 w-10 text-gray-text" />
            <p className="mt-4 text-gray-text">No resume uploaded yet.</p>
            <Button variant="primary" className="mt-4" asChild>
              <Link to="/apps/resume">Upload your first resume</Link>
            </Button>
          </Card>
        )}
      </div>

      <Card className="mt-8 border-primary/20 bg-primary/5 p-2">
        <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-bold">Activity tracker</h3>
            <p className="mt-1 text-sm text-gray-text">
              {appStats && appStats.total > 0
                ? `${appStats.applied} applied · ${appStats.interviewing} interviewing · ${appStats.offer} offers`
                : 'Start tracking applications to see your job search progress here.'}
            </p>
          </div>
          <Button variant="primary" asChild>
            <Link to="/apps/applications">
              {appStats?.total > 0 ? 'View applications' : 'Add application'}
            </Link>
          </Button>
        </CardContent>
      </Card>

      {user?.plan === 'free' && (
        <Card className="mt-8 border-2 border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="font-bold">Unlock more with Student</h3>
            <p className="mt-1 text-sm text-gray-text">
              Get unlimited scans, gap analysis, and personalized course recommendations.
            </p>
            <Button variant="primary" className="mt-4" asChild>
              <a href="/#pricing">View plans</a>
            </Button>
          </CardContent>
        </Card>
      )}
    </>
  );
}

export default function Dashboard() {
  const { user, token } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [skills, setSkills] = useState([]);
  const [scanCount, setScanCount] = useState(0);
  const [scanLimit, setScanLimit] = useState(null);
  const [appStats, setAppStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      resumesApi.listResumes(token),
      applicationsApi.getApplicationStats(token).catch(() => ({ data: { stats: null } })),
    ])
      .then(async ([resumeResponse, appResponse]) => {
        setResumes(resumeResponse.data.resumes);
        setScanCount(resumeResponse.data.scan_count);
        setScanLimit(resumeResponse.data.scan_limit);
        setAppStats(appResponse.data.stats);

        if (resumeResponse.data.resumes.length > 0) {
          const skillsRes = await resumesApi.getSkills(token, resumeResponse.data.resumes[0].id);
          setSkills(skillsRes.data.skills);
        }
      })
      .finally(() => setLoading(false));
  }, [token]);

  const planCard = PLAN_CARDS[user?.plan] || PLAN_CARDS.free;

  if (loading) {
    return (
      <AppShell>
        <div className="space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-32 w-full" />
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-28" />
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        title={`Welcome, ${user?.name?.split(' ')[0] || 'there'}`}
        description="Your career development hub"
      />

      <Tabs defaultValue="career" className="mt-6">
        <TabsList>
          <TabsTrigger value="career" className="gap-2">
            <LayoutDashboard className="h-4 w-4" />
            My career
          </TabsTrigger>
          <TabsTrigger value="recruiter" className="gap-2">
            <Briefcase className="h-4 w-4" />
            Recruiter hub
          </TabsTrigger>
        </TabsList>

        <TabsContent value="career">
          <CareerDashboardContent
            user={user}
            planCard={planCard}
            scanCount={scanCount}
            scanLimit={scanLimit}
            skills={skills}
            resumes={resumes}
            appStats={appStats}
          />
        </TabsContent>

        <TabsContent value="recruiter">
          <RecruiterDashboard />
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}
