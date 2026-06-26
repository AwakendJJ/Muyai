import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Search, Sparkles } from 'lucide-react';
import * as jobsApi from '../../api/jobs.js';
import * as resumesApi from '../../api/resumes.js';
import * as applicationsApi from '../../api/applications.js';
import AppShell from '../../components/layout/AppShell.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import JobCard from '../../components/JobCard.jsx';
import ErrorBanner from '../../components/ErrorBanner.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import PlanGate from '../../components/PlanGate.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent } from '../../components/ui/card.jsx';
import { Skeleton } from '../../components/ui/skeleton.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Jobs() {
  const { token } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('remote');
  const [provider, setProvider] = useState('');
  const [ethiojobsPending, setEthiojobsPending] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [demoMode, setDemoMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [trackingId, setTrackingId] = useState(null);
  const [trackSuccess, setTrackSuccess] = useState('');

  useEffect(() => {
    Promise.all([
      resumesApi.listResumes(token),
      jobsApi.getJobCountries(token),
    ])
      .then(([resumesRes, countriesRes]) => {
        const list = resumesRes.data.resumes;
        setResumes(list);
        setCountries(countriesRes.data.countries || []);
        if (list.length > 0) {
          setSelectedResumeId(list[0].id);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  async function runMatch() {
    if (!selectedResumeId) return;
    setError('');
    setSearching(true);
    try {
      const response = await jobsApi.matchJobs(token, {
        resumeId: selectedResumeId,
        query: query || undefined,
        location: location || undefined,
        country,
      });
      setJobs(response.data.jobs || []);
      setDemoMode(response.data.demo_mode || false);
      setProvider(response.data.provider || '');
      setEthiojobsPending(response.data.ethiojobs_pending || false);
      setSearchQuery(response.data.search_query || '');
    } catch (err) {
      setError(err.message);
      setJobs([]);
    } finally {
      setSearching(false);
    }
  }

  async function runSearch() {
    setError('');
    setSearching(true);
    try {
      const response = await jobsApi.searchJobs(token, {
        query: query || 'software',
        location: location || undefined,
        country,
      });
      setJobs(response.data.jobs || []);
      setDemoMode(response.data.demo_mode || false);
      setProvider(response.data.provider || '');
      setEthiojobsPending(response.data.ethiojobs_pending || false);
      setSearchQuery(query || 'software');
    } catch (err) {
      setError(err.message);
      setJobs([]);
    } finally {
      setSearching(false);
    }
  }

  async function trackJob(job) {
    setError('');
    setTrackSuccess('');
    setTrackingId(job.id);
    try {
      await applicationsApi.createApplication(token, {
        job_title: job.title,
        company: job.company,
        location: job.location,
        job_url: job.url,
        status: 'saved',
      });
      setTrackSuccess(`"${job.title}" added to your application tracker.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setTrackingId(null);
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
      <PlanGate minimumPlan="free">
        <PageHeader
          title="Job Match"
          description="Live remote jobs via Remotive; local Ethiopia listings when you add your EthioJobs API"
        />

        {error && <ErrorBanner message={error} className="mt-6" />}
        {trackSuccess && (
          <Card className="mt-6 border-purple/20 bg-purple/5">
            <CardContent className="flex flex-col gap-2 p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
              <span>{trackSuccess}</span>
              <Link to="/apps/applications" className="font-semibold text-purple hover:underline">
                View tracker
              </Link>
            </CardContent>
          </Card>
        )}

        {ethiojobsPending && (
          <Card className="mt-6 border-blue/20 bg-blue/5">
            <CardContent className="p-4 text-sm text-gray-text">
              EthioJobs API not configured yet — showing remote listings from{' '}
              <a href="https://remotive.com" target="_blank" rel="noopener noreferrer" className="text-purple hover:underline">
                Remotive
              </a>
              . Add <code className="rounded bg-muted px-1">PARSE_API_KEY</code> later for local Ethiopian jobs.
            </CardContent>
          </Card>
        )}

        {provider === 'remotive' && !ethiojobsPending && (
          <Card className="mt-6 border-purple/20 bg-purple/5">
            <CardContent className="p-4 text-sm text-gray-text">
              Live listings from{' '}
              <a href="https://remotive.com" target="_blank" rel="noopener noreferrer" className="font-semibold text-purple hover:underline">
                Remotive
              </a>{' '}
              (free public API — remote roles worldwide, open to African talent).
            </CardContent>
          </Card>
        )}

        {provider === 'ethiojobs' && (
          <Card className="mt-6 border-purple/20 bg-purple/5">
            <CardContent className="p-4 text-sm text-gray-text">
              Listing jobs from{' '}
              <a href="https://ethiojobs.net" target="_blank" rel="noopener noreferrer" className="font-semibold text-purple hover:underline">
                EthioJobs.net
              </a>
            </CardContent>
          </Card>
        )}

        {resumes.length === 0 ? (
          <EmptyState
            icon={Briefcase}
            title="Upload a resume first"
            description="Job matching uses skills extracted from your resume to score opportunities."
            actionLabel="Go to Resume Lab"
            actionTo="/apps/resume"
            className="mt-8"
          />
        ) : (
          <>
            <Card className="mt-8">
              <CardContent className="grid gap-4 p-6 md:grid-cols-2">
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
                  <label htmlFor="country" className="block text-sm font-medium">Country</label>
                  <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple"
                  >
                    {countries.map((c) => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="query" className="block text-sm font-medium">Job title or keywords</label>
                  <input
                    id="query"
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. software engineer, data analyst"
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple"
                  />
                </div>

                <div>
                  <label htmlFor="location" className="block text-sm font-medium">City or region (optional)</label>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={country === 'et' ? 'e.g. Addis Ababa' : 'e.g. Lagos, Nairobi'}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple"
                  />
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="purple" onClick={runMatch} disabled={searching}>
                <Sparkles className="h-4 w-4" />
                {searching ? 'Matching...' : 'Match to my skills'}
              </Button>
              <Button variant="outline" onClick={runSearch} disabled={searching}>
                <Search className="h-4 w-4" />
                Search jobs
              </Button>
            </div>

            {searchQuery && jobs.length > 0 && (
              <div className="mt-8 flex items-center gap-2">
                <h2 className="text-xl font-bold">Results</h2>
                <Badge variant="default">{jobs.length} jobs</Badge>
                {searchQuery && (
                  <span className="text-sm text-gray-text">for &ldquo;{searchQuery}&rdquo;</span>
                )}
              </div>
            )}

            {searching ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <Skeleton className="h-48" />
                <Skeleton className="h-48" />
              </div>
            ) : jobs.length > 0 ? (
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onTrack={trackJob}
                    tracking={trackingId === job.id}
                  />
                ))}
              </div>
            ) : (
              !error && (
                <EmptyState
                  icon={Briefcase}
                  title="No jobs yet"
                  description="Run a skill match or search to discover opportunities."
                  className="mt-8"
                />
              )
            )}
          </>
        )}

        <p className="mt-8 text-center text-sm text-gray-text">
          Need gap analysis first?{' '}
          <Link to="/apps/analysis" className="font-semibold text-purple hover:underline">
            Run gap analysis
          </Link>
        </p>
      </PlanGate>
    </AppShell>
  );
}
