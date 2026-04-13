import { useState, useContext } from 'react'
import Dashboard from './pages/dashboard.jsx'
import Pacientes from './pages/pacientes.jsx'
import Agendamentos from './pages/agendamentos.jsx'
import './App.css'
import styles from './App.module.css'
import { AuthProvider, AuthContext } from './context/AuthContext.jsx'

const PAGES = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'pacientes', label: 'Pacientes' },
  { id: 'agendamentos', label: 'Agendamentos' },
]

function LoginPage() {
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!email || !password) {
      setError('Preencha email e senha para entrar.')
      return
    }

    try {
      login({ email, senha: password })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <main className={styles.loginPage}>
      <div className={styles.loginCard}>
        <img src="/icon_logo.png" alt="Logo CardioIA" className={styles.loginLogo} />
        <h1>Faça login para acessar o sistema CardioIA</h1>

        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />

          <label htmlFor="password">Senha</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          {error && <p className={styles.errorMessage}>{error}</p>}

          <button type="submit" className={styles.primaryButton}>
            Entrar
          </button>
        </form>
      </div>
    </main>
  )
}

function ProtectedArea({ children }) {
  const { usuario } = useContext(AuthContext)

  if (!usuario) {
    return <LoginPage />
  }

  return <>{children}</>
}

function AuthenticatedApp() {
  const [activePage, setActivePage] = useState('dashboard')
  const { logout, usuario } = useContext(AuthContext)

  const renderPage = () => {
    switch (activePage) {
      case 'pacientes':
        return <Pacientes />
      case 'agendamentos':
        return <Agendamentos />
      case 'dashboard':
      default:
        return <Dashboard />
    }
  }

  return (
    <div className={styles.appShell}>
      <header className={styles.appHeader}>
        <div className={styles.appBrand}>
          <img src="/icon_logo.png" alt="Logo CardioIA" className={styles.appLogo} />
          <span className={styles.brand}>CardioIA</span>
        </div>

        <div className={styles.appHeaderControls}>
          <nav className={styles.appNav}>
            {PAGES.map((page) => (
              <button
                key={page.id}
                type="button"
                className={`${styles.tab} ${page.id === activePage ? styles.active : ''}`}
                onClick={() => setActivePage(page.id)}
              >
                {page.label}
              </button>
            ))}
          </nav>

          <div className={styles.userPanel}>
            <span>Olá, {usuario?.nome}</span>
            <button type="button" className={styles.secondaryButton} onClick={logout}>
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className={styles.appContent}>{renderPage()}</main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <ProtectedArea>
        <AuthenticatedApp />
      </ProtectedArea>
    </AuthProvider>
  )
}

export default App
