import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Upload } from 'lucide-react';
import * as resumesApi from '../api/resumes.js';
import AppShell from '../components/layout/AppShell.jsx';
import PageHeader from '../components/layout/PageHeader.jsx';
import ErrorBanner from '../components/ErrorBanner.jsx';
import EmptyState from '../components/EmptyState.jsx';
import SkillTable from '../components/SkillTable.jsx';
import { Badge } from '../components/ui/badge.jsx';
import { Button } from '../components/ui/button.jsx';
import { Card, CardContent } from '../components/ui/card.jsx';
import { Skeleton } from '../components/ui/skeleton.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Resume() {
  const { token, user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [scanCount, setScanCount] = useState(0);
  const [scanLimit, setScanLimit] = useState(null);
  const [selectedResume, setSelectedResume] = useState(null);
  const [skills, setSkills] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const atScanLimit = scanLimit !== null && scanCount >= scanLimit;

  const loadResumes = useCallback(async () => {
    const response = await resumesApi.listResumes(token);
    setResumes(response.data.resumes);
    setScanCount(response.data.scan_count);
    setScanLimit(response.data.scan_limit);
    return response.data.resumes;
  }, [token]);

  const loadSkills = useCallback(async (resumeId) => {
    const response = await resumesApi.getSkills(token, resumeId);
    setSelectedResume(response.data.resume);
    setSkills(response.data.skills);
  }, [token]);

  useEffect(() => {
    loadResumes()
      .then((list) => {
        if (list.length > 0) return loadSkills(list[0].id);
        return null;
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [loadResumes, loadSkills]);

  async function handleUpload(file) {
    if (!file || file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const response = await resumesApi.uploadResume(token, file);
      await loadResumes();
      setSelectedResume(response.data.resume);
      setSkills(response.data.skills);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  }

  function onFileChange(e) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  }

  if (loading) {
    return (
      <AppShell>
        <Skeleton className="h-10 w-48" />
        <Skeleton className="mt-8 h-48" />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        title="Resume Lab"
        description="Upload your resume and view extracted skills"
      >
        {scanLimit !== null && (
          <Badge variant="student">{scanCount}/{scanLimit} scans</Badge>
        )}
      </PageHeader>

      {error && <ErrorBanner message={error} className="mt-6" />}

      {atScanLimit ? (
        <Card className="mt-8 border-2 border-purple/20 bg-purple/5 p-8 text-center">
          <CardContent className="p-0">
            <h2 className="text-xl font-bold">Scan limit reached</h2>
            <p className="mt-2 text-gray-text">
              Free plan includes {scanLimit} resume scans. Upgrade to student for unlimited scans.
            </p>
            <Button variant="purple" className="mt-6" asChild>
              <Link to="/apps/dashboard">View upgrade options</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`mt-8 border-2 border-dashed p-12 text-center transition-colors ${
            dragOver ? 'border-purple bg-purple/5' : 'border-gray-200'
          }`}
        >
          <CardContent className="p-0">
            {uploading ? (
              <div className="space-y-4">
                <Skeleton className="mx-auto h-16 w-16 rounded-2xl" />
                <Skeleton className="mx-auto h-6 w-48" />
                <p className="text-sm text-gray-text">Analyzing your resume...</p>
              </div>
            ) : (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue/10">
                  <Upload className="h-8 w-8 text-blue" />
                </div>
                <h2 className="mt-4 text-lg font-bold">Drop your resume here</h2>
                <p className="mt-2 text-sm text-gray-text">PDF only, max 5MB</p>
                <label>
                  <Button variant="default" className="mt-6 cursor-pointer" asChild>
                    <span>
                      Choose PDF
                      <input
                        type="file"
                        accept="application/pdf"
                        className="hidden"
                        disabled={uploading}
                        onChange={onFileChange}
                      />
                    </span>
                  </Button>
                </label>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {resumes.length > 0 && (
        <div className="mt-10">
          <Tabs
            value={String(selectedResume?.id || resumes[0]?.id)}
            onValueChange={(val) => loadSkills(Number(val))}
          >
            <TabsList className="flex-wrap h-auto gap-1">
              {resumes.map((resume) => (
                <TabsTrigger key={resume.id} value={String(resume.id)} className="text-xs">
                  {resume.filename}
                </TabsTrigger>
              ))}
            </TabsList>

            {resumes.map((resume) => (
              <TabsContent key={resume.id} value={String(resume.id)}>
                <p className="text-sm text-gray-text">
                  {resume.filename} · {skills.length} skills extracted
                </p>
                <div className="mt-4">
                  <SkillTable skills={skills} />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      )}

      {resumes.length === 0 && !atScanLimit && (
        <EmptyState
          icon={FileText}
          title="No resumes yet"
          description="Upload your first PDF resume to extract skills with AI."
          className="mt-8"
        />
      )}

      {user?.plan === 'free' && !atScanLimit && scanLimit !== null && (
        <p className="mt-6 text-center text-sm text-gray-text">
          {scanLimit - scanCount} scan{scanLimit - scanCount !== 1 ? 's' : ''} remaining on free plan
        </p>
      )}
    </AppShell>
  );
}
