import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Login      from './pages/Login'
import Register   from './pages/Register'
import Feed       from './pages/Feed'
import Profile    from './pages/Profile'
import AdminPanel from './pages/AdminPanel'

const ProtectedRoute = ({ children }) => {
    const { user } = useAuth()
    return user ? children : <Navigate to="/login" replace />
}

const AdminRoute = ({ children }) => {
    const { user, isAdmin } = useAuth()
    if (!user)    return <Navigate to="/login" replace />
    if (!isAdmin) return <Navigate to="/feed" replace />
    return children
}

export default function App() {
    return (
        <Routes>
            <Route path="/"        element={<Navigate to="/feed" replace />} />
            <Route path="/login"   element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/feed" element={
                <ProtectedRoute><Feed /></ProtectedRoute>
            } />

            <Route path="/profile" element={
                <ProtectedRoute><Profile /></ProtectedRoute>
            } />

            <Route path="/admin" element={
                <AdminRoute><AdminPanel /></AdminRoute>
            } />
        </Routes>
    )
}