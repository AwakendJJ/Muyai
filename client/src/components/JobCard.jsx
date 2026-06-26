import { ExternalLink, MapPin, Building2, BookmarkPlus } from 'lucide-react';
import { Badge } from './ui/badge.jsx';
import { Button } from './ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card.jsx';

function matchVariant(score) {
  if (score >= 70) return 'pro';
  if (score >= 40) return 'student';
  return 'locked';
}

export default function JobCard({ job, onTrack, tracking }) {
  const hasMatch = typeof job.match_score === 'number';

  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-base leading-snug">{job.title}</CardTitle>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-text">
              <span className="inline-flex items-center gap-1">
                <Building2 className="h-3.5 w-3.5" />
                {job.company}
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" />
                {job.location}
              </span>
            </div>
          </div>
          {hasMatch && (
            <Badge variant={matchVariant(job.match_score)} className="shrink-0">
              {job.match_score}% match
            </Badge>
          )}
          {job.source === 'ethiojobs' && (
            <Badge variant="student" className="shrink-0 text-xs">
              EthioJobs
            </Badge>
          )}
          {job.source === 'remotive' && (
            <Badge variant="blue" className="shrink-0 text-xs">
              Remote
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col pt-0">
        <p className="line-clamp-3 text-sm text-gray-text">
          {job.description?.replace(/<[^>]+>/g, '') || 'No description available.'}
        </p>

        {job.matched_skills?.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.matched_skills.slice(0, 5).map((skill) => (
              <Badge key={skill} variant="default" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-xs text-gray-text">
            {job.salary_label
              || (job.salary_min && job.salary_max
                ? `${job.salary_min.toLocaleString()} – ${job.salary_max.toLocaleString()}`
                : job.salary_min || job.salary_max
                  ? 'Salary available'
                  : 'Salary not listed')}
          </span>

          {job.url && (
            <Button variant="outline" size="sm" asChild>
              <a href={job.url} target="_blank" rel="noopener noreferrer">
                Apply
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          )}
          {onTrack && (
            <Button variant="outline" size="sm" onClick={() => onTrack(job)} disabled={tracking}>
              <BookmarkPlus className="h-3.5 w-3.5" />
              {tracking ? 'Saving...' : 'Track'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
