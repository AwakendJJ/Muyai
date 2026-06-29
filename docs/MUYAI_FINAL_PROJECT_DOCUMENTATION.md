# Muyai — AI Career Platform for African Talent

## Final Project Submission Documentation

**Unity University | Faculty of Computational Sciences and Software Engineering**

---

## Abstract

Manual resume screening and fragmented career guidance create significant inefficiencies for job seekers and employers, particularly in the Ethiopian and broader African labor markets, where existing platforms function mainly as job-advertisement portals rather than intelligent, end-to-end career-development tools. Job seekers often lack objective insight into how their skills compare to market demand, how to close competency gaps, and how to manage applications from discovery through interview preparation.

**Muyai** addresses this gap through a modular web-based platform that uses artificial intelligence to parse resumes, score competencies, identify skill gaps against target roles, recommend career paths and courses, match users to live job listings, and support the full application workflow—including application tracking, cover letter generation, interview practice, and personalized career coaching. The system integrates Firebase Authentication, a Node.js/Express API, Supabase (PostgreSQL) persistence, and pluggable AI providers (Claude, OpenAI, or DeepSeek), with multi-source job APIs including Remotive (remote roles), EthioJobs (via Parse API), and Adzuna (African markets).

This document presents the system's background, requirements analysis, architectural design, database schema, implementation work completed across five development phases, and recommendations for deployment and future enhancement—establishing a traceable foundation for an accessible, AI-driven career development platform tailored to African talent.

---

## Acknowledgement

First, we would like to give thanks to Almighty God for giving us this opportunity. We would like to express our sincere gratitude to our advisor, **Instructor Mezgebe Manaye**, for his continuous guidance, valuable feedback, and patience throughout the development of this project. His insights at every milestone review were instrumental in shaping both the direction and the quality of this work.

We are also grateful to **Unity University** and the **Faculty of Computational Sciences and Software Engineering** for providing the academic environment, resources, and support that made this project possible.

Our appreciation extends to one another as a team—**Eyosiyas Getachew, Yonatan Abebe, Amanuel Aklok, Mikiyas Amha, and Dagim Jida**—for the collaboration, commitment, and shared effort that carried this project from initial concept through design and implementation, despite the constraints of a demanding academic timeline.

We also give special thanks to our families and friends for their unwavering encouragement and support throughout this journey.

---

## Table of Contents

**CHAPTER ONE – INTRODUCTION**
- 1.1 Background Information
- 1.2 Statement of the Problem
- 1.3 Objectives (General and Specific)
- 1.4 Scope of the Project
- 1.5 Tools and Methodologies
- 1.6 Beneficiaries
- 1.7 Schedule

**CHAPTER TWO – PROJECT MANAGEMENT**
- 2.1 Introduction
- 2.2 Project Planning – WBS
- 2.3 Resource Planning
- 2.4 Financial Planning
- 2.5 Team Organization
- 2.6 Process Model
- 2.7 Risk RMMM Plan

**CHAPTER THREE – SYSTEM ANALYSIS**
- 3.1 Introduction
- 3.2 Current System Overview
- 3.3 Proposed System Overview
- 3.4 System Models – Requirement Determination
- 3.5 System Models – Analysis

**CHAPTER FOUR – SYSTEM DESIGN**
- 4.1 Introduction
- 4.2 Design Goals
- 4.3 Design Trade-offs
- 4.4 Subsystem Decomposition
- 4.5 Design Phase Models

**CHAPTER FIVE – IMPLEMENTATION**
- 5.1 Introduction
- 5.2 Sample Source Code

**CHAPTER SIX – CONCLUSION AND RECOMMENDATION**
- 6.1 Conclusion
- 6.2 Recommendation

**REFERENCES / BIBLIOGRAPHY**

---

# CHAPTER ONE: INTRODUCTION

## 1.1 Background Information

In today's rapidly evolving digital economy, employers frequently receive large volumes of applications for each vacancy. Traditional resume screening remains largely manual, time-consuming, and susceptible to inconsistency and unconscious bias. Research indicates that recruiters often spend only a few seconds on initial resume review, which can result in overlooked talent and prolonged hiring cycles.

Simultaneously, job seekers—especially students, graduates, and early-career professionals in Africa—face challenges in presenting qualifications effectively, understanding market expectations, and managing the full job-search lifecycle. Many lack objective skill visibility, personalized learning guidance, and integrated tools that connect resume analysis, job discovery, application tracking, and interview preparation in one platform.

