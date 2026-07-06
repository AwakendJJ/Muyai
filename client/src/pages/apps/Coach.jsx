import { useCallback, useEffect, useRef, useState } from 'react';
import { GraduationCap, RotateCcw, Send } from 'lucide-react';
import * as coachApi from '../../api/coach.js';
import AppShell from '../../components/layout/AppShell.jsx';
import PageHeader from '../../components/layout/PageHeader.jsx';
import ErrorBanner from '../../components/ErrorBanner.jsx';
import PlanGate from '../../components/PlanGate.jsx';
import { Button } from '../../components/ui/button.jsx';
import { Card, CardContent } from '../../components/ui/card.jsx';
import { Skeleton } from '../../components/ui/skeleton.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const STARTER_PROMPTS = [
  'How should I prepare for my next interview?',
  'What skills should I focus on for a tech career?',
  'How do I negotiate salary as a junior developer?',
  'Tips for finding remote jobs from Africa',
];

export default function Coach() {
  const { token, getToken, user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [demoMode, setDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef(null);

  const load = useCallback(async () => {
    const response = await coachApi.getMessages(token);
    setMessages(response.data.messages);
  }, [token]);

  useEffect(() => {
    load()
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function sendText(text) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setError('');
    setInput('');
    setSending(true);

    const optimistic = [
      ...messages,
      { id: `temp-${Date.now()}`, role: 'user', content: trimmed },
    ];
    setMessages(optimistic);

    try {
      const activeToken = (await getToken()) || token;
      const response = await coachApi.sendMessage(activeToken, trimmed);
      setDemoMode(response.data.demo_mode);
      await load();
    } catch (err) {
      setError(/failed to fetch|cannot reach api/i.test(err.message)
        ? 'Could not reach the server. Restart backend and try again.'
        : err.message);
      setMessages(messages);
      setInput(trimmed);
    } finally {
      setSending(false);
    }
  }

  async function handleClear() {
    if (!window.confirm('Clear conversation history?')) return;
    setError('');
    try {
      await coachApi.clearMessages(token);
      setMessages([]);
      setDemoMode(false);
    } catch (err) {
      setError(/failed to fetch|cannot reach api/i.test(err.message)
        ? 'Could not reach the server. Restart backend and try again.'
        : err.message);
    }
  }

  if (loading) {
    return (
      <AppShell>
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-8 h-96" />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PlanGate minimumPlan="free">
        <PageHeader
          title="Career Coach"
          description="Personalized guidance for your job search and career growth"
        >
          {messages.length > 0 && (
            <Button variant="outline" size="sm" onClick={handleClear}>
              <RotateCcw className="h-3.5 w-3.5" />
              Clear chat
            </Button>
          )}
        </PageHeader>

        {error && <ErrorBanner message={error} className="mt-6" />}

        {demoMode && (
          <Card className="mt-6 border-purple/20 bg-purple/5">
            <CardContent className="p-4 text-sm text-gray-text">
              Demo mode — add an AI API key for fully personalized coaching.
            </CardContent>
          </Card>
        )}

        <Card className="mt-8 flex h-[calc(100vh-16rem)] min-h-[480px] flex-col">
          <CardContent className="flex flex-1 flex-col p-0">
            <div className="flex-1 overflow-y-auto p-6">
              {messages.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple/10">
                    <GraduationCap className="h-7 w-7 text-purple" />
                  </div>
                  <h2 className="mt-4 text-lg font-bold">
                    Hi {user?.name?.split(' ')[0] || 'there'}, how can I help?
                  </h2>
                  <p className="mt-2 max-w-md text-sm text-gray-text">
                    Ask about interviews, resumes, salary negotiation, remote work, or career planning.
                  </p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {STARTER_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => sendText(prompt)}
                        className="rounded-full border border-gray-200 px-4 py-2 text-sm transition-colors hover:border-purple hover:bg-purple/5"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                          msg.role === 'user'
                            ? 'bg-purple text-white'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                  {sending && (
                    <div className="flex justify-start">
                      <div className="rounded-2xl bg-muted px-4 py-3 text-sm text-gray-text">
                        Thinking...
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => { e.preventDefault(); sendText(input); }}
              className="border-t border-gray-100 p-4"
            >
              <div className="flex gap-3">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask your career coach..."
                  disabled={sending}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-purple"
                />
                <Button type="submit" variant="purple" disabled={sending || !input.trim()}>
                  <Send className="h-4 w-4" />
                  Send
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </PlanGate>
    </AppShell>
  );
}
