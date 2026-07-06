/**
 * End-to-end API workflow test for all Muyai apps.
 * Run: node scripts/workflow-test.js
 */
import dotenv from 'dotenv';
import { getAuth } from 'firebase-admin/auth';
import { initFirebaseAdmin } from '../config/firebase.js';
import supabase from '../config/db.js';

dotenv.config();

const BASE = `http://127.0.0.1:${process.env.PORT || 5000}/api`;
const FIREBASE_API_KEY = process.env.FIREBASE_WEB_API_KEY || 'AIzaSyDpf0ksNN24pDO2cX1LV3Qqktus-NVMGp8';

const results = [];

function pass(step, detail = '') {
  results.push({ step, status: 'PASS', detail });
  console.log(`✓ ${step}${detail ? ` — ${detail}` : ''}`);
}

function fail(step, detail = '') {
  results.push({ step, status: 'FAIL', detail });
  console.error(`✗ ${step}${detail ? ` — ${detail}` : ''}`);
}

function skip(step, detail = '') {
  results.push({ step, status: 'SKIP', detail });
  console.log(`○ ${step}${detail ? ` — ${detail}` : ''}`);
}

async function getIdToken(firebaseUid) {
  initFirebaseAdmin();
  const customToken = await getAuth().createCustomToken(firebaseUid);
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=${FIREBASE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: customToken, returnSecureToken: true }),
    }
  );
  const body = await response.json();
  if (!response.ok) {
    throw new Error(body.error?.message || 'Failed to get ID token');
  }
  return body.idToken;
}

async function api(method, path, { token, body, formData } = {}) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body && !formData) headers['Content-Type'] = 'application/json';

  const response = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: formData || (body ? JSON.stringify(body) : undefined),
    signal: AbortSignal.timeout(120000),
  });

  const data = await response.json().catch(() => ({}));
  return { ok: response.ok, status: response.status, data };
}

