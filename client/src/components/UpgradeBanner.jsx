import { Link } from 'react-router-dom';

const PLAN_INFO = {
  student: {
    title: 'Upgrade to Student',
    description: 'Unlock gap analysis, course recommendations, and unlimited resume scans.',
    color: 'bg-purple',
  },
  pro: {
    title: 'Upgrade to Pro',
    description: 'Get job matching, cover letter generation, and an application tracker.',
    color: 'bg-blue',
  },
};

export default function UpgradeBanner({ requiredPlan = 'student' }) {
  const info = PLAN_INFO[requiredPlan] || PLAN_INFO.student;

  return (
    <div className={`${info.color} rounded-2xl p-8 text-white md:p-12`}>
      <div className="mx-auto max-w-lg text-center">
        <span className="rounded-full bg-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-wider">
          {requiredPlan} plan required
        </span>
        <h2 className="mt-4 text-2xl font-bold md:text-3xl">{info.title}</h2>
        <p className="mt-3 text-sm opacity-90 md:text-base">{info.description}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link
            to="/"
            className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-dark hover:opacity-90"
          >
            View plans
          </Link>
          <Link
            to="/apps/dashboard"
            className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold hover:bg-white/10"
          >
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
