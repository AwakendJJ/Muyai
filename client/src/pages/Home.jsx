import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FEATURES = [
  { color: 'bg-pink', tag: 'Resume scan', title: 'Skills that shine', desc: 'AI extracts and categorizes your skills from any resume in seconds.' },
  { color: 'bg-purple', tag: 'Gap analysis', title: 'Know what to learn', desc: 'See exactly which skills you need for your dream role.' },
  { color: 'bg-blue', tag: 'Recommendations', title: 'Your career roadmap', desc: 'Get course and career path suggestions tailored to African talent.' },
  { color: 'bg-orange', tag: 'Real momentum', title: 'Growth that sticks', desc: 'Build a clear plan instead of guessing your next career move.' },
  { color: 'bg-pink', tag: 'Never stuck', title: 'Direction on lock', desc: 'Always know what skill to learn next and why it matters.' },
  { color: 'bg-purple', tag: 'Level-up energy', title: 'Confidence to repeat', desc: 'Understand what works, why it works, and how to keep growing.' },
];

const STEPS = [
  { num: '01', color: 'bg-purple', title: 'Upload', desc: 'Drop your PDF resume and let AI extract your full skill profile.', topics: ['PDF parsing', 'Skill extraction', 'Proficiency levels', 'Category mapping'] },
  { num: '02', color: 'bg-orange', title: 'Analyze', desc: 'Compare your skills against target roles and find critical gaps.', topics: ['Gap analysis', 'Role matching', 'Importance ranking', 'Learning priorities'] },
  { num: '03', color: 'bg-pink', title: 'Grow', desc: 'Get career paths and courses to close your gaps and advance.', topics: ['Career paths', 'Course recs', 'Fit scoring', 'Actionable roadmap'] },
];

const TESTIMONIALS = [
  { name: 'Amara O.', quote: 'Muyai showed me exactly what skills I was missing for a data analyst role. I landed an internship within two months.' },
  { name: 'Kwame T.', quote: 'The course recommendations were spot on. I finally had a clear learning path instead of random YouTube videos.' },
  { name: 'Fatima A.', quote: 'As a computer science student, gap analysis helped me focus on what employers actually want. Game changer.' },
];

const FAQS = [
  { q: 'Is Muyai free to use?', a: 'Yes. The free plan includes 2 resume scans and a basic skill report. Upgrade to Student for unlimited scans, gap analysis, and recommendations.' },
  { q: 'What file formats are supported?', a: 'Currently PDF resumes only, up to 5MB. Ensure your resume has selectable text for best results.' },
  { q: 'Which AI provider does Muyai use?', a: 'Muyai supports Claude, OpenAI, and DeepSeek APIs. All AI calls are server-side — your API keys are never exposed.' },
  { q: 'Who is Muyai built for?', a: 'African students and early-career professionals who want AI-powered guidance to identify skills, close gaps, and plan their career.' },
];

const PLANS = [
  { name: 'Free', color: 'bg-pink', price: '$0', features: ['2 resume scans', 'Basic skill report', 'Proficiency breakdown'], popular: false },
  { name: 'Student', color: 'bg-purple', price: '$9', features: ['Unlimited scans', 'Gap analysis', 'Course recommendations', 'Career paths'], popular: true },
  { name: 'Pro', color: 'bg-blue', price: '$19', features: ['Everything in Student', 'Job matching', 'Cover letters', 'Application tracker'], popular: false },
];

function CheckIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