async function main() {
  console.log('\n=== Muyai Workflow Test ===\n');

  // 0. Health
  try {
    const { ok, data } = await api('GET', '/health');
    if (ok && data.data?.status === 'ok') {
      pass('Health', `DB=${data.data.database}, AI=${data.data.ai?.configured}, EthioJobs=${data.data.jobs?.ethiojobs}`);
      if (data.data.phase5 === 'ready') {
        pass('Phase 5 schema', 'all tables present');
      } else {
        fail('Phase 5 schema', `missing: ${JSON.stringify(data.data.phase5_tables || {})}`);
        console.error('\n  → Run database/phase5-only.sql in Supabase SQL Editor\n');
      }
    } else {
      fail('Health', JSON.stringify(data));
      return summarize();
    }
  } catch (e) {
    fail('Health', e.message);
    return summarize();
  }

  // Pick user with resume data
  const { data: users } = await supabase
    .from('users')
    .select('id, email, firebase_uid, plan, role')
    .not('firebase_uid', 'is', null)
    .order('id');

  const userWithResume = users?.find((u) => u.id === 2) || users?.[0];
  if (!userWithResume) {
    fail('Auth setup', 'No Firebase-linked user in database');
    return summarize();
  }

  let token;
  try {
    token = await getIdToken(userWithResume.firebase_uid);
    pass('Auth token', userWithResume.email);
  } catch (e) {
    fail('Auth token', e.message);
    return summarize();
  }

  // 1. Auth /me
  {
    const { ok, data } = await api('GET', '/auth/me', { token });
    ok && data.data?.user?.email ? pass('Profile / Auth me', data.data.user.email) : fail('Profile / Auth me', data.error);
  }

  // 2. Resume Lab — list
  let resumeId;
  {
    const { ok, data } = await api('GET', '/resumes', { token });
    const resumes = data.data?.resumes || [];
    resumeId = resumes[0]?.id;
    ok && resumes.length > 0
      ? pass('Resume Lab — list', `${resumes.length} resume(s)`)
      : fail('Resume Lab — list', data.error || 'no resumes');
  }

  // 3. Resume Lab — skills
  if (resumeId) {
    const { ok, data } = await api('GET', `/resumes/${resumeId}/skills`, { token });
    const skills = data.data?.skills || [];
    ok && skills.length > 0
      ? pass('Resume Lab — skills', `${skills.length} skills`)
      : fail('Resume Lab — skills', data.error || 'no skills');
  }

  // 4. Gap Analysis — job roles
  let jobRoleId;
  {
    const { ok, data } = await api('GET', '/analysis/job-roles', { token });
    const roles = data.data?.job_roles || [];
    jobRoleId = roles[0]?.id;
    ok && roles.length > 0
      ? pass('Gap Analysis — job roles', `${roles.length} roles`)
      : fail('Gap Analysis — job roles', data.error || 'empty');
  }

  // 5. Gap Analysis — run
  if (resumeId && jobRoleId) {
    const { ok, data } = await api('POST', '/analysis/gap', {
      token,
      body: { resumeId, jobRoleId },
    });
    const gaps = data.data?.gaps || [];
    ok && gaps.length >= 0
      ? pass('Gap Analysis — run', `${gaps.length} gaps for ${data.data?.job_role?.title}`)
      : fail('Gap Analysis — run', data.error);
  }

  // 6. Gap Analysis — get saved
  if (resumeId && jobRoleId) {
    const { ok, data } = await api('GET', `/analysis/gaps/${resumeId}?jobRoleId=${jobRoleId}`, { token });
    ok ? pass('Gap Analysis — fetch gaps', `${(data.data?.gaps || []).length} gaps`) : fail('Gap Analysis — fetch gaps', data.error);
  }

  // 7. Recommendations
  if (resumeId) {
    const { ok, data } = await api('GET', `/recommendations/${resumeId}`, { token });
    const careers = data.data?.career_paths || data.data?.careers || [];
    const courses = data.data?.courses || [];
    if (ok && (careers.length > 0 || courses.length > 0)) {
      pass('Recommendations — get', `${careers.length} careers, ${courses.length} courses`);
    } else if (ok) {
      const refresh = await api('POST', `/recommendations/${resumeId}/refresh`, { token });
      const rc = refresh.data?.data?.career_paths || refresh.data?.data?.careers || [];
      const rco = refresh.data?.data?.courses || [];
      refresh.ok && (rc.length > 0 || rco.length > 0)
        ? pass('Recommendations — refresh', `${rc.length} careers, ${rco.length} courses`)
        : fail('Recommendations', refresh.data?.error || 'empty after refresh');
    } else {
      fail('Recommendations', data.error);
    }
  }

  // 8. Job Match — countries
  {
    const { ok, data } = await api('GET', '/jobs/countries', { token });
    ok && (data.data?.countries?.length > 0)
      ? pass('Job Match — countries', `${data.data.countries.length} countries`)
      : fail('Job Match — countries', data.error);
  }

  // 9. Job Match — remote search
  {
    const { ok, data } = await api('GET', '/jobs/search?query=developer&country=remote', { token });
    const jobs = data.data?.jobs || [];
    ok && jobs.length > 0
      ? pass('Job Match — remote search', `${jobs.length} jobs (${data.data?.provider})`)
      : fail('Job Match — remote search', data.error || 'no jobs');
  }

  // 10. Job Match — Ethiopia
  {
    const { ok, data } = await api('GET', '/jobs/search?query=engineer&country=et', { token });
    const jobs = data.data?.jobs || [];
    ok && jobs.length > 0
      ? pass('Job Match — Ethiopia', `${jobs.length} jobs (${data.data?.provider})`)
      : fail('Job Match — Ethiopia', data.error || `provider=${data.data?.provider}, pending=${data.data?.ethiojobs_pending}`);
  }

  // 11. Job Match — skill match
  if (resumeId) {
    const { ok, data } = await api('GET', `/jobs/match?resumeId=${resumeId}&country=remote`, { token });
    const jobs = data.data?.jobs || [];
    ok && jobs.length > 0
      ? pass('Job Match — skill match', `${jobs.length} jobs, top score ${jobs[0]?.match_score}`)
      : fail('Job Match — skill match', data.error);
  }

  // 12. Applications — create
  let applicationId;
  {
    const { ok, data } = await api('POST', '/applications', {
      token,
      body: {
        job_title: 'Workflow Test Engineer',
        company: 'Muyai QA',
        location: 'Addis Ababa',
        job_url: 'https://ethiojobs.net',
        status: 'saved',
      },
    });
    applicationId = data.data?.application?.id;
    ok && applicationId
      ? pass('Applications — create', `id=${applicationId}`)
      : fail('Applications — create', data.error);
  }

  // 13. Applications — list & stats
  {
    const list = await api('GET', '/applications', { token });
    const stats = await api('GET', '/applications/stats', { token });
    list.ok && stats.ok
      ? pass('Applications — list & stats', `${(list.data.data?.applications || []).length} apps, total=${stats.data.data?.total}`)
      : fail('Applications — list/stats', list.data?.error || stats.data?.error);
  }

  // 14. Cover Letters — generate
  let coverLetterId;
  if (resumeId) {
    const { ok, data } = await api('POST', '/cover-letters/generate', {
      token,
      body: {
        resume_id: resumeId,
        job_title: 'Software Engineer',
        company: 'Tech Company',
        job_description: 'Build web apps with React and Node.js',
      },
    });
    coverLetterId = data.data?.cover_letter?.id;
    ok && data.data?.cover_letter?.content
      ? pass('Cover Letters — generate', `id=${coverLetterId}, demo=${data.data?.demo_mode}`)
      : fail('Cover Letters — generate', data.error);
  }

  // 15. Cover Letters — list
  {
    const { ok, data } = await api('GET', '/cover-letters', { token });
    ok ? pass('Cover Letters — list', `${(data.data?.cover_letters || []).length} letters`) : fail('Cover Letters — list', data.error);
  }

  // 16. Interview Prep — start session
  let sessionId;
  {
    const { ok, data } = await api('POST', '/interview/sessions', {
      token,
      body: { job_title: 'Software Engineer', experience_level: 'junior' },
    });
    sessionId = data.data?.session?.id;
    const questions = data.data?.session?.questions || [];
    ok && sessionId && questions.length > 0
      ? pass('Interview Prep — start', `${questions.length} questions, demo=${data.data?.demo_mode}`)
      : fail('Interview Prep — start', data.error);
  }

  // 17. Interview Prep — submit answer
  if (sessionId) {
    const { ok, data } = await api('POST', `/interview/sessions/${sessionId}/answer`, {
      token,
      body: {
        question_index: 0,
        answer: 'I would approach this by breaking the problem into smaller tasks, writing tests first, and collaborating with the team.',
      },
    });
    ok && data.data?.feedback
      ? pass('Interview Prep — feedback', `score=${data.data?.score}`)
      : fail('Interview Prep — feedback', data.error);
  }

  // 18. Career Coach — chat
  {
    const { ok, data } = await api('POST', '/coach/chat', {
      token,
      body: { message: 'What skills should I focus on for a software engineer role in Ethiopia?' },
    });
    ok && data.data?.reply
      ? pass('Career Coach — chat', `demo=${data.data?.demo_mode}, ${data.data.reply.slice(0, 60)}...`)
      : fail('Career Coach — chat', data.error);
  }

  // 19. Career Coach — messages
  {
    const { ok, data } = await api('GET', '/coach/messages', { token });
    ok ? pass('Career Coach — history', `${(data.data?.messages || []).length} messages`) : fail('Career Coach — history', data.error);
  }

  // 20. Admin — expect 403 for non-admin
  {
    const { status, data } = await api('GET', '/admin/users', { token });
    status === 403
      ? pass('Admin — access control', 'correctly blocked non-admin')
      : status === 200
        ? pass('Admin — users', `${(data.data?.users || []).length} users`)
        : fail('Admin', data.error || `status ${status}`);
  }

  // Cleanup test application
  if (applicationId) {
    await api('DELETE', `/applications/${applicationId}`, { token });
  }

  summarize();
}

function summarize() {
  const passed = results.filter((r) => r.status === 'PASS').length;
  const failed = results.filter((r) => r.status === 'FAIL').length;
  const skipped = results.filter((r) => r.status === 'SKIP').length;

  console.log('\n=== Summary ===');
  console.log(`PASS: ${passed}  FAIL: ${failed}  SKIP: ${skipped}`);

  if (failed > 0) {
    console.log('\nFailed steps:');
    results.filter((r) => r.status === 'FAIL').forEach((r) => console.log(`  - ${r.step}: ${r.detail}`));
    process.exit(1);
  }
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
