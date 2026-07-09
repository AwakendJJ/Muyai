import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Check,
  ChevronDown,
  FileText,
  GraduationCap,
  MessageSquare,
  Sparkles,
  Star,
  Target,
  Users,
  Zap,
} from 'lucide-react';
import LandingNavbar from '../components/landing/LandingNavbar.jsx';
import LandingFooter from '../components/landing/LandingFooter.jsx';
import { cn } from '../lib/utils';
import { BRAND_TAGLINE } from '../config/brand.js';
import { CURRENCY_LABEL, SUBSCRIPTION_PLANS } from '../config/pricing.js';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=900&q=80&auto=format&fit=crop';
const FEATURE_IMAGE = 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format&fit=crop';
const DASHBOARD_IMAGE = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=900&q=80&auto=format&fit=crop';

const STATS = [
  { value: '12K+', label: 'Resumes analyzed' },
  { value: '4.9', label: 'User rating', icon: Star },
  { value: '85%', label: 'Found skill gaps' },
  { value: '50+', label: 'Target roles' },
];

const FEATURES = [
  {
    icon: FileText,
    tag: 'Resume AI',
    title: 'Instant skill extraction',
    desc: 'Upload any PDF resume and get a categorized skill profile with proficiency levels in seconds.',
    color: 'from-primary to-primary-light',
    image: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&q=80&auto=format&fit=crop',
  },
  {
    icon: Target,
    tag: 'Gap Analysis',
    title: 'Know exactly what to learn',
    desc: 'Compare your skills against target roles and see ranked gaps with learning priorities.',
    color: 'from-accent to-accent-warm',
    image: FEATURE_IMAGE,
  },
  {
    icon: GraduationCap,
    tag: 'Recommendations',
    title: 'Your personalized roadmap',
    desc: 'Get course suggestions and career paths tailored for African talent and local markets.',
    color: 'from-blue to-primary',
    image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&q=80&auto=format&fit=crop',
  },
  {
    icon: Briefcase,
    tag: 'Job Matching',
    title: 'Find roles that fit',
    desc: 'Discover matching jobs from Remotive and EthioJobs, ranked by your skill fit score.',
    color: 'from-navy to-primary-dark',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80&auto=format&fit=crop',
  },
  {
    icon: MessageSquare,
    tag: 'Interview Prep',
    title: 'Practice with AI coach',
    desc: 'Mock interviews, answer evaluation, and a career coach chat to build confidence.',
    color: 'from-primary-dark to-blue',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80&auto=format&fit=crop',
  },
  {
    icon: BarChart3,
    tag: 'Track Progress',
    title: 'Growth that sticks',
    desc: 'Application tracker, cover letter generator, and dashboards to measure your momentum.',
    color: 'from-accent-warm to-accent',
    image: DASHBOARD_IMAGE,
  },
];

const STEPS = [
  {
    num: '01',
    icon: FileText,
    title: 'Upload your resume',
    desc: 'Drop your PDF and let AI extract skills, proficiency levels, and categories automatically.',
  },
  {
    num: '02',
    icon: Target,
    title: 'Analyze your gaps',
    desc: 'Pick a target role and see exactly which skills you have, which you need, and why.',
  },
  {
    num: '03',
    icon: Zap,
    title: 'Grow with a plan',
    desc: 'Follow course recommendations, apply to matched jobs, and prep for interviews.',
  },
];

const APPS = [
  { icon: FileText, label: 'Resume Scanner', desc: 'AI skill extraction' },
  { icon: Target, label: 'Gap Analysis', desc: 'Role comparison' },
  { icon: GraduationCap, label: 'Recommendations', desc: 'Courses & paths' },
  { icon: Briefcase, label: 'Job Board', desc: 'Matched listings' },
  { icon: MessageSquare, label: 'Interview Prep', desc: 'AI mock sessions' },
  { icon: Sparkles, label: 'Career Coach', desc: '24/7 AI guidance' },
];

