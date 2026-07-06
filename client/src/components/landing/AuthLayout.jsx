import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import Logo from '../brand/Logo.jsx';

const AUTH_IMAGE = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=900&q=80&auto=format&fit=crop';

const HIGHLIGHTS = [
  'AI resume skill extraction',
  'Personalized gap analysis',
  'Career paths & course recs',
  'Job matching & interview prep',
];

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-svh">
      <div className="relative hidden w-[45%] overflow-hidden lg:flex lg:flex-col">
        <img
          src={AUTH_IMAGE}
          alt="Professional ready to grow their career"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="gradient-auth absolute inset-0 opacity-90 mix-blend-multiply" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
          <Logo to="/" className="[&_span:last-child]:text-white" />

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="font-display text-4xl font-bold leading-tight"
            >
              {title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 max-w-md text-lg text-white/80"
            >
              {subtitle}
            </motion.p>

            <ul className="mt-8 space-y-3">
              {HIGHLIGHTS.map((item, i) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                  className="flex items-center gap-3 text-sm text-white/90"
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-accent" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-white/60">
            Join thousands building their career with Muyai
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center bg-muted px-6 py-12">
        <div className="mb-8 lg:hidden">
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