Artificial Intelligence has emerged as a transformative tool in human resources and professional development. Modern systems can analyze resumes, extract skills, compare profiles against role requirements, and suggest career pathways. However, many existing tools focus on formatting or keyword optimization rather than comprehensive, localized career development.

**Muyai** is designed to address these shortcomings by offering an intelligent, modular, user-friendly platform that:

- Analyzes resumes and evaluates skills
- Identifies gaps against target job roles
- Recommends courses and career paths
- Matches users to live job listings (remote and African markets)
- Tracks applications and supports cover letters, interview prep, and AI career coaching

By integrating AI, modern web technologies, cloud databases, and career-development workflows, Muyai empowers African talent to understand their capabilities, improve employability, and make informed career decisions.

## 1.2 Statement of the Problem

The current job application and career development ecosystem is characterized by interconnected inefficiencies:

1. **Manual and fragmented screening** — Recruiters face high operational costs; applicants are evaluated inconsistently.
2. **Poor resume quality and self-awareness** — Many applicants, particularly students, cannot align resumes with role requirements or ATS expectations.
3. **Lack of objective skill visibility** — Without benchmarks, job seekers cannot measure abilities against market standards.
4. **Absence of personalized career guidance** — Generic advice dominates; few tools tailor recommendations to individual profiles and local labor markets.
5. **Disconnected job-search workflow** — Discovery, application tracking, cover letters, and interview practice typically require separate tools.
6. **Limited localization** — Global platforms often ignore Ethiopian and African employment contexts; local portals (e.g., EthioJobs) function primarily as listing sites without deep career analysis.

Existing technological solutions rarely integrate resume analysis, skill evaluation, recommendations, job matching, and application management into a single cohesive system.

## 1.3 Objectives

### 1.3.1 General Objective

To design and develop an AI-powered web-based career platform that enhances employability for African talent by automating resume analysis, evaluating skills, delivering personalized recommendations, matching users to jobs, and supporting the complete apply-and-grow workflow.

### 1.3.2 Specific Objectives

1. To implement secure user registration and authentication using Firebase, synchronized with a Supabase user profile.
2. To design and implement automated resume upload, PDF text extraction, and AI-based skill parsing.
3. To develop a skill gap analysis module comparing user competencies against predefined job roles.
4. To build a recommendation engine suggesting career paths and courses based on identified skill gaps.
5. To integrate multi-provider job search and skill-based job matching (Remotive, EthioJobs, Adzuna).
6. To implement an application tracker with status management and dashboard statistics.
7. To provide AI-generated cover letters, interview practice sessions, and a career coach chat interface.
8. To deliver a modular app-shell UI with dashboard, admin analytics, and tiered plan structure (free, student, pro).
9. To log AI usage for administrative monitoring and cost tracking.

## 1.4 Scope of the Project

**In scope:**

- Web application for job seekers, students, and professionals
- Eleven live application modules under `/apps/*` plus admin panel
- AI resume parsing, gap analysis, and recommendations
- Job search/match and application lifecycle tools
- Firebase Auth + Supabase PostgreSQL backend
- Demo-mode fallbacks when external API keys are not configured

**Out of scope (future extensions):**

- Native mobile applications
- Direct recruiter hiring portal and candidate contact
- Guaranteed job placement
- Full Amharic NLP and UI localization (planned)
- Formal payment/subscription billing integration

**Limitations:**

- AI accuracy depends on resume quality and configured API keys
- Job listing coverage depends on third-party APIs (Remotive, Parse/EthioJobs, Adzuna)
- Plan gating is implemented but disabled by default during development

## 1.5 Tools and Methodologies

### 1.5.1 Data Collection Methodologies

A mixed-methods approach informed system design:

- **Primary:** Stakeholder interviews and surveys with job seekers, students, and career advisors; review of EthioJobs, Afriworks, and remote job platforms.
- **Secondary:** Review of NLP/resume-analysis literature, ESCO skill taxonomy references, and analysis of competing tools (LinkedIn, Resume Worded, etc.).

### 1.5.2 System Development Methodology

The project follows **SDLC with Agile-inspired iterations** across five phases:

