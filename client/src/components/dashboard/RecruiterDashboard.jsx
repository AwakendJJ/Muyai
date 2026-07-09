import {
  Briefcase,
  Calendar,
  Filter,
  MapPin,
  MoreHorizontal,
  Search,
  Star,
  UserPlus,
  Users,
} from 'lucide-react';
import { Badge } from '../ui/badge.jsx';
import { Button } from '../ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx';
import { Progress } from '../ui/progress.jsx';
import { cn } from '../../lib/utils';

const MOCK_STATS = [
  { label: 'Open roles', value: '12', icon: Briefcase, color: 'text-primary' },
  { label: 'Active candidates', value: '248', icon: Users, color: 'text-blue' },
  { label: 'Shortlisted', value: '34', icon: Star, color: 'text-accent' },
  { label: 'Interviews', value: '8', icon: Calendar, color: 'text-accent-warm' },
];

const MOCK_JOBS = [
  { title: 'Junior Data Analyst', location: 'Addis Ababa · Hybrid', applicants: 42, match: 78 },
  { title: 'Frontend Developer', location: 'Remote', applicants: 67, match: 85 },
  { title: 'Product Designer', location: 'Nairobi · On-site', applicants: 29, match: 72 },
];

const MOCK_CANDIDATES = [
  { name: 'Hanan K.', role: 'Data Analyst', match: 92, status: 'shortlisted', skills: ['Python', 'SQL', 'Excel'] },
  { name: 'Kwame T.', role: 'Software Developer', match: 88, status: 'interview', skills: ['React', 'Node.js', 'TypeScript'] },
  { name: 'Fatima A.', role: 'Product Designer', match: 81, status: 'review', skills: ['Figma', 'UI/UX', 'Research'] },
  { name: 'Daniel M.', role: 'DevOps Engineer', match: 76, status: 'new', skills: ['Docker', 'AWS', 'CI/CD'] },
  { name: 'Selam H.', role: 'Data Analyst', match: 94, status: 'shortlisted', skills: ['Python', 'Tableau', 'Statistics'] },
];

const STATUS_STYLES = {
  new: 'bg-muted text-gray-text',
  review: 'bg-accent/10 text-accent',
  shortlisted: 'bg-primary/10 text-primary-dark',
  interview: 'bg-blue/10 text-blue',
};

export default function RecruiterDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl font-bold">Recruiter hub</h2>
            <Badge variant="locked" className="text-xs">Preview</Badge>
          </div>
          <p className="mt-1 text-sm text-gray-text">
            Discover talent by skills, not just keywords. UI preview — functionality coming soon.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          <Button variant="primary" size="sm" disabled>
            <UserPlus className="h-4 w-4" />
            Post a role
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {MOCK_STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-muted">
                  <Icon className={cn('h-5 w-5', stat.color)} />
                </div>
                <div>
                  <p className="text-sm text-gray-text">{stat.label}</p>
                  <p className="font-display text-2xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Candidate pipeline</CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-text" />
              <input
                type="text"
                placeholder="Search candidates..."
                disabled
                className="input-field h-9 w-48 pl-9 text-xs opacity-60"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-y border-border bg-muted/50 text-left text-xs font-semibold uppercase tracking-wider text-gray-text">
                    <th className="px-6 py-3">Candidate</th>
                    <th className="px-4 py-3">Target role</th>
                    <th className="px-4 py-3">Match</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Top skills</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {MOCK_CANDIDATES.map((c) => (
                    <tr key={c.name} className="transition-colors hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary-dark">
                            {c.name.split(' ').map((n) => n[0]).join('')}
                          </div>
                          <span className="font-medium">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-gray-text">{c.role}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Progress value={c.match} className="h-1.5 w-16" />
                          <span className="text-xs font-semibold text-primary">{c.match}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize', STATUS_STYLES[c.status])}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {c.skills.map((s) => (
                            <span key={s} className="rounded-md bg-muted px-1.5 py-0.5 text-xs text-gray-text">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Active job postings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {MOCK_JOBS.map((job) => (
                <div key={job.title} className="rounded-xl border border-border p-4">
                  <p className="font-semibold">{job.title}</p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-gray-text">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-gray-text">{job.applicants} applicants</span>
                    <span className="font-semibold text-primary">{job.match}% avg match</span>
                  </div>
                  <Progress value={job.match} className="mt-2 h-1.5" />
                </div>
              ))}
              <Button variant="outline" className="w-full" size="sm" disabled>
                View all postings
              </Button>
            </CardContent>
          </Card>

          <Card className="border-dashed border-primary/30 bg-primary/5">
            <CardContent className="p-5 text-center">
              <Briefcase className="mx-auto h-8 w-8 text-primary" />
              <p className="mt-3 text-sm font-semibold">Recruiter tools launching soon</p>
              <p className="mt-1 text-xs text-gray-text">
                Skill-based search, AI shortlisting, and pipeline analytics for employers.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
