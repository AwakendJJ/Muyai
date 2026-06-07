import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as resumesApi from '../api/resumes.js';
import AppLayout from '../components/layout/AppLayout.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import SkillTable from '../components/SkillTable.jsx';
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
        if (list.length > 0) {
          return loadSkills(list[0].id);
        }
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
      <AppLayout>
        <LoadingSpinner />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Resume</h1>
          <p className="mt-1 text-gray-text">Upload your resume and view extracted skills</p>
        </div>
        {scanLimit !== null && (
          <div className="pill-tag text-xs">
            {scanCount}/{scanLimit} scans used
          </div>
        )}
      </div>

      {error && (
        <div className="mt-6 rounded-xl bg-pink/10 px-4 py-3 text-sm text-pink">
          {error}
        </div>
      )}

      {atScanLimit ? (
        <div className="mt-8 card-rounded border-2 border-purple/20 bg-purple/5 p-8 text-center">
          <h2 className="text-xl font-bold">Scan limit reached</h2>
          <p className="mt-2 text-gray-text">
            Free plan includes {scanLimit} resume scans. Upgrade to student for unlimited scans and gap analysis.
          </p>
          <Link to="/dashboard" className="btn-pill-purple mt-6 inline-flex">
            View upgrade options
          </Link>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          className={`mt-8 card-rounded border-2 border-dashed p-12 text-center transition-colors ${
            dragOver ? 'border-purple bg-purple/5' : 'border-gray-200'
          }`}
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue/10 text-2xl">
            📄
          </div>
          <h2 className="mt-4 text-lg font-bold">Drop your resume here</h2>
          <p className="mt-2 text-sm text-gray-text">PDF only, max 5MB</p>
          <label className="btn-pill-dark mt-6 inline-flex cursor-pointer">
            {uploading ? 'Analyzing...' : 'Choose PDF'}
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              disabled={uploading}
              onChange={onFileChange}
            />
          </label>
        </div>
      )}

      {resumes.length > 0 && (
        <div className="mt-10">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-bold">Your resumes</h2>
            <div className="flex flex-wrap gap-2">
              {resumes.map((resume) => (
                <button
                  key={resume.id}
                  type="button"
                  onClick={() => loadSkills(resume.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedResume?.id === resume.id
                      ? 'bg-purple text-white'
                      : 'bg-white text-dark border border-gray-200 hover:border-purple'
                  }`}
                >
                  {resume.filename}
                </button>
              ))}
            </div>
          </div>

          {selectedResume && (
            <div className="mt-6">
              <p className="text-sm text-gray-text">
                {selectedResume.filename} · {skills.length} skills extracted
              </p>
              <div className="mt-4">
                <SkillTable skills={skills} />
              </div>
            </div>
          )}
        </div>
      )}

      {user?.plan === 'free' && !atScanLimit && (
        <p className="mt-6 text-center text-sm text-gray-text">
          {scanLimit - scanCount} scan{scanLimit - scanCount !== 1 ? 's' : ''} remaining on free plan
        </p>
      )}
    </AppLayout>
  );
}