| Phase | Focus |
|-------|--------|
| Phase 1 | Design system, app shell, layout components |
| Phase 2 | Firebase authentication and user sync |
| Phase 3 | App registry, routing, profile |
| Phase 4 | Job Match (search, match scoring, providers) |
| Phase 5 | Apply & Grow (applications, cover letters, interview, coach) |

Activities per SDLC stage: requirements → design → implementation → testing → deployment.

### 1.5.3 Development Tools

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite 8, Tailwind CSS 4, Recharts, GSAP, React Router |
| Backend | Node.js, Express.js, Multer, pdf-parse |
| Database | Supabase (PostgreSQL) |
| Authentication | Firebase Auth (client) + Firebase Admin (server) |
| AI | Claude, OpenAI, or DeepSeek via unified `ai.service.js` |
| Job APIs | Remotive, EthioJobs (Parse), Adzuna |
| Version Control | Git / GitHub |
| IDE | Visual Studio Code / Cursor |
| Design | Figma (Tokko-inspired visual language) |
| Deployment (planned) | Vercel (frontend), Render/Railway (backend) |

## 1.6 Beneficiaries

| Stakeholder | Benefit |
|-------------|---------|
| **Students & Graduates** | Skill insight, gap analysis, and guided entry into the job market |
| **Job Seekers** | Resume improvement, job matching, application tracking |
| **Professionals** | Upskilling recommendations and interview preparation |
| **Institutions** | Admin usage analytics and aggregate AI usage reporting |
| **African Remote Workers** | Access to global remote listings via Remotive integration |

## 1.7 Schedule

**Total Duration:** 16 Weeks (4 Months)

| Phase | Weeks | Activities |
|-------|-------|------------|
| Documentation & Analysis | 1–4 | Requirements, use cases, architecture, UI prototypes |
| Design | 5–6 | Schema, API design, component library |
| Implementation Phases 1–3 | 7–10 | UI shell, auth, career tools |
| Implementation Phases 4–5 | 11–13 | Job match, apply & grow modules |
| Testing & Deployment | 14–15 | Integration testing, hosting setup |
| Final Documentation | 16 | Defense preparation, submission |

---

# CHAPTER TWO: PROJECT MANAGEMENT

## 2.1 Introduction

Project management ensures coordinated delivery of Muyai within academic constraints. Given integration of React, Express, Supabase, Firebase, AI APIs, and external job providers, structured planning, risk management, and milestone reviews are essential.

## 2.2 Project Planning – WBS

### 2.2.1 Work Breakdown Structure

| Level | Phase | Deliverable |
|-------|--------|-------------|
| 1 | Project Initiation | Project charter, scope, stakeholder map |
| 2 | System Analysis | SRS, use cases, FR/NFR tables |
| 3 | System Design | Architecture, ERD, API spec, UI wireframes |
| 4 | Implementation | Working frontend, backend, database |
| 5 | Testing | Unit, integration, UAT |
| 6 | Deployment & Maintenance | Hosted MVP, bug fixes, documentation |

### 2.2.2 Project Schedule

| WBS | Phase | Weeks | Milestone |
|-----|--------|-------|-----------|
| 1 | Initiation | 1–2 | Charter approved |
| 2 | Analysis | 3–4 | SRS finalized |
| 3 | Design | 5–6 | Design document complete |
| 4 | Implementation | 7–13 | All five phases live |
| 5 | Testing | 14 | UAT passed |
| 6 | Deployment | 15–16 | Production deployment |

*[ Figure 2.1: Project Schedule Gantt Chart ]*

## 2.3 Resource Planning

### 2.3.1 Human Resource Planning

| Resource | Role | Responsibilities | Hrs/wk |
|----------|------|------------------|--------|
| Eyosiyas Getachew | Project Leader | Coordination, integration, reporting | 20 |
| Yonatan Abebe | Frontend Developer | React UI, app shell, pages | 15 |
| Amanuel Aklok | Backend Developer | Express API, auth, services | 15 |
| Mikiyas Amha | Database Specialist | Supabase schema, migrations | 15 |
| Dagim Jida | AI/Integration Developer | AI service, job APIs, Phase 5 modules | 15 |
| Instructor Mezgebe Manaye | Advisor | Reviews, guidance | 5 |

### 2.3.2 Material / Equipment Planning

| Item | Purpose |
|------|---------|
| Laptops (5) | Development and testing |
| External storage | Backup of code and documentation |
| Internet connectivity | API testing, GitHub, Supabase, Firebase |

### 2.3.3 Software Resource Planning

