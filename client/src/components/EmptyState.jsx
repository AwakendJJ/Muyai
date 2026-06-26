import { Link } from 'react-router-dom';
import { Button } from './ui/button.jsx';

export default function EmptyState({ icon: Icon, title, description, actionLabel, onAction, actionTo, className }) {
  return (
    <div className={`rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm ${className || ''}`}>
      {Icon && (
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
          <Icon className="h-7 w-7 text-gray-text" />
        </div>
      )}
      <h3 className="mt-4 text-lg font-bold">{title}</h3>
      {description && <p className="mx-auto mt-2 max-w-sm text-sm text-gray-text">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="purple" className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
      {actionLabel && actionTo && (
        <Button variant="purple" className="mt-6" asChild>
          <Link to={actionTo}>{actionLabel}</Link>
        </Button>
      )}
    </div>
  );
}
