import {
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Fab,
  Badge,
  IconButton,
} from '@mui/material'
import { Home, Compass, Plus, Bell, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { useState, useEffect } from 'react'

export default function MobileBottomNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { users, currentUserId, notifications } = useApp()
  const currentUser = users.find(u => u.id === currentUserId)!

  const unreadCount = notifications.filter(n => !n.isRead).length

  const getValue = (): number => {
    const path = location.pathname
    if (path.startsWith('/community') && (path === '/community' || path === '/community/')) return 0
    if (path.startsWith('/community/explore')) return 1
    if (path.startsWith('/community/notifications')) return 3
    if (path.startsWith('/profile')) return 4
    return 0
  }

  const [value, setValue] = useState(getValue())

  useEffect(() => {
    setValue(getValue())
  }, [location.pathname])

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    switch (newValue) {
      case 0: navigate('/community'); break
      case 1: navigate('/community/explore'); break
      case 3: navigate('/community/notifications'); break
      case 4: navigate(`/profile/${currentUser.username}`); break
    }
  }

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        display: { xs: 'block', md: 'none' },
        borderRadius: 0,
        borderTop: '1px solid #e5e7eb',
      }}
      elevation={3}
    >
      <BottomNavigation
        value={value}
        onChange={handleChange}
        sx={{
          height: 64,
          bgcolor: '#fff',
          '& .MuiBottomNavigationAction-root': {
            color: '#6b7280',
            minWidth: 0,
            pt: 1,
            '&.Mui-selected': {
              color: '#4f46e5',
            },
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: 11,
            fontWeight: 600,
            mt: 0.3,
          },
        }}
      >
        <BottomNavigationAction
          label="Home"
          icon={<Home fill={value === 0 ? 'currentColor' : 'none'} />}
        />
        <BottomNavigationAction
          label="Explore"
          icon={<Compass fill={value === 1 ? 'currentColor' : 'none'} />}
        />
        <BottomNavigationAction
          label=""
          icon={<Box sx={{ width: 1 }} />}
        />
        <BottomNavigationAction
          label="Alerts"
          icon={
            <Badge badgeContent={unreadCount} color="error" overlap="circular">
              <Bell fill={value === 3 ? 'currentColor' : 'none'} />
            </Badge>
          }
        />
        <BottomNavigationAction
          label="Profile"
          icon={<User fill={value === 4 ? 'currentColor' : 'none'} />}
        />
      </BottomNavigation>
      <Fab
        color="primary"
        size="medium"
        aria-label="Create post"
        onClick={() => navigate('/community/create')}
        sx={{
          position: 'absolute',
          top: -24,
          left: '50%',
          transform: 'translateX(-50%)',
          boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)',
          '&:hover': {
            boxShadow: '0 12px 32px rgba(79, 70, 229, 0.5)',
          },
        }}
      >
        <Plus size={26} />
      </Fab>
    </Paper>
  )
}
