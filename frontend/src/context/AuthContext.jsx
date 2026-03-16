import { createContext, useContext, useState } from 'react'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pv_user')) } catch { return null }
  })

  const login = (userData, token) => {
    localStorage.setItem('pv_token', token)
    localStorage.setItem('pv_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('pv_token')
    localStorage.removeItem('pv_user')
    setUser(null)
  }

  return (
    <AuthCtx.Provider value={{ user, login, logout, isOwner: user?.role === 'OWNER' }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
