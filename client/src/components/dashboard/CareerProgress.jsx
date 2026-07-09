import { Link } from 'react-router-dom';
import { Check, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx';
import { Progress } from '../ui/progress.jsx';
import { cn } from '../../lib/utils';

const STEPS = [
  { id: 'resume', label: 'Upload resume', path: '/apps/resume' },
  { id: 'skills', label: 'Skills extracted', path: '/apps/resume' },
  { id: 'applications', label: 'Track applications', path: '/apps/applications' },
  { id: 'interview', label: 'Interview stage', path: '/apps/interview' },
];

function getStepStatus(stepId, { hasResume, hasSkills, hasApplications, hasInterviewStage }) {
  switch (stepId) {
    case 'resume':
      return hasResume;
    case 'skills':
      return hasSkills;
    case 'applications':
      return hasApplications;
    case 'interview':
      return hasInterviewStage;
    default:
      return false;
  }
}

export default function CareerProgress({
  hasResume,
  hasSkills,
  hasApplications,
  hasInterviewStage,
}) {
  const flags = { hasResume, hasSkills, hasApplications, hasInterviewStage };
  const completed = STEPS.filter((s) => getStepStatus(s.id, flags)).length;
  const progressPct = Math.round((completed / STEPS.length) * 100);

  const nextStep = STEPS.find((s) => !getStepStatus(s.id, flags));

  return (
    <Card className="border-primary/15 bg-gradient-to-br from-primary/5 to-transparent">
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="font-display">Career journey progress</CardTitle>
          <span className="text-sm font-semibold text-primary">{progressPct}% complete</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <Progress value={progressPct} className="h-3" />

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => {
            const done = getStepStatus(step.id, flags);
            return (
              <Link
                key={step.id}
                to={step.path}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm transition-colors',
                  done
                    ? 'border-primary/20 bg-primary/5 text-primary-dark'
                    : 'border-border bg-white text-gray-text hover:border-primary/30 hover:bg-muted/50'
                )}
              >
                {done ? (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                ) : (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-border">
                    <Circle className="h-2 w-2 fill-gray-text/40 text-transparent" />
                  </span>
                )}
                <span className={cn('font-medium', done && 'text-dark')}>{step.label}</span>
              </Link>
            );
          })}
        </div>

        {nextStep && progressPct < 100 && (
          <p className="text-sm text-gray-text">
            <span className="font-medium text-dark">Next step:</span>{' '}
            <Link to={nextStep.path} className="font-semibold text-primary hover:underline">
              {nextStep.label}
            </Link>
          </p>
        )}
        {progressPct === 100 && (
          <p className="text-sm font-medium text-primary-dark">
            You&apos;re on track — keep building momentum!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
