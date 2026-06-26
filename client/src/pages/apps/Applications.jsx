import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, ExternalLink, Plus, Trash2 } from 'lucide-react';
import * as applicationsApi from '../../api/applications.js';
import AppShell from '../../components/layout/AppShell.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import ErrorBanner from '../../components/ErrorBanner.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import StatCard from '../../components/StatCard.jsx';
import PlanGate from '../../components/PlanGate.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent } from '../../components/ui/card.jsx';
import { Skeleton } from '../../components/ui/skeleton.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const STATUS_OPTIONS = [
  { value: 'saved', label: 'Saved', variant: 'default' },
  { value: 'applied', label: 'Applied', variant: 'blue' },
  { value: 'interviewing', label: 'Interviewing', variant: 'student' },
  { value: 'offer', label: 'Offer', variant: 'pro' },
  { value: 'rejected', label: 'Rejected', variant: 'locked' },
  { value: 'withdrawn', label: 'Withdrawn', variant: 'default' },
];

function statusMeta(status) {
  return STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
}

const EMPTY_FORM = {
  job_title: '',
  company: '',
  location: '',
  job_url: '',
  status: 'saved',
  notes: '',
};

export default function Applications() {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    const response = await applicationsApi.listApplications(token);
    setApplications(response.data.applications);
    setStats(response.data.stats);
  }, [token]);

  useEffect(() => {
    load()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [load]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await applicationsApi.createApplication(token, form);
      setForm(EMPTY_FORM);
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(id, status) {
    setError('');
    try {
      await applicationsApi.updateApplication(token, id, { status });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Remove this application from your tracker?')) return;
    setError('');
    try {
      await applicationsApi.deleteApplication(token, id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  const filtered = filter === 'all'
    ? applications
    : applications.filter((a) => a.status === filter);

  if (loading) {
    return (
      <AppShell>
        <Skeleton className="h-10 w-48" />
        <div className="mt-8 grid gap-4 sm:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PlanGate minimumPlan="free">
        <PageHeader
          title="Applications"
          description="Track every role you save, apply to, and interview for"
        >
          <Button variant="purple" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" />
            Add application
          </Button>
        </PageHeader>

        {error && <ErrorBanner message={error} className="mt-6" />}

        {stats && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total tracked" value={stats.total} delay={0} />
            <StatCard label="Applied" value={stats.applied} delay={0.05} />
            <StatCard label="Interviewing" value={stats.interviewing} delay={0.1} />
            <StatCard label="Offers" value={stats.offer} delay={0.15} />
          </div>
        )}

        {showForm && (
          <Card className="mt-8">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
                <div>
                  <label htmlFor="job_title" className="block text-sm font-medium">Job title</label>
                  <input
                    id="job_title"
                    required
                    value={form.job_title}
                    onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple"
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium">Company</label>
                  <input
                    id="company"
                    required
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple"
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium">Location</label>
                  <input
                    id="location"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple"
                  />
                </div>
                <div>
                  <label htmlFor="job_url" className="block text-sm font-medium">Job URL</label>
                  <input
                    id="job_url"
                    type="url"
                    value={form.job_url}
                    onChange={(e) => setForm({ ...form, job_url: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple"
                  />
                </div>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium">Status</label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="notes" className="block text-sm font-medium">Notes</label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple"
                  />
                </div>
                <div className="flex gap-3 md:col-span-2">
                  <Button type="submit" variant="purple" disabled={saving}>
                    {saving ? 'Saving...' : 'Save application'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 flex flex-wrap gap-2">
          <Button
            variant={filter === 'all' ? 'purple' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          {STATUS_OPTIONS.map((s) => (
            <Button
              key={s.value}
              variant={filter === s.value ? 'purple' : 'outline'}
              size="sm"
              onClick={() => setFilter(s.value)}
            >
              {s.label}
            </Button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={ClipboardList}
            title="No applications yet"
            description="Save roles from Job Match or add applications manually to stay organized."
            actionLabel="Browse jobs"
            actionTo="/apps/jobs"
            className="mt-8"
          />
        ) : (
          <div className="mt-6 space-y-4">
            {filtered.map((app) => {
              const meta = statusMeta(app.status);
              return (
                <Card key={app.id}>
                  <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold">{app.job_title}</h3>
                        <Badge variant={meta.variant}>{meta.label}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-gray-text">{app.company}{app.location ? ` · ${app.location}` : ''}</p>
                      {app.notes && (
                        <p className="mt-2 text-sm text-gray-text line-clamp-2">{app.notes}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-purple"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                      </select>
                      {app.job_url && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={app.job_url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3.5 w-3.5" />
                            View
                          </a>
                        </Button>
                      )}
                      <Button variant="outline" size="sm" asChild>
                        <Link to={`/apps/cover-letters?job=${encodeURIComponent(app.job_title)}&company=${encodeURIComponent(app.company)}&app=${app.id}`}>
                          Cover letter
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(app.id)}>
                        <Trash2 className="h-4 w-4 text-gray-text" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </PlanGate>
    </AppShell>
  );
}