All core stack components are open-source or free-tier cloud services (Supabase, Firebase, Vercel, Render).

## 2.4 Financial Planning

### 2.4.3 Project Budget (Estimated)

| Category | Cost (ETB) |
|----------|------------|
| Team meetings & transport | 2,000 |
| Printing & documentation | 1,500 |
| External storage | 1,500 |
| Internet data | 3,000 |
| Contingency | 1,000 |
| **Total** | **9,000** |

## 2.5 Team Organization

Flat collaborative structure with designated project leader. Communication via Telegram, GitHub, and bi-weekly advisor meetings.

## 2.6 Process Model

**SDLC** selected for documentation rigor and milestone alignment. Iterative feedback applied within Implementation for AI accuracy and UI usability.

## 2.7 Risk RMMM Plan

| ID | Risk | Sev. | Likelihood | Mitigation |
|----|------|------|------------|------------|
| R1 | Schedule overrun | 3 | 4 | MVP prioritization, phase gating |
| R2 | AI API integration failure | 4 | 3 | Multi-provider support, demo mode |
| R3 | External job API unavailable | 3 | 4 | Remotive fallback, graceful degradation |
| R4 | Scope creep | 3 | 4 | Frozen phase plan, app registry |
| R5 | Firebase/Supabase misconfiguration | 3 | 3 | `.env.example`, health endpoint |
| R6 | Data privacy exposure | 4 | 2 | Service-role key server-only, Firebase rules |
| R7 | Key person dependency | 2 | 3 | Git documentation, modular code |
| R8 | Inadequate testing | 3 | 3 | Incremental testing per phase |
| R9 | Internet instability | 3 | 4 | Offline-first docs, deferred API tasks |

---

# CHAPTER THREE: SYSTEM ANALYSIS

## 3.1 Introduction

System analysis identifies gaps in current career platforms and defines what Muyai must accomplish. Comparative analysis of EthioJobs, Afriworks, LinkedIn, and AI resume tools informed functional and non-functional requirements.

## 3.2 Current System Overview

Existing systems in Ethiopia and globally exhibit these limitations:

- **Job portals** (EthioJobs, Afriwork): Listing and apply links only; no skill analysis or recommendations.
- **LinkedIn**: Networking and endorsements; limited objective assessment.
- **Resume optimizers**: Keyword/format focus; no application workflow or localized coaching.
- **Fragmentation**: Users juggle separate tools for resumes, courses, jobs, and interview prep.

## 3.3 Proposed System Overview

Muyai is a **modular single-page application** with an app registry driving navigation. Users authenticate via Firebase; the server syncs profiles to Supabase and exposes REST APIs for all career modules.

### 3.3.1 Functional Requirements

| FR ID | Requirement | Description |
|-------|-------------|-------------|
| FR-01 | User Authentication | Register/login via Firebase; sync to Supabase via `POST /api/auth/sync` |
| FR-02 | Resume Upload | PDF upload (max 5MB); text extraction via pdf-parse |
| FR-03 | AI Resume Parse | Extract skills, education, experience, suggested roles |
| FR-04 | Skill Display | List skills with proficiency levels per resume |
| FR-05 | Gap Analysis | Compare skills against job roles; store skill gaps |
| FR-06 | Recommendations | AI career paths and course suggestions |
| FR-07 | Job Search | Search jobs by country, keywords, location |
| FR-08 | Job Match | Score jobs against resume skills (0–100%) |
| FR-09 | Application Tracker | CRUD applications with status workflow |
| FR-10 | Cover Letters | AI-generated letters linked to applications |
| FR-11 | Interview Prep | Session-based Q&A with AI feedback |
| FR-12 | Career Coach | Persistent chat with context-aware guidance |
| FR-13 | Dashboard | Stats: plan, scans, skills, applications |
| FR-14 | Admin Panel | User list and AI usage analytics |
| FR-15 | Plan Gating | Tier-based access (configurable on/off) |

### 3.3.2 Non-Functional Requirements

