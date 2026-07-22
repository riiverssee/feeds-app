// src/context/AuthContext.jsx

import { createContext, useContext, useState } from 'react'

// Step 1 — create the context (empty box)
const AuthContext = createContext()

// Step 2 — create the provider (fills the box with data)
export const AuthProvider = ({ children }) => {

    // user state — null means not logged in
    const storedUser = localStorage.getItem('user');

    const [user, setUser] = useState(() => {
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch (error) {
            localStorage.removeItem('user');
            return null;
        }
    });

    // called when user logs in
    const login = (userData, tokens) => {
        localStorage.setItem('access_token', tokens.access)
        localStorage.setItem('refresh_token', tokens.refresh)
        localStorage.setItem('user', JSON.stringify(userData))
        setUser(userData)
    }

    // called when user logs out
    const logout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        setUser(null)
    }

    // check if logged in user is admin
    const isAdmin = user?.role === 'admin'

    // check if logged in user is customer
    const isUser = user?.role === 'user'

    return (
        // wrap children with context
        // now ALL components inside can access user, login, logout
        <AuthContext.Provider value={{ user, login, logout, isAdmin, isUser }}>
            {children}
        </AuthContext.Provider>
    )
}

// Step 3 — custom hook to use context easily
// instead of writing useContext(AuthContext) every time
// just write useAuth()
export const useAuth = () => useContext(AuthContext)