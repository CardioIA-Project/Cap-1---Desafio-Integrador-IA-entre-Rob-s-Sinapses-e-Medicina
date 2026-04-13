import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const allowedUsers = [
    {
      email: 'cardioia.adm@email.com',
      senha: '123456',
      nome: 'CardioIA Admin',
    },
  ]

  const [token, setToken] = useState(null)
  const [usuario, setUsuario] = useState(null)

  useEffect(() => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }, [])

  function login({ email, senha }) {
    const validUser = allowedUsers.find(
      (user) => user.email === email && user.senha === senha,
    )

    if (!validUser) {
      throw new Error('Email ou senha incorretos.')
    }

    const fakeToken = 'fake-jwt-token-123'
    const user = {
      nome: validUser.nome,
      email: validUser.email,
    }

    localStorage.setItem('token', fakeToken)
    localStorage.setItem('user', JSON.stringify(user))
    setToken(fakeToken)
    setUsuario(user)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUsuario(null)
  }

  const isAuthenticated = Boolean(token)

  return (
    <AuthContext.Provider value={{ usuario, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