const TESTIMONIALS = [
  {
    name: 'Hanan K.',
    role: 'Data Analyst Intern',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80&auto=format&fit=crop&facepad=2',
    quote: 'Muyai showed me exactly what skills I was missing for a data analyst role. I landed an internship within two months.',
  },
  {
    name: 'Kwame T.',
    role: 'Software Developer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80&auto=format&fit=crop&facepad=2',
    quote: 'The course recommendations were spot on. I finally had a clear learning path instead of random YouTube videos.',
  },
  {
    name: 'Fatima A.',
    role: 'CS Student',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80&auto=format&fit=crop&facepad=2',
    quote: 'Gap analysis helped me focus on what employers actually want. It completely changed how I prepare for interviews.',
  },
];

const PLANS = SUBSCRIPTION_PLANS;

const FAQS = [
  { q: 'Is Muyai free to use?', a: 'Yes. The free plan includes 2 resume scans and a basic skill report. Upgrade to Student for unlimited scans, gap analysis, and recommendations.' },
  { q: 'What file formats are supported?', a: 'Currently PDF resumes only, up to 5MB. Ensure your resume has selectable text for best AI extraction results.' },
  { q: 'Which AI provider does Muyai use?', a: 'Muyai supports Claude, OpenAI, and DeepSeek APIs. All AI calls are server-side — your keys are never exposed to the browser.' },
  { q: 'Who is Muyai built for?', a: 'African students and early-career professionals who want AI-powered guidance to identify skills, close gaps, and plan their career with confidence.' },
  { q: 'Can I use Muyai without uploading a resume?', a: 'You need at least one resume upload to unlock skill analysis and gap reports. Registration is free and takes under a minute.' },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.5 },
};

