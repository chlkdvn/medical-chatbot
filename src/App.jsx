import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import Landing from './components/Landing'
import Chat from './components/Chat'
import Explore from './components/Explore'
import Login from './components/Login'
import { AuthProvider } from './auth'
import './index.css'

function PageShell() {
  const location = useLocation()
  const key = location.pathname.startsWith('/chat')
    ? 'chat'
    : location.pathname.startsWith('/explore')
      ? 'explore'
      : location.pathname.startsWith('/login')
        ? 'login'
        : 'landing'

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={key}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/chat/:characterId" element={<Chat />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Landing />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <PageShell />
        </AuthProvider>
      </Router>
    </MotionConfig>
  )
}

export default App
