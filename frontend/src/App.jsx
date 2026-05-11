import { AuthProvider } from '@/context/AuthContext'
import { TenantProvider } from '@/context/TenantContext'
import { ThemeProvider } from '@/context/ThemeContext'
import AppRoutes from '@/routes/AppRoutes'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <TenantProvider>
          <AppRoutes />
        </TenantProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