export default function Home() {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-svh bg-surface">
      <LandingNavbar />

      <main>
        {/* Hero */}
        <section className="gradient-hero overflow-hidden">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/25">
                  <Sparkles className="h-6 w-6" />
                </span>
                <div>
                  <p className="font-display text-3xl font-bold tracking-tight md:text-4xl">Muyai</p>
                  <p className="mt-0.5 text-sm font-medium text-primary-dark md:text-base">{BRAND_TAGLINE}</p>
                </div>
              </div>
              <span className="section-label mt-8">
                <Sparkles className="h-3.5 w-3.5" />
                AI Career Platform
              </span>
              <h1 className="mt-6 font-display text-5xl font-extrabold leading-[1.08] tracking-tight md:text-6xl lg:text-7xl">
                Your career,{' '}
                <span className="text-gradient">powered by AI</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-text">
                Upload your resume, discover your skills, close gaps, and get personalized
                career guidance — built for African talent ready to grow.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link to="/register" className="btn-pill-primary px-8 py-4 text-base">
                  Get started free
                  <ArrowRight className="ml-1 inline h-4 w-4" />
                </Link>
                <a href="#features" className="btn-pill border border-border bg-white px-8 py-4 text-base text-dark hover:bg-muted">
                  Explore features
                </a>
              </div>
              <div className="mt-10 flex items-center gap-4">
                <div className="flex -space-x-3">
                  {TESTIMONIALS.map((t) => (
                    <img
                      key={t.name}
                      src={t.avatar}
                      alt=""
                      className="h-10 w-10 rounded-full border-2 border-surface object-cover"
                    />
                  ))}
                </div>
                <div>
                  <div className="flex text-accent">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-text">Trusted by 12,000+ professionals</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-3xl shadow-2xl shadow-primary/10">
                <img
                  src={HERO_IMAGE}
                  alt="Team collaborating on career growth"
                  className="aspect-[4/3] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/40 to-transparent" />
              </div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute -left-4 top-8 rounded-2xl border border-border bg-white p-4 shadow-xl md:-left-8"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-text">Skills found</p>
                    <p className="font-display text-lg font-bold">47 skills</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.65 }}
                className="absolute -right-4 bottom-8 rounded-2xl border border-border bg-white p-4 shadow-xl md:-right-8"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                    <Target className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-text">Gap score</p>
                    <p className="font-display text-lg font-bold text-primary">78% match</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats strip */}
        <section className="border-y border-border bg-white py-12">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                {...fadeUp}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="text-center"
              >
                <p className="font-display text-3xl font-bold md:text-4xl">{stat.value}</p>
                <p className="mt-1 text-sm text-gray-text">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features bento */}
        <section id="features" className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
              <span className="section-label">Features</span>
              <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
                Everything you need to grow
              </h2>
              <p className="mt-4 text-lg text-gray-text">
                From resume upload to job offer — one platform for your entire career journey.
              </p>
            </motion.div>

            <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {FEATURES.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    {...fadeUp}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                    className="group overflow-hidden rounded-3xl border border-border bg-white transition-shadow hover:shadow-lg"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img
                        src={feature.image}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className={cn('absolute inset-0 bg-gradient-to-t opacity-60', feature.color)} />
                      <div className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    </div>
                    <div className="p-6">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">{feature.tag}</span>
                      <h3 className="mt-2 font-display text-xl font-bold">{feature.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-text">{feature.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Product showcase */}
        <section className="bg-muted py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              <motion.div {...fadeUp}>
                <span className="section-label">Dashboard</span>
                <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
                  Your career command center
                </h2>
                <p className="mt-4 text-lg text-gray-text">
                  Track skills, gaps, applications, and interview prep — all in one beautiful dashboard
                  designed to keep you moving forward.
                </p>
                <ul className="mt-8 space-y-4">
                  {['Real-time skill proficiency charts', 'One-click gap analysis', 'Application pipeline tracker', 'AI coach always available'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-medium">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                        <Check className="h-3.5 w-3.5 text-primary" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className="btn-pill-primary mt-8 inline-flex">
                  Open your dashboard
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </motion.div>

              <motion.div
                {...fadeUp}
                transition={{ delay: 0.15 }}
                className="relative"
              >
                <div className="overflow-hidden rounded-3xl border border-border bg-white p-2 shadow-2xl">
                  <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                    <div className="h-3 w-3 rounded-full bg-accent-warm/60" />
                    <div className="h-3 w-3 rounded-full bg-accent/60" />
                    <div className="h-3 w-3 rounded-full bg-primary/60" />
                  </div>
                  <img
                    src={DASHBOARD_IMAGE}
                    alt="Muyai dashboard preview"
                    className="rounded-2xl"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 rounded-2xl border border-border bg-white p-5 shadow-xl">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-primary" />
                    <div>
                      <p className="font-display text-2xl font-bold">12K+</p>
                      <p className="text-xs text-gray-text">Active users</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
              <span className="section-label">How it works</span>
              <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
                Three steps to your next role
              </h2>
            </motion.div>

            <div className="relative mt-16 grid gap-8 md:grid-cols-3">
              <div className="absolute left-0 right-0 top-16 hidden h-0.5 bg-gradient-to-r from-primary via-accent to-primary md:block" />
              {STEPS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.num}
                    {...fadeUp}
                    transition={{ delay: i * 0.12 }}
                    className="relative rounded-3xl border border-border bg-white p-8 text-center shadow-sm"
                  >
                    <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/25">
                      <Icon className="h-7 w-7" />
                      <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                        {step.num}
                      </span>
                    </div>
                    <h3 className="mt-6 font-display text-xl font-bold">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-text">{step.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Apps grid */}
        <section id="apps" className="bg-navy py-20 text-white md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
                App Suite
              </span>
              <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
                Six tools. One career platform.
              </h2>
              <p className="mt-4 text-lg text-white/70">
                Every app unlocks as you grow — from free scans to full job search toolkit.
              </p>
            </motion.div>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {APPS.map((app, i) => {
                const Icon = app.icon;
                return (
                  <motion.div
                    key={app.label}
                    {...fadeUp}
                    transition={{ delay: i * 0.06 }}
                    className="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-colors hover:bg-white/10"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20 text-primary-light transition-colors group-hover:bg-primary group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold">{app.label}</h3>
                    <p className="mt-1 text-sm text-white/60">{app.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div {...fadeUp} className="text-center">
              <span className="section-label">Testimonials</span>
              <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
                Stories from our community
              </h2>
            </motion.div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {TESTIMONIALS.map((t, i) => (
                <motion.div
                  key={t.name}
                  {...fadeUp}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-3xl border border-border bg-white p-8 shadow-sm"
                >
                  <div className="flex text-accent">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-gray-text">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-6 flex items-center gap-3">
                    <img src={t.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                    <div>
                      <p className="font-display font-bold">{t.name}</p>
                      <p className="text-xs text-gray-text">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="bg-muted py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-6">
            <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
              <span className="section-label">Pricing</span>
              <h2 className="mt-4 font-display text-4xl font-bold md:text-5xl">
                Start free. Upgrade when ready.
              </h2>
              <p className="mt-4 text-lg text-gray-text">
                No credit card required. Cancel anytime. Prices in Ethiopian Birr ({CURRENCY_LABEL}).
              </p>
            </motion.div>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {PLANS.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  {...fadeUp}
                  transition={{ delay: i * 0.1 }}
                  className={cn(
                    'relative flex flex-col rounded-3xl border bg-white p-8 shadow-sm',
                    plan.accent,
                    plan.popular && 'scale-[1.02] shadow-lg shadow-primary/10'
                  )}
                >
                  {plan.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-white">
                      Most popular
                    </span>
                  )}
                  <h3 className="font-display text-2xl font-bold">{plan.name}</h3>
                  <p className="mt-1 text-sm text-gray-text">{plan.desc}</p>
                  <p className="mt-6 font-display text-5xl font-bold">
                    {plan.price === 0 ? (
                      'Free'
                    ) : (
                      <>
                        <span className="text-lg font-semibold text-primary-dark">{CURRENCY_LABEL}</span>{' '}
                        {plan.priceDisplay}
                      </>
                    )}
                    {plan.price > 0 && (
                      <span className="text-base font-normal text-gray-text">/mo</span>
                    )}
                  </p>
                  <ul className="mt-8 flex-1 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-3 text-sm">
                        <Check className="h-4 w-4 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/register"
                    className={cn(
                      'mt-8 block w-full rounded-xl py-3.5 text-center text-sm font-semibold transition-all',
                      plan.popular
                        ? 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20'
                        : 'border border-border bg-white hover:bg-muted'
                    )}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-20 md:py-28">
          <div className="mx-auto max-w-3xl px-6">
            <motion.div {...fadeUp} className="text-center">
              <span className="section-label">FAQ</span>
              <h2 className="mt-4 font-display text-4xl font-bold">
                Common questions
              </h2>
            </motion.div>

            <div className="mt-12 space-y-3">
              {FAQS.map((faq, i) => (
                <motion.div
                  key={faq.q}
                  {...fadeUp}
                  transition={{ delay: i * 0.05 }}
                  className="overflow-hidden rounded-2xl border border-border bg-white"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="flex w-full items-center justify-between px-6 py-5 text-left font-display font-semibold"
                  >
                    {faq.q}
                    <ChevronDown
                      className={cn(
                        'h-5 w-5 shrink-0 text-gray-text transition-transform',
                        openFaq === i && 'rotate-180'
                      )}
                    />
                  </button>
                  {openFaq === i && (
                    <div className="border-t border-border px-6 pb-5 pt-2">
                      <p className="text-sm leading-relaxed text-gray-text">{faq.a}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-navy py-20 md:py-28">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-primary blur-3xl" />
            <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-accent blur-3xl" />
          </div>
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <motion.div {...fadeUp}>
              <h2 className="font-display text-4xl font-bold text-white md:text-5xl">
                Ready to grow your career?
              </h2>
              <p className="mt-4 text-lg text-white/70">
                Join thousands of African professionals using AI to find direction, close skill gaps, and land better roles.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-4">
                <Link to="/register" className="btn-pill-primary px-10 py-4 text-base">
                  Get started free
                </Link>
                <Link to="/login" className="btn-pill border border-white/20 bg-white/10 px-10 py-4 text-base text-white hover:bg-white/20">
                  Sign in
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
