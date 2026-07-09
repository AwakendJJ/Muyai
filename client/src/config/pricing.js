/** Subscription tiers — prices in Ethiopian Birr (ETB) */
export const CURRENCY_CODE = 'ETB';
export const CURRENCY_LABEL = 'ETB';

export const SUBSCRIPTION_PLANS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    priceDisplay: 'Free',
    desc: 'Perfect to get started',
    features: ['2 resume scans', 'Basic skill report', 'Proficiency breakdown', 'Dashboard access'],
    cta: 'Start free',
    popular: false,
    accent: 'border-border',
  },
  {
    id: 'student',
    name: 'Student',
    price: 550,
    priceDisplay: '550',
    desc: 'For serious learners',
    features: ['Unlimited scans', 'Gap analysis', 'Course recommendations', 'Career paths', 'Interview prep'],
    cta: 'Get Student',
    popular: true,
    accent: 'border-primary ring-2 ring-primary/20',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 1100,
    priceDisplay: '1,100',
    desc: 'Full career toolkit',
    features: ['Everything in Student', 'Job matching', 'Cover letters', 'Application tracker', 'Priority AI'],
    cta: 'Go Pro',
    popular: false,
    accent: 'border-border',
  },
];

export function formatPlanPrice(plan) {
  if (plan.price === 0) return 'Free';
  return `${plan.priceDisplay} ${CURRENCY_LABEL}`;
}