| NFR ID | Category | Requirement |
|--------|----------|-------------|
| NFR-01 | Performance | API responses under 3s for standard requests |
| NFR-02 | Performance | AI resume parse under 30s |
| NFR-03 | Usability | Responsive UI (320px–1920px); Tokko design language |
| NFR-04 | Security | Firebase ID token on all protected routes |
| NFR-05 | Security | Supabase service role never exposed to client |
| NFR-06 | Reliability | Health check endpoint; graceful AI demo fallback |
| NFR-07 | Maintainability | MVC structure: routes → controllers → models/services |
| NFR-08 | Scalability | Stateless API; cloud-hosted database |
| NFR-09 | Portability | Modern browser support; Vite production build |
| NFR-10 | Integration | Pluggable AI and job providers via environment variables |

## 3.4 System Models – Requirement Determination

### 3.4.1 Essential Use Case Modeling

**Actors:**

| Actor | Description |
|-------|-------------|
| User (Job Seeker/Student) | Primary consumer of all career apps |
| Administrator | Platform admin; views users and AI usage |
| System (AI Engine) | Resume parse, gaps, recommendations, coach |
| External Job APIs | Remotive, EthioJobs, Adzuna |

**Essential Use Cases:**

| # | Use Case | Primary Actor |
|---|----------|---------------|
| UC-01 | Register / Login | User |
| UC-02 | Upload & Parse Resume | User, AI Engine |
| UC-03 | Run Gap Analysis | User, AI Engine |
| UC-04 | View Recommendations | User, AI Engine |
| UC-05 | Search & Match Jobs | User |
| UC-06 | Track Application | User |
| UC-07 | Generate Cover Letter | User, AI Engine |
| UC-08 | Practice Interview | User, AI Engine |
| UC-09 | Chat with Career Coach | User, AI Engine |
| UC-10 | View Admin Analytics | Administrator |

*[ Figure 3.1: Essential Use Case Diagram ]*

### 3.4.1.2 Use Case Documentation (Sample)

**USE CASE: Upload & Parse Resume (UC-02)**

| Field | Details |
|-------|---------|
| Preconditions | User authenticated; PDF resume available (≤5MB) |
| Main Flow | User uploads PDF → server extracts text → AI parses skills → results stored in Supabase |
| Postconditions | Resume and skills records created; dashboard updated |
| Exceptions | Invalid file type; insufficient text; AI key missing (error returned) |

### 3.4.2 Essential UI Prototype

Key screens: Home/Landing, Login/Register, Dashboard, Resume Lab, Gap Analysis, Recommendations, Job Match, Applications, Cover Letters, Interview Prep, Career Coach, Profile, Admin.

*[ Figures 3.2–3.12: UI Wireframes ]*

### 3.4.3 User Interface Flow Diagram

Primary flow: **Login → Dashboard → Resume Upload → Gap Analysis → Recommendations → Job Match → Track Application → Cover Letter → Interview Prep**

### 3.4.4 Supplementary Specifications

**Business Rules:**

1. Only authenticated users access `/apps/*` routes.
2. Resume uploads limited to PDF; max 5MB.
3. Free plan: 2 resume scans when plan gating enabled.
4. Application statuses: saved, applied, interviewing, offer, rejected, withdrawn.
5. AI features use demo templates when no API key is configured.
6. Admin role required for `/admin` routes.

**Constraints:**

- Academic 16-week timeline
- Free-tier cloud services for hosting
- English-language interface initially
- Internet required for AI and job APIs

**Change Cases:** Mobile app, Amharic UI, recruiter module, payment integration, LinkedIn import, enterprise multi-tenant deployment.

## 3.5 System Models – Analysis

### 3.5.1 System Use Case Diagram

System-level use cases add `<<include>>` relationships for authentication, validation, and database persistence on all write operations.

### 3.5.2 Sequence Diagrams (Descriptions)

1. **Resume Upload:** User → React → Express → pdf-parse → AI Service → Supabase → Response
2. **Job Match:** User → React → Express → Jobs Service → Remotive/Adzuna API → Score algorithm → Response
3. **Cover Letter Generate:** User → Express → Resume model → AI Service → cover_letters table

*[ Figures 3.13–3.15: Sequence Diagrams ]*

### 3.5.3 Activity Diagrams (Descriptions)

1. End-to-end resume analysis pipeline
2. Job search with provider fallback (EthioJobs → Remotive)
3. Application lifecycle state machine

*[ Figures 3.16–3.18: Activity Diagrams ]*

---

# CHAPTER FOUR: SYSTEM DESIGN

## 4.1 Introduction

System design translates Chapter 3 requirements into implementable architecture: layered frontend/backend, Supabase schema, AI service abstraction, and job provider integration.

## 4.2 Design Goals

