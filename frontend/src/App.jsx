import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import Navbar from './components/layout/Navbar'
import ProtectedRoute from './components/layout/ProtectedRoute'
import LoginPage        from './pages/auth/LoginPage'
import RegisterPage     from './pages/auth/RegisterPage'
import HomePage         from './pages/apps/HomePage'
import AppDetailPage    from './pages/apps/AppDetailPage'
import DownloadsPage    from './pages/user/DownloadsPage'
import ProfilePage      from './pages/user/ProfilePage'
import NotificationsPage from './pages/user/NotificationsPage'
import OwnerAppsPage    from './pages/owner/OwnerAppsPage'
import DashboardPage    from './pages/owner/DashboardPage'

function AppRoutes() {
  const { user } = useAuth()
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/login"    element={user ? <Navigate to="/" /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <RegisterPage />} />
        <Route path="/"              element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/app/:id"       element={<ProtectedRoute><AppDetailPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/downloads"     element={<ProtectedRoute><DownloadsPage /></ProtectedRoute>} />
        <Route path="/profile"       element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/owner/apps"    element={<ProtectedRoute ownerOnly><OwnerAppsPage /></ProtectedRoute>} />
        <Route path="/dashboard"     element={<ProtectedRoute ownerOnly><DashboardPage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
