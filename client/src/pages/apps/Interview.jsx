import { useCallback, useEffect, useState } from 'react';
import { Mic, Play, Trash2 } from 'lucide-react';
import * as interviewApi from '../../api/interview.js';
import * as resumesApi from '../../api/resumes.js';
import AppShell from '../../components/layout/AppShell.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import ErrorBanner from '../../components/ErrorBanner.jsx';
import EmptyState from '../../components/EmptyState.jsx';
import PlanGate from '../../components/PlanGate.jsx';
import { Badge } from '../../components/ui/badge.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent } from '../../components/ui/card.jsx';
import { Skeleton } from '../../components/ui/skeleton.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Interview() {
  const { token } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [demoMode, setDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState({});
  const [form, setForm] = useState({ job_title: '', company: '', resume_id: null });

  const load = useCallback(async () => {
    const [sessionsRes, resumesRes] = await Promise.all([
      interviewApi.listSessions(token),
      resumesApi.listResumes(token),
    ]);
    setSessions(sessionsRes.data.sessions);
    setResumes(resumesRes.data.resumes);
    if (resumesRes.data.resumes.length > 0) {
      setForm((f) => ({ ...f, resume_id: resumesRes.data.resumes[0].id }));
    }
  }, [token]);

  useEffect(() => {
    load()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [load]);

  async function handleStart(e) {
    e.preventDefault();
    if (!form.job_title.trim()) {
      setError('Job title is required');
      return;
    }
    setError('');
    setStarting(true);
    try {
      const response = await interviewApi.startSession(token, form);
      setActiveSession(response.data.session);
      setDemoMode(response.data.demo_mode);
      setAnswers({});
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setStarting(false);
    }
  }

  async function openSession(id) {
    setError('');
    try {
      const response = await interviewApi.getSession(token, id);
      setActiveSession(response.data.session);
      const prefilled = {};
      response.data.session.questions.forEach((q, i) => {
        if (q.answer) prefilled[i] = q.answer;
      });
      setAnswers(prefilled);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSubmitAnswer(questionIndex) {
    const answer = answers[questionIndex]?.trim();
    if (!answer || !activeSession) return;
    setError('');
    setSubmitting(true);
    try {
      const response = await interviewApi.submitAnswer(token, activeSession.id, {
        question_index: questionIndex,
        answer,
      });
      setActiveSession(response.data.session);
      setDemoMode(response.data.demo_mode);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this practice session?')) return;
    setError('');
    try {
      await interviewApi.deleteSession(token, id);
      if (activeSession?.id === id) setActiveSession(null);
      await load();
    } catch (err) {
      setError(err.message);
    }
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
          title="Interview Prep"
          description="Practice role-specific questions and get AI feedback on your answers"
        />

        {error && <ErrorBanner message={error} className="mt-6" />}

        {demoMode && (
          <Card className="mt-6 border-purple/20 bg-purple/5">
            <CardContent className="p-4 text-sm text-gray-text">
              Demo mode — add an AI API key for personalized questions and feedback.
            </CardContent>
          </Card>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-bold">New practice session</h2>
                <form onSubmit={handleStart} className="mt-4 space-y-4">
                  <div>
                    <label htmlFor="job_title" className="block text-sm font-medium">Target role</label>
                    <input
                      id="job_title"
                      required
                      value={form.job_title}
                      onChange={(e) => setForm({ ...form, job_title: e.target.value })}
                      placeholder="e.g. Software Engineer"
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium">Company (optional)</label>
                    <input
                      id="company"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple"
                    />
                  </div>
                  <Button type="submit" variant="purple" className="w-full" disabled={starting}>
                    <Play className="h-4 w-4" />
                    {starting ? 'Starting...' : 'Start session'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {sessions.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-bold">Past sessions</h3>
                  <ul className="mt-3 space-y-2">
                    {sessions.map((s) => (
                      <li key={s.id} className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openSession(s.id)}
                          className={`flex-1 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                            activeSession?.id === s.id ? 'bg-purple/10 font-semibold text-purple' : ''
                          }`}
                        >
                          {s.job_title}
                          {s.company ? ` · ${s.company}` : ''}
                        </button>
                        <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2">
            {activeSession ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">{activeSession.job_title}</h2>
                  {activeSession.company && (
                    <Badge variant="default">{activeSession.company}</Badge>
                  )}
                </div>
                {activeSession.questions.map((q, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-semibold">{q.question}</p>
                        {q.category && <Badge variant="student">{q.category}</Badge>}
                      </div>
                      <textarea
                        rows={4}
                        value={answers[index] || q.answer || ''}
                        onChange={(e) => setAnswers({ ...answers, [index]: e.target.value })}
                        placeholder="Type your answer here..."
                        className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple"
                        disabled={!!q.feedback}
                      />
                      {!q.feedback ? (
                        <Button
                          variant="purple"
                          size="sm"
                          className="mt-3"
                          onClick={() => handleSubmitAnswer(index)}
                          disabled={submitting || !answers[index]?.trim()}
                        >
                          {submitting ? 'Evaluating...' : 'Get feedback'}
                        </Button>
                      ) : (
                        <div className="mt-4 rounded-xl bg-muted/50 p-4">
                          <div className="flex items-center gap-2">
                            <Badge variant={q.score >= 7 ? 'pro' : q.score >= 5 ? 'student' : 'locked'}>
                              Score: {q.score}/10
                            </Badge>
                          </div>
                          <p className="mt-2 text-sm text-gray-text">{q.feedback}</p>
                          {q.tips?.length > 0 && (
                            <ul className="mt-3 list-inside list-disc text-sm text-gray-text">
                              {q.tips.map((tip, i) => <li key={i}>{tip}</li>)}
                            </ul>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Mic}
                title="No active session"
                description="Start a practice session for a role you're targeting. Questions adapt to your resume skills when available."
                className="h-full min-h-[320px]"
              />
            )}
          </div>
        </div>
      </PlanGate>
    </AppShell>
  );
}