| # | Goal | Description |
|---|------|-------------|
| 1 | Modularity | App registry; independent route modules per feature |
| 2 | Performance | Async AI calls; indexed database queries |
| 3 | Security | Firebase token verification; server-only secrets |
| 4 | Usability | App shell, sidebar, mobile nav, consistent design tokens |
| 5 | Extensibility | New job/AI providers via env configuration |
| 6 | Graceful Degradation | Demo mode without API keys |
| 7 | Traceability | AI usage logging per feature |
| 8 | Deployability | Static frontend + Node API separation |

## 4.3 Design Trade-offs

| Trade-off | Decision | Justification |
|-----------|----------|---------------|
| Microservices vs Monolith | Modular monolith (Express) | Faster delivery within academic timeline |
| Python AI vs Node AI | Unified Node `ai.service.js` | Simpler deployment; no separate Python service |
| MySQL vs PostgreSQL | Supabase (PostgreSQL) | Managed cloud DB, JSONB support |
| Custom auth vs Firebase | Firebase Auth | Secure, fast implementation |
| Strict plan gating vs Open access | Gating implemented, disabled by default | Easier testing; enable in production |

## 4.4 Subsystem Decomposition

### 4.4.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│              Presentation Layer (React + Vite)           │
│  AppShell, Pages, API Client, AuthContext, App Registry  │
└───────────────────────────┬─────────────────────────────┘
                            │ HTTPS / REST / JSON
┌───────────────────────────▼─────────────────────────────┐
│              Application Layer (Express.js)              │
│  Routes → Controllers → Services → Models                │
└───────┬───────────────────────────────┬─────────────────┘
        │                               │
