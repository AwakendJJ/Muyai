export default function LoadingSpinner({ className = '' }) {
  return (
    <div className={`flex justify-center py-20 ${className}`}>
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple border-t-transparent" />
    </div>
  );
}