export default function Home() {
  const [openFaq, setOpenFaq] = useState(null);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const stepsRef = useRef(null);

  useGSAP(() => {
    const cards = heroRef.current?.querySelectorAll('.hero-card');
    if (cards?.length) {
      gsap.fromTo(
        cards,
        { y: 80, opacity: 0, rotate: (i) => (i === 0 ? -12 : i === 2 ? 12 : 0) },
        {
          y: 0,
          opacity: 1,
          rotate: (i) => (i === 0 ? -10 : i === 2 ? 10 : 0),
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
        }
      );
    }

    gsap.utils.toArray('.reveal-section').forEach((section) => {
      gsap.fromTo(
        section,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });
  }, { scope: heroRef });

  return (
    <div className="min-h-svh bg-surface">
      <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold tracking-tight">Muyai</Link>
          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#features" className="hover:text-pink transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-pink transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-pink transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-pink transition-colors">FAQ</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden text-sm font-medium text-gray-text hover:text-dark sm:block">
              Sign in
            </Link>
            <Link to="/register" className="btn-pill-dark text-sm">Get Started</Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-6 py-16 text-center md:py-28">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-bold tracking-tight md:text-7xl lg:text-8xl"
          >
            Elevate your career with AI
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-gray-text md:text-xl"
          >
            Upload your resume, discover your skills, identify gaps, and get personalized
            career and course recommendations built for African talent.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link to="/register" className="btn-pill-dark px-8 py-4 text-base">Get Started Free</Link>
            <a href="#features" className="btn-pill border border-dark/20 bg-white px-8 py-4 text-base text-dark hover:bg-muted">
              See Features
            </a>
          </motion.div>

          <div ref={heroRef} className="relative mx-auto mt-20 flex h-72 max-w-xl items-center justify-center">
            <div className="hero-card absolute left-4 top-10 h-52 w-40 rotate-[-10deg] rounded-3xl bg-gradient-to-br from-pink to-pink/70 shadow-2xl" />
            <div className="hero-card absolute z-10 flex h-60 w-44 items-center justify-center rounded-3xl bg-gradient-to-br from-purple to-purple/80 shadow-2xl">
              <span className="text-6xl">🚀</span>
            </div>
            <div className="hero-card absolute right-4 top-6 h-52 w-40 rotate-[10deg] rounded-3xl bg-gradient-to-br from-blue to-blue/70 shadow-2xl" />
          </div>
        </section>

        <section id="features" ref={featuresRef} className="reveal-section bg-muted py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-bold md:text-5xl">You&apos;ll love Muyai</h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-gray-text">
              Everything you need to understand your skills and plan your next move.
            </p>
            <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((card, i) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className={`${card.color} rounded-3xl p-8 text-white transition-transform hover:scale-[1.02]`}
                >
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-80">{card.tag}</span>
                  <h3 className="mt-4 text-xl font-bold">{card.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed opacity-90">{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="reveal-section py-20">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <h2 className="text-3xl font-bold md:text-4xl">Built for your career journey</h2>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {['Resume Upload', 'AI Analysis', 'Skill Gaps', 'Career Roadmap', 'Course Recs', 'Proficiency Tracking', 'Role Matching', 'African Talent'].map((skill) => (
                <span key={skill} className="pill-tag">
                  <CheckIcon />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="how-it-works" ref={stepsRef} className="reveal-section bg-muted py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-bold md:text-5xl">How it works</h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-gray-text">
              Three simple steps from resume to career roadmap.
            </p>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {STEPS.map((step) => (
                <div key={step.num} className={`${step.color} rounded-3xl p-8 text-white`}>
                  <span className="text-sm font-bold opacity-80">{step.num}</span>
                  <h3 className="mt-2 text-2xl font-bold">{step.title}</h3>
                  <p className="mt-3 text-sm opacity-90">{step.desc}</p>
                  <ul className="mt-6 space-y-2 text-sm">
                    {step.topics.map((t) => (
                      <li key={t} className="flex items-center gap-2 opacity-90">
                        <CheckIcon />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Link to="/register" className="btn-pill-dark px-8 py-4">Start your journey</Link>
            </div>
          </div>
        </section>

        <section className="reveal-section py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-bold md:text-4xl">Real stories from talent</h2>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="card-rounded p-8">
                  <p className="text-sm leading-relaxed text-gray-text">&ldquo;{t.quote}&rdquo;</p>
                  <p className="mt-6 font-bold">{t.name}</p>
                  <div className="mt-1 flex text-orange">★★★★★</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="reveal-section bg-muted py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-center text-3xl font-bold md:text-5xl">Choose your plan</h2>
            <p className="mx-auto mt-4 max-w-xl text-center text-gray-text">
              Start free. Upgrade when you need gap analysis and recommendations.
            </p>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {PLANS.map((plan) => (
                <div key={plan.name} className={`${plan.color} relative rounded-3xl p-8 text-white`}>
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-dark px-4 py-1 text-xs font-semibold">
                      Popular
                    </span>
                  )}
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="mt-2 text-4xl font-bold">
                    {plan.price}
                    <span className="text-base font-normal opacity-80">/mo</span>
                  </p>
                  <ul className="mt-6 space-y-3 text-sm">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <CheckIcon />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/register"
                    className="mt-8 block w-full rounded-full bg-white py-3 text-center text-sm font-semibold text-dark hover:opacity-90"
                  >
                    Get Started
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="faq" className="reveal-section py-20 md:py-28">
          <div className="mx-auto max-w-2xl px-6">
            <h2 className="text-center text-3xl font-bold md:text-4xl">Let&apos;s clear a few things up</h2>
            <div className="mt-12 divide-y divide-gray-100">
              {FAQS.map((faq, i) => (
                <div key={faq.q} className="py-5">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between text-left font-semibold"
                  >
                    {faq.q}
                    <span className="text-2xl text-gray-text">{openFaq === i ? '−' : '+'}</span>
                  </button>
                  {openFaq === i && (
                    <p className="mt-3 text-sm leading-relaxed text-gray-text">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="reveal-section bg-dark py-20 text-white md:py-28">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <h2 className="text-3xl font-bold md:text-5xl">Plan better. Grow smarter.</h2>
            <p className="mx-auto mt-4 max-w-xl text-white/70">
              Stop guessing what skills you need. Start building your career with direction and confidence.
            </p>
            <Link to="/register" className="btn-pill-pink mt-10 inline-flex px-10 py-4 text-base">
              Get Started Free
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <p className="text-xl font-bold">Muyai</p>
              <p className="mt-1 text-sm text-gray-text">AI-powered career development for African talent.</p>
            </div>
            <div className="flex gap-6 text-sm text-gray-text">
              <a href="#features" className="hover:text-dark">Features</a>
              <a href="#pricing" className="hover:text-dark">Pricing</a>
              <Link to="/login" className="hover:text-dark">Sign in</Link>
              <Link to="/register" className="hover:text-dark">Register</Link>
            </div>
          </div>
          <p className="mt-8 text-center text-xs text-gray-text md:text-left">
            &copy; 2026 Muyai. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