┌───────▼────────┐              ┌───────▼─────────────────┐
│  Supabase PG   │              │  External Services       │
│  (PostgreSQL)  │              │  Firebase, AI APIs, Jobs   │
└────────────────┘              └──────────────────────────┘
```

### 4.4.2 Subsystem Summary

| Subsystem | Technology | Responsibility |
|-----------|------------|----------------|
| Presentation | React, Tailwind | UI, routing, state |
| Application | Express | API, auth middleware, business logic |
| Data | Supabase | Persistence |
| Intelligence | ai.service.js | NLP prompts, JSON validation |
| Jobs | jobs.service.js | Provider abstraction, matching |
| Security | Firebase Admin, middleware | Token verify, plan/admin gates |

### 4.4.3 API Modules

| Prefix | Module |
|--------|--------|
| `/api/auth` | Sync, profile |
| `/api/resumes` | Upload, list, skills |
| `/api/analysis` | Job roles, gaps |
| `/api/recommendations` | Career/course suggestions |
| `/api/jobs` | Countries, search, match |
| `/api/applications` | Tracker CRUD, stats |
| `/api/cover-letters` | Generate, edit, list |
| `/api/interview` | Sessions, answer feedback |
| `/api/coach` | Chat history, messages |
| `/api/admin` | Users, AI usage |

## 4.5 Design Phase Models

### 4.5.1 Class Modeling (Core Entities)

| Entity | Key Attributes | Key Relationships |
|--------|----------------|-------------------|
| User | id, name, email, firebase_uid, plan, role | 1:N Resumes, Applications |
| Resume | id, user_id, filename, raw_text | 1:N Skills |
| Skill | resume_id, skill_name, proficiency_level | N:1 Resume |
| JobRole | title, required_skills (JSONB) | 1:N SkillGaps |
| SkillGap | resume_id, job_role_id, missing_skill | N:1 Resume, JobRole |
| Recommendation | resume_id, type, title, url | N:1 Resume |
| Application | job_title, company, status, job_url | N:1 User |
| CoverLetter | job_title, company, content | N:1 User |
| InterviewSession | job_title, questions (JSONB) | N:1 User |
| CoachMessage | role, content | N:1 User |
| AIUsage | feature, provider, tokens_used | N:1 User |

### 4.5.2 Persistent Data Model

**Tables (14):** `users`, `resumes`, `skills`, `job_roles`, `skill_gaps`, `recommendations`, `ai_usage`, `applications`, `cover_letters`, `interview_sessions`, `coach_messages`

#### Table 4.1: users

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGSERIAL | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | UNIQUE, NOT NULL |
| firebase_uid | TEXT | UNIQUE |
| plan | TEXT | free, student, pro |
| role | TEXT | user, admin |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

#### Table 4.2: applications

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGSERIAL | PRIMARY KEY |
| user_id | BIGINT | FK → users |
| job_title | VARCHAR(255) | NOT NULL |
| company | VARCHAR(255) | NOT NULL |
| status | TEXT | saved, applied, interviewing, offer, rejected, withdrawn |
| job_url | VARCHAR(500) | nullable |
| applied_at | TIMESTAMPTZ | nullable |

*[ Figure 4.1: Entity-Relationship Diagram ]*

### 4.5.2.2 Normalization

Schema is in **Third Normal Form (3NF)**:

- Users separated from resumes (eliminates partial dependency)
- Skills in separate table (eliminates multi-valued attributes)
- Job roles and skill gaps normalized
- Interview Q&A stored as JSONB array on session (document-style sub-structure)

### 4.5.3 User Interface Design

| Screen | Route | Purpose |
|--------|-------|---------|
| Dashboard | `/apps/dashboard` | Hub, stats, app launcher |
| Resume Lab | `/apps/resume` | Upload, skill table |
| Gap Analysis | `/apps/analysis` | Role comparison |
| Recommendations | `/apps/recommendations` | Courses, careers |
| Job Match | `/apps/jobs` | Search, match, track |
| Applications | `/apps/applications` | Tracker |
| Cover Letters | `/apps/cover-letters` | Generator, editor |
| Interview Prep | `/apps/interview` | Practice sessions |
| Career Coach | `/apps/coach` | Chat UI |
| Admin | `/admin` | Users, AI usage |

Design language: Tokko-inspired pink/purple/blue palette, rounded cards, pill buttons.

### 4.5.4 Deployment Diagram

| Node | Component | Platform |
|------|-----------|----------|
| Client | React SPA | Vercel / Netlify |
| API Server | Express | Render / Railway |
| Database | PostgreSQL | Supabase |
| Auth | Firebase | Google Cloud |
| AI | Claude/OpenAI/DeepSeek | External API |
| Jobs | Remotive, Adzuna, Parse | External API |

*[ Figure 4.2: Deployment Diagram ]*

### 4.5.5 Network Design

All client-server communication over **HTTPS**. Firebase ID tokens in `Authorization: Bearer` header. Supabase accessed only from server with service role key.

---

# CHAPTER FIVE: IMPLEMENTATION

## 5.1 Introduction

Implementation translated the four-layer design into a working codebase organized as:

```
Muyai/
├── client/          # React frontend
├── server/          # Express API
└── database/        # schema.sql, seed.sql
```

Development proceeded in five phases, each delivering live routes and pages registered in `client/src/config/apps.js`.

| Phase | Deliverables |
|-------|--------------|
| 1 | Design system, AppShell, layout, Dashboard migration |
| 2 | Firebase Auth, AuthContext, `/api/auth/sync` |
| 3 | App registry, `/apps/*` routing, Profile |
| 4 | Jobs service, Job Match page, Remotive integration |
| 5 | Applications, Cover Letters, Interview, Coach, dashboard stats |

## 5.2 Sample Source Code

### 5.2.1 AI Service — Resume Parse (server/services/ai.service.js)

```javascript
export async function parseResumeText(rawText, userId) {
  const prompt = `Analyze this resume and extract skills, experience, education, and suggested career roles:\n\n${rawText}`;
  const { parsed } = await callAI(prompt, RESUME_PARSE_SYSTEM, {
    userId,
    feature: 'resume_parse',
  });
  return validateResumeParse(parsed);
}
```

### 5.2.2 Job Match Scoring (server/services/jobs.service.js)

```javascript
export function scoreJobMatch(job, skills) {
  const text = `${job.title} ${job.description}`.toLowerCase();
  const matched = skills.filter((skill) => text.includes(skill.skill_name.toLowerCase()));
  const score = Math.min(100, Math.round((matched.length / skills.length) * 100));
  return { match_score: score, matched_skills: matched.map((s) => s.skill_name) };
}
```

### 5.2.3 Authentication Middleware (server/middleware/auth.middleware.js)

```javascript
export async function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  const decoded = await verifyIdToken(token);
  const user = await userModel.findByFirebaseUid(decoded.uid);
  req.user = { id: user.id, email: user.email, uid: decoded.uid };
  next();
}
```

### 5.2.4 App Registry (client/src/config/apps.js)

```javascript
export const APPS = [
  { id: 'dashboard', path: '/apps/dashboard', status: 'live', group: 'overview' },
  { id: 'resume', path: '/apps/resume', status: 'live', group: 'career' },
  { id: 'jobs', path: '/apps/jobs', status: 'live', group: 'apply' },
  { id: 'applications', path: '/apps/applications', status: 'live', group: 'apply' },
  // ... additional apps
];
```

### 5.2.5 Database Schema Excerpt (database/schema.sql)

```sql
CREATE TABLE applications (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_title VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  status TEXT NOT NULL DEFAULT 'saved',
  job_url VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 5.2.6 API Route Registration (server/index.js)

```javascript
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jobsRoutes);
app.use('/api/applications', applicationsRoutes);
app.use('/api/cover-letters', coverLettersRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/coach', coachRoutes);
```

*[ Figures 5.1–5.8: Implementation Screenshots — Dashboard, Resume Lab, Job Match, Applications, Cover Letters, Interview Prep, Career Coach, Admin ]*

---

# CHAPTER SIX: CONCLUSION AND RECOMMENDATION

## 6.1 Conclusion

This document has presented the complete analysis, design, and implementation of **Muyai**, an AI-powered career platform for African talent. The project addresses the documented gap between fragmented job portals and comprehensive career development by integrating resume analysis, skill gap identification, personalized recommendations, job matching, and full apply-and-grow tooling in a single modular web application.

**Chapter One** established the problem context and objectives spanning authentication through career coaching. **Chapter Two** defined project management structures, resources, and risk mitigation. **Chapter Three** produced functional and non-functional requirements, use cases, and supplementary specifications. **Chapter Four** detailed the layered architecture, subsystem decomposition, database schema, and deployment model. **Chapter Five** demonstrated implementation across five development phases with representative source code.

The implemented system includes:

- 11 live user-facing modules plus admin panel
- Firebase + Supabase authentication and persistence
- Multi-provider AI integration with demo fallback
- Multi-source job listings with skill-based matching
- Application tracker, cover letters, interview prep, and career coach

Muyai demonstrates that a student team can deliver a production-oriented, extensible career platform within an academic timeline by combining modern JavaScript full-stack tooling, managed cloud services, and phased iterative development.

## 6.2 Recommendation

1. **Deploy to production** — Host frontend on Vercel and API on Render; configure production Firebase authorized domains and environment variables.
2. **Enable API keys** — Add DeepSeek/OpenAI/Claude, `PARSE_API_KEY` (EthioJobs), and Adzuna keys for full AI and localized job coverage.
3. **Run full UAT** — Validate with 10+ beta users; target SUS score ≥ 85.
4. **Re-enable plan gating** — Set `PLAN_GATING_ENABLED=true` when launching tiered pricing.
5. **Add automated tests** — Jest/Vitest for API and critical UI flows.
6. **Localize** — Add Amharic UI and Ethiopia-specific career content.
7. **Mobile app** — React Native client sharing the same REST API.
8. **Recruiter module** — Future extension per original scope exclusion.
9. **Security audit** — Restrict CORS to production domain; review Supabase RLS policies.
10. **Monitor AI costs** — Use existing `ai_usage` table for budgeting and rate limits.

---

# REFERENCES / BIBLIOGRAPHY

- Date, C. J. (2003). *An Introduction to Database Systems* (8th ed.). Addison-Wesley.
- European Skills, Competencies, Qualifications and Occupations (ESCO). European Commission.
- General Data Protection Regulation (GDPR). Regulation (EU) 2016/679.
- Kerzner, H. (2019). *Project Management: A Systems Approach to Planning, Scheduling, and Controlling* (12th ed.). Wiley.
- Project Management Institute. (2021). *PMBOK Guide* (7th ed.). PMI.
- Sommerville, I. (2016). *Software Engineering* (10th ed.). Pearson.
- W3C. (2018). *Web Content Accessibility Guidelines (WCAG) 2.1*.
- World Economic Forum. (2023). *The Future of Jobs Report 2023*.
- Supabase Documentation. https://supabase.com/docs
- Firebase Documentation. https://firebase.google.com/docs
- Remotive API. https://remotive.com/api/remote-jobs

---

**Unity University | Faculty of Computational Sciences and Software Engineering**

*Document generated for Muyai final project submission. Export to Microsoft Word for formatting, page numbers, and embedded figures.*
