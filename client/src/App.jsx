import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Resume from './pages/Resume';
import Analysis from './pages/Analysis';
import Recommendations from './pages/Recommendations';
import Admin from './pages/Admin';
import Profile from './pages/apps/Profile';
import Jobs from './pages/apps/Jobs';
import Applications from './pages/apps/Applications';
import CoverLetters from './pages/apps/CoverLetters';
import Interview from './pages/apps/Interview';
import Coach from './pages/apps/Coach';

function Protected({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/apps" element={<Navigate to="/apps/dashboard" replace />} />
          <Route path="/apps/dashboard" element={<Protected><Dashboard /></Protected>} />
          <Route path="/apps/resume" element={<Protected><Resume /></Protected>} />
          <Route path="/apps/analysis" element={<Protected><Analysis /></Protected>} />
          <Route path="/apps/recommendations" element={<Protected><Recommendations /></Protected>} />
          <Route path="/apps/profile" element={<Protected><Profile /></Protected>} />
          <Route path="/apps/jobs" element={<Protected><Jobs /></Protected>} />
          <Route path="/apps/applications" element={<Protected><Applications /></Protected>} />
          <Route path="/apps/cover-letters" element={<Protected><CoverLetters /></Protected>} />
          <Route path="/apps/interview" element={<Protected><Interview /></Protected>} />
          <Route path="/apps/coach" element={<Protected><Coach /></Protected>} />

          <Route path="/admin" element={<AdminRoute><Admin /></AdminRoute>} />

          {/* Backward-compatible redirects */}
          <Route path="/dashboard" element={<Navigate to="/apps/dashboard" replace />} />
          <Route path="/resume" element={<Navigate to="/apps/resume" replace />} />
          <Route path="/analysis" element={<Navigate to="/apps/analysis" replace />} />
          <Route path="/recommendations" element={<Navigate to="/apps/recommendations" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
