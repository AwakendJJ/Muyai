export default function Home() {
  return (
    <div className="min-h-svh bg-surface">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-xl font-bold tracking-tight">Muyai</span>
        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          <a href="#features" className="hover:text-pink transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-pink transition-colors">How it works</a>
          <a href="#pricing" className="hover:text-pink transition-colors">Pricing</a>
        </nav>
        <a href="/register" className="btn-pill-dark text-sm">
          Get Started
        </a>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 py-16 text-center md:py-24">
          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            Elevate your career with AI
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-text">
            Upload your resume, discover your skills, identify gaps, and get personalized
            career and course recommendations built for African talent.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="/register" className="btn-pill-dark px-8 py-4 text-base">
              Get Started Free
            </a>
            <a href="#features" className="btn-pill border border-dark/20 bg-white text-dark px-8 py-4 text-base hover:bg-muted">
              See Features
            </a>
          </div>

          <div className="relative mx-auto mt-16 flex h-64 max-w-lg items-center justify-center">
            <div className="absolute left-0 top-8 h-48 w-36 rotate-[-8deg] rounded-2xl bg-pink shadow-lg" />
            <div className="absolute z-10 h-52 w-40 rounded-2xl bg-purple shadow-xl" />
            <div className="absolute right-0 top-4 h-48 w-36 rotate-[8deg] rounded-2xl bg-blue shadow-lg" />
          </div>
        </section>

        <section id="features" className="bg-muted py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-bold md:text-4xl">You&apos;ll love Muyai</h2>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { color: 'bg-pink', tag: 'Resume scan', title: 'Skills that shine', desc: 'AI extracts and categorizes your skills from any resume.' },
                { color: 'bg-purple', tag: 'Gap analysis', title: 'Know what to learn', desc: 'See exactly which skills you need for your target role.' },
                { color: 'bg-blue', tag: 'Recommendations', title: 'Your career roadmap', desc: 'Get course and career path suggestions tailored to you.' },
              ].map((card) => (
                <div key={card.title} className={`${card.color} rounded-2xl p-8 text-white`}>
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-80">{card.tag}</span>
                  <h3 className="mt-4 text-xl font-bold">{card.title}</h3>
                  <p className="mt-2 text-sm opacity-90">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">How it works</h2>
            <div className="mt-12 flex flex-wrap justify-center gap-3">
              {['Resume Upload', 'AI Analysis', 'Skill Gaps', 'Career Roadmap', 'Course Recs'].map((skill) => (
                <span key={skill} className="pill-tag">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-muted py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-bold md:text-4xl">Choose your plan</h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                { name: 'Free', color: 'bg-pink', price: '$0', features: ['2 resume scans', 'Basic skill report'] },
                { name: 'Student', color: 'bg-purple', price: '$9', features: ['Unlimited scans', 'Gap analysis', 'Course recommendations'], popular: true },
                { name: 'Pro', color: 'bg-blue', price: '$19', features: ['Everything in Student', 'Job matching', 'Cover letters', 'Application tracker'] },
              ].map((plan) => (
                <div key={plan.name} className={`${plan.color} relative rounded-2xl p-8 text-white`}>
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-dark px-4 py-1 text-xs font-semibold">
                      Popular
                    </span>
                  )}
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="mt-2 text-4xl font-bold">{plan.price}<span className="text-base font-normal opacity-80">/mo</span></p>
                  <ul className="mt-6 space-y-2 text-sm">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button type="button" className="mt-8 w-full rounded-full bg-white py-3 text-sm font-semibold text-dark hover:opacity-90">
                    Get Started
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-12">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-gray-text">
          <p className="font-bold text-dark">Muyai</p>
          <p className="mt-2">AI-powered career development for African talent.</p>
          <p className="mt-6">&copy; 2026 Muyai. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
