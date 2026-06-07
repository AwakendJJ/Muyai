const PLAN_STYLES = {
  free: 'plan-badge-free',
  student: 'plan-badge-student',
  pro: 'plan-badge-pro',
};

export default function PlanBadge({ plan }) {
  const style = PLAN_STYLES[plan] || PLAN_STYLES.free;

  return (
    <span className={style}>
      {plan?.charAt(0).toUpperCase() + plan?.slice(1)} plan
    </span>
  );
}
