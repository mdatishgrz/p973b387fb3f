import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Button,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Stack,
  Divider,
  Typography,
  Drawer,
  Avatar,
  Chip,
} from '@mui/material'
import { Menu as MenuIcon, Plus, Bell, MessageCircle, Search, User, FilePlus, Bookmark, ShoppingBag, Settings, LogOut, Store, MessageSquare, X, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import AppAvatar from '../common/AppAvatar'
import SearchBar from '../common/SearchBar'
import Sidebar from './Sidebar'

export default function TopNavbar() {
  const navigate = useNavigate()
  const { users, currentUserId, notifications } = useApp()
  const currentUser = users.find(u => u.id === currentUserId)!

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null)
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null)

  const unreadNotifCount = notifications.filter(n => !n.isRead).length
  const unreadMessages = 6

  const handleCreatePost = () => navigate('/community/create')
  const handleNavigate = (path: string) => (e?: any) => {
    navigate(path)
    setUserMenuAnchor(null)
    setNotifAnchor(null)
    if (e?.target) {
      setMobileMenuOpen(false)
    }
  }

  return (
    <>
      <AppBar position="sticky" color="default" sx={{ zIndex: theme => theme.zIndex.drawer + 1, bgcolor: '#fff' }}>
        <Toolbar sx={{ minHeight: 64, gap: 1, justifyContent: 'space-between' }}>
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ width: { xs: 'auto', lg: 280 } }}>
            <IconButton
              edge="start"
              aria-label="Open menu"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ display: { lg: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              onClick={handleNavigate('/community')}
              sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1.5,
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 18,
                }}
              >
                M
              </Box>
              <Typography variant="h6" fontWeight={800} color="primary.main" sx={{ display: { xs: 'none', sm: 'block' } }}>
                MarketHub
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                display: { xs: 'none', md: 'flex' },
                ml: { md: 1, lg: 2 },
              }}
            >
              <Button
                size="small"
                startIcon={<Store size={18} />}
                sx={{ fontWeight: 600 }}
                onClick={handleNavigate('/community')}
              >
                Marketplace
              </Button>
              <Button
                size="small"
                startIcon={<MessageSquare size={18} />}
                variant="text"
                sx={{ fontWeight: 700, color: 'primary.main', bgcolor: '#eef2ff' }}
                onClick={handleNavigate('/community')}
              >
                Community
              </Button>
            </Stack>
          </Stack>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', lg: 'flex' }, justifyContent: 'center' }}>
            <SearchBar variant="nav" placeholder="Search questions, vendors, topics, users..." />
          </Box>

          <IconButton
            sx={{ display: { xs: 'flex', lg: 'none' } }}
            onClick={() => setMobileSearchOpen(true)}
            aria-label="Search"
          >
            <Search />
          </IconButton>

          <Stack direction="row" alignItems="center" spacing={0.3} sx={{ flexShrink: 0 }}>
            <Button
              size="small"
              variant="contained"
              startIcon={<Plus size={18} />}
              onClick={handleCreatePost}
              sx={{
                display: { xs: 'none', sm: 'inline-flex' },
                boxShadow: 'none',
              }}
            >
              Create Post
            </Button>
            <IconButton
              sx={{ display: { xs: 'inline-flex', sm: 'none' } }}
              aria-label="Create post"
              onClick={handleCreatePost}
            >
              <Plus />
            </IconButton>

            <Tooltip title="Messages">
              <IconButton
                onClick={handleNavigate('/community/messages')}
                aria-label="Messages"
              >
                <Badge badgeContent={unreadMessages} color="error" overlap="circular">
                  <MessageCircle />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Notifications">
              <IconButton
                aria-label="Notifications"
                onClick={e => setNotifAnchor(e.currentTarget)}
              >
                <Badge badgeContent={unreadNotifCount} color="error" overlap="circular">
                  <Bell />
                </Badge>
              </IconButton>
            </Tooltip>

            <Box sx={{ pl: 0.5, ml: 0.5, borderLeft: 1, borderColor: 'grey.200' }}>
              <IconButton
                onClick={e => setUserMenuAnchor(e.currentTarget)}
                aria-label="User menu"
                sx={{ p: 0.5 }}
              >
                <AppAvatar src={currentUser.avatar} name={currentUser.name} size="sm" />
              </IconButton>
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        sx={{ display: { xs: 'block', lg: 'none' } }}
      >
        <Box sx={{ width: 280, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h6" fontWeight={800} color="primary.main">MarketHub</Typography>
            <IconButton onClick={() => setMobileMenuOpen(false)}><X /></IconButton>
          </Box>
          <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
        </Box>
      </Drawer>

      <Drawer
        anchor="top"
        open={mobileSearchOpen}
        onClose={() => setMobileSearchOpen(false)}
        sx={{ display: { xs: 'block', lg: 'none' } }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={() => setMobileSearchOpen(false)}><ArrowBackIconComp /></IconButton>
          <SearchBar
            fullWidth
            autoFocus
            placeholder="Search..."
            onSubmit={v => {
              setMobileSearchOpen(false)
              if (v.trim()) navigate(`/community/search?q=${encodeURIComponent(v)}`)
            }}
          />
        </Box>
      </Drawer>

      <Menu
        anchorEl={notifAnchor}
        open={!!notifAnchor}
        onClose={() => setNotifAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { mt: 1, width: { xs: '100%', sm: 380 }, maxHeight: 480, borderRadius: 2 } } }}
      >
        <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" fontWeight={700}>Notifications</Typography>
          <Button
            size="small"
            onClick={handleNavigate('/community/notifications')}
            sx={{ fontSize: 12 }}
          >
            View all
          </Button>
        </Box>
        <Divider />
        {notifications.slice(0, 5).map(n => {
          const actor = users.find(u => u.id === n.actorId)
          return (
            <MenuItem
              key={n.id}
              onClick={handleNavigate('/community/notifications')}
              sx={{ px: 2, py: 1.5, alignItems: 'flex-start', bgcolor: n.isRead ? 'transparent' : 'grey.50' }}
            >
              <ListItemIcon sx={{ minWidth: 40, mt: 0.3 }}>
                <AppAvatar src={actor?.avatar} name={actor?.name || ''} size="sm" />
              </ListItemIcon>
              <ListItemText
                primary={n.message}
                secondary={new Date(n.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                primaryTypographyProps={{ variant: 'body2', fontWeight: n.isRead ? 400 : 600, fontSize: 13, lineHeight: 1.4 }}
                secondaryTypographyProps={{ variant: 'caption', mt: 0.3 }}
                sx={{ my: 0 }}
              />
            </MenuItem>
          )
        })}
      </Menu>

      <Menu
        anchorEl={userMenuAnchor}
        open={!!userMenuAnchor}
        onClose={() => setUserMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{ paper: { sx: { mt: 1, width: 280, borderRadius: 2 } } }}
      >
        <MenuItem onClick={handleNavigate(`/profile/${currentUser.username}`)} sx={{ py: 1.5 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
            <AppAvatar src={currentUser.avatar} name={currentUser.name} size="lg" />
            <Box flexGrow={1}>
              <Typography variant="subtitle2" fontWeight={700}>{currentUser.name}</Typography>
              <Typography variant="caption" color="text.secondary">@{currentUser.username}</Typography>
              <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                <Chip size="small" label={currentUser.location.split(',')[0]} sx={{ height: 18, fontSize: 10 }} />
              </Stack>
            </Box>
          </Stack>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleNavigate(`/profile/${currentUser.username}`)} sx={{ py: 1.2 }}>
          <ListItemIcon><User size={18} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}>My Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleNavigate('/community/my-posts')} sx={{ py: 1.2 }}>
          <ListItemIcon><FilePlus size={18} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}>My Posts</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleNavigate('/community/saved')} sx={{ py: 1.2 }}>
          <ListItemIcon><Bookmark size={18} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}>Saved Posts</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleNavigate('/community/my-posts')} sx={{ py: 1.2 }}>
          <ListItemIcon><ShoppingBag size={18} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}>My Marketplace Activity</ListItemText>
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleNavigate('/settings')} sx={{ py: 1.2 }}>
          <ListItemIcon><Settings size={18} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}>Settings</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleNavigate('/')} sx={{ py: 1.2, color: 'error.main' }}>
          <ListItemIcon><LogOut size={18} /></ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontSize: 14, fontWeight: 500 }}>Log out</ListItemText>
        </MenuItem>
      </Menu>
    </>
  )
}

function ArrowBackIconComp() {
  return <ArrowLeft />
}
