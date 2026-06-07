import { useAuth } from '../context/AuthContext.jsx';
import UpgradeBanner from './UpgradeBanner.jsx';

const PLAN_RANK = { free: 0, student: 1, pro: 2 };

export default function PlanGate({ minimumPlan = 'student', children }) {
  const { user } = useAuth();

  if (PLAN_RANK[user?.plan] < PLAN_RANK[minimumPlan]) {
    return <UpgradeBanner requiredPlan={minimumPlan} />;
  }

  return children;
}
