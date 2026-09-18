import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Box, Grid, Snackbar, Alert, Drawer, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material'
import { X, Settings as SettingsIcon } from 'lucide-react'
import { useState, useEffect } from 'react'
import TopNavbar from './components/layout/TopNavbar'
import Sidebar from './components/layout/Sidebar'
import RightSidebar from './components/layout/RightSidebar'
import MobileBottomNav from './components/layout/MobileBottomNav'
import CommunityHome from './pages/CommunityHome'
import Explore from './pages/Explore'
import PostDetail from './pages/PostDetail'
import CreatePost from './pages/CreatePost'
import SearchResults from './pages/SearchResults'
import CategoryPage from './pages/CategoryPage'
import UserProfile from './pages/UserProfile'
import VendorProfile from './pages/VendorProfile'
import SavedPosts from './pages/SavedPosts'
import Notifications from './pages/Notifications'
import Messages from './pages/Messages'
import MyPosts from './pages/MyPosts'
import Settings from './pages/Settings'
import { useApp } from './context/AppContext'

function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const theme = useTheme()
  const { snackbar, closeSnackbar } = useApp()
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false)

  const isMdUp = useMediaQuery(theme.breakpoints.up('md'))
  const isXlUp = useMediaQuery(theme.breakpoints.up('xl'))
  const isLgOnly = useMediaQuery(theme.breakpoints.between('lg', 'xl'))

  const isSpecialPage = location.pathname.includes('/messages') || location.pathname.includes('/settings')
  const isDetailPage = !!location.pathname.match(/\/community\/post\/[^/]+/) || !!location.pathname.match(/\/vendor\/[^/]+/) || !!location.pathname.match(/\/profile\/[^/]+/)

  const showSidebar = isMdUp && !isSpecialPage
  const showRightCol = isXlUp && !isSpecialPage && !isDetailPage
  const showRightFab = isLgOnly && !isSpecialPage && !isDetailPage

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', bgcolor: '#f9fafb', overflow: 'hidden' }}>
      <TopNavbar />

      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        {showSidebar && (
          <Box
            sx={{
              width: 280,
              flexShrink: 0,
              height: '100%',
              overflowY: 'auto',
              borderRight: '1px solid #e5e7eb',
              bgcolor: '#fff',
              p: 2,
            }}
          >
            <Sidebar />
          </Box>
        )}

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            minWidth: 0,
            overflowY: 'auto',
            height: '100%',
            pb: { xs: 9, md: 0 },
          }}
        >
          <Grid container spacing={0} sx={{ minHeight: '100%' }}>
            <Grid item xs={12} lg={isSpecialPage || isDetailPage || !showRightCol ? 12 : 9}>
              {children}
            </Grid>
            {showRightCol && (
              <Grid item xl={3} sx={{ display: { xs: 'none', xl: 'block' } }}>
                <Box
                  sx={{
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    overflowY: 'auto',
                    p: 3,
                    pl: 1,
                    pr: 3,
                  }}
                >
                  <RightSidebar />
                </Box>
              </Grid>
            )}
            {showRightFab && (
              <Box
                sx={{
                  position: 'fixed',
                  top: 72,
                  right: 16,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  zIndex: 100,
                }}
              >
                <IconButton
                  onClick={() => setRightDrawerOpen(true)}
                  sx={{
                    bgcolor: '#fff',
                    boxShadow: 2,
                    '&:hover': { bgcolor: '#f9fafb' },
                  }}
                >
                  <SettingsIcon size={20} />
                </IconButton>
              </Box>
            )}
          </Grid>
        </Box>
      </Box>

      <MobileBottomNav />

      <Drawer
        anchor="right"
        open={rightDrawerOpen}
        onClose={() => setRightDrawerOpen(false)}
        sx={{ display: { md: 'block', xl: 'none' } }}
        PaperProps={{ sx: { width: 340 } }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e5e7eb' }}>
          <Typography variant="subtitle1" fontWeight={700}>Explore</Typography>
          <IconButton onClick={() => setRightDrawerOpen(false)}><X /></IconButton>
        </Box>
        <Box sx={{ p: 2, overflow: 'auto' }}>
          <RightSidebar />
        </Box>
      </Drawer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ mb: { xs: 8, md: 2 } }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%', boxShadow: 2, borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default function App() {
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = 'https://fonts.googleapis.com'
    document.head.appendChild(link)

    const link2 = document.createElement('link')
    link2.rel = 'stylesheet'
    link2.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'
    document.head.appendChild(link2)

    return () => {
      document.head.removeChild(link)
      document.head.removeChild(link2)
    }
  }, [])

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/community" replace />} />
      <Route path="/community" element={<Layout><CommunityHome /></Layout>} />
      <Route path="/community/explore" element={<Layout><Explore /></Layout>} />
      <Route path="/community/post/:id" element={<Layout><PostDetail /></Layout>} />
      <Route path="/community/create" element={<Layout><CreatePost /></Layout>} />
      <Route path="/community/search" element={<Layout><SearchResults /></Layout>} />
      <Route path="/community/category/:slug" element={<Layout><CategoryPage /></Layout>} />
      <Route path="/community/saved" element={<Layout><SavedPosts /></Layout>} />
      <Route path="/community/notifications" element={<Layout><Notifications /></Layout>} />
      <Route path="/community/messages" element={<Layout><Messages /></Layout>} />
      <Route path="/community/my-posts" element={<Layout><MyPosts /></Layout>} />
      <Route path="/profile/:username" element={<Layout><UserProfile /></Layout>} />
      <Route path="/vendor/:slug" element={<Layout><VendorProfile /></Layout>} />
      <Route path="/settings" element={<Layout><Settings /></Layout>} />
      <Route path="*" element={<Layout><CommunityHome /></Layout>} />
    </Routes>
  )
}
