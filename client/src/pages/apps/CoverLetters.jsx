import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Copy, Mail, Sparkles, Trash2 } from 'lucide-react';
import * as coverLettersApi from '../../api/coverLetters.js';
import * as resumesApi from '../../api/resumes.js';
import AppShell from '../../components/layout/AppShell.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import ErrorBanner from '../../components/ErrorBanner.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import PlanGate from '../../components/PlanGate.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent } from '../../components/ui/card.jsx';
import { Skeleton } from '../../components/ui/skeleton.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function CoverLetters() {
  const { token } = useAuth();
  const [searchParams] = useSearchParams();
  const [letters, setLetters] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [content, setContent] = useState('');
  const [demoMode, setDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    job_title: searchParams.get('job') || '',
    company: searchParams.get('company') || '',
    job_description: '',
    application_id: searchParams.get('app') ? Number(searchParams.get('app')) : null,
    resume_id: null,
  });

  const load = useCallback(async () => {
    const [lettersRes, resumesRes] = await Promise.all([
      coverLettersApi.listCoverLetters(token),
      resumesApi.listResumes(token),
    ]);
    setLetters(lettersRes.data.cover_letters);
    setResumes(resumesRes.data.resumes);
    if (resumesRes.data.resumes.length > 0) {
      setForm((f) => (f.resume_id ? f : { ...f, resume_id: resumesRes.data.resumes[0].id }));
    }
  }, [token]);

  useEffect(() => {
    load()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [load]);

  function selectLetter(letter) {
    setSelectedId(letter.id);
    setContent(letter.content);
    setDemoMode(false);
  }

  async function handleGenerate(e) {
    e.preventDefault();
    if (!form.job_title.trim() || !form.company.trim()) {
      setError('Job title and company are required');
      return;
    }
    setError('');
    setGenerating(true);
    try {
      const response = await coverLettersApi.generateCoverLetter(token, form);
      const letter = response.data.cover_letter;
      setDemoMode(response.data.demo_mode);
      setSelectedId(letter.id);
      setContent(letter.content);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  async function handleSave() {
    if (!selectedId) return;
    setError('');
    setSaving(true);
    try {
      await coverLettersApi.updateCoverLetter(token, selectedId, content);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this cover letter?')) return;
    setError('');
    try {
      await coverLettersApi.deleteCoverLetter(token, id);
      if (selectedId === id) {
        setSelectedId(null);
        setContent('');
      }
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
  }

  if (loading) {
    return (
      <AppShell>
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-8 h-64" />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PlanGate minimumPlan="free">
        <PageHeader
          title="Cover Letters"
          description="Generate tailored cover letters from your resume and job details"
        />

        {error && <ErrorBanner message={error} className="mt-6" />}

        {demoMode && (
          <Card className="mt-6 border-purple/20 bg-purple/5">
            <CardContent className="p-4 text-sm text-gray-text">
              Demo mode — add <code className="rounded bg-muted px-1">DEEPSEEK_API_KEY</code>,{' '}
              <code className="rounded bg-muted px-1">OPENAI_API_KEY</code>, or{' '}
              <code className="rounded bg-muted px-1">CLAUDE_API_KEY</code> for AI-generated letters.
            </CardContent>
          </Card>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-1">
            <CardContent className="p-6">
              <h2 className="font-bold">Generate new</h2>
              <form onSubmit={handleGenerate} className="mt-4 space-y-4">
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
                {resumes.length > 0 && (
                  <div>
                    <label htmlFor="resume" className="block text-sm font-medium">Resume</label>
                    <select
                      id="resume"
                      value={form.resume_id || ''}
                      onChange={(e) => setForm({ ...form, resume_id: Number(e.target.value) })}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple"
                    >
                      {resumes.map((r) => (
                        <option key={r.id} value={r.id}>{r.filename}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label htmlFor="job_description" className="block text-sm font-medium">Job description (optional)</label>
                  <textarea
                    id="job_description"
                    rows={4}
                    value={form.job_description}
                    onChange={(e) => setForm({ ...form, job_description: e.target.value })}
                    placeholder="Paste the job posting for better tailoring"
                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple"
                  />
                </div>
                <Button type="submit" variant="purple" className="w-full" disabled={generating}>
                  <Sparkles className="h-4 w-4" />
                  {generating ? 'Generating...' : 'Generate letter'}
                </Button>
              </form>

              {letters.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-bold uppercase tracking-wide text-gray-text">Saved letters</h3>
                  <ul className="mt-3 space-y-2">
                    {letters.map((letter) => (
                      <li key={letter.id}>
                        <button
                          type="button"
                          onClick={() => selectLetter(letter)}
                          className={`w-full rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                            selectedId === letter.id ? 'bg-purple/10 font-semibold text-purple' : ''
                          }`}
                        >
                          {letter.job_title} · {letter.company}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardContent className="p-6">
              {content ? (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="font-bold">Editor</h2>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        <Copy className="h-3.5 w-3.5" />
                        Copy
                      </Button>
                      {selectedId && (
                        <>
                          <Button variant="purple" size="sm" onClick={handleSave} disabled={saving}>
                            {saving ? 'Saving...' : 'Save'}
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(selectedId)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={18}
                    className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm leading-relaxed outline-none focus:border-purple"
                  />
                </>
              ) : (
                <EmptyState
                  icon={Mail}
                  title="No letter selected"
                  description={resumes.length === 0
                    ? 'Upload a resume first, then generate a tailored cover letter.'
                    : 'Fill in the job details and generate your first cover letter.'}
                  actionLabel={resumes.length === 0 ? 'Go to Resume Lab' : undefined}
                  actionTo={resumes.length === 0 ? '/apps/resume' : undefined}
                />
              )}
            </CardContent>
          </Card>
        </div>
      </PlanGate>
    </AppShell>
  );
}
