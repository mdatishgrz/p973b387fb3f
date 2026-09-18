import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Stack,
} from '@mui/material'
import { Home, Compass, HelpCircle, FilePlus, MessageCircle, Factory, Truck, Megaphone, Monitor, ShoppingCart, Store, Wallet, Briefcase, Package } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'

interface SidebarProps {
  onNavigate?: () => void
}

const CAT_ICONS: Record<string, any> = {
  'Manufacturing': Factory,
  'Packaging': Package,
  'Logistics': Truck,
  'Marketing': Megaphone,
  'Technology': Monitor,
  'Wholesale': ShoppingCart,
  'Retail': Store,
  'Finance': Wallet,
  'Professional Services': Briefcase,
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { users, currentUserId } = useApp()
  const currentUser = users.find(u => u.id === currentUserId)!

  const isActive = (path: string) => location.pathname === path
  const handleNavigate = (path: string) => () => {
    navigate(path)
    onNavigate?.()
  }

  const categories = Object.keys(CAT_ICONS)

  const communityItems = [
    { path: '/community', label: 'Home', Icon: Home },
    { path: '/community/explore', label: 'Explore', Icon: Compass },
    { path: '/community', label: 'Unanswered', Icon: HelpCircle },
  ]

  const myActivityItems = [
    { path: '/community/my-posts', label: 'My Posts', Icon: FilePlus },
    { path: '/community/my-posts', label: 'My Comments', Icon: MessageCircle },
  ]

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ px: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Community
        </Typography>
        <List sx={{ py: 0.5, px: 0 }}>
          {communityItems.map(({ path, label, Icon }) => (
            <ListItem key={label} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={handleNavigate(path)}
                selected={isActive(path)}
                sx={{ minHeight: 40, px: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Icon size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{ fontSize: 14, fontWeight: isActive(path) ? 700 : 500 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ px: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Categories
        </Typography>
        <List sx={{ py: 0.5, px: 0, maxHeight: 300, overflow: 'auto' }}>
          {categories.map(cat => {
            const Icon = CAT_ICONS[cat]
            return (
              <ListItem key={cat} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  onClick={handleNavigate(`/community/category/${cat.toLowerCase().replace(/\s+/g, '-')}`)}
                  sx={{ minHeight: 38, px: 2 }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon size={18} />
                  </ListItemIcon>
                  <ListItemText
                    primary={cat}
                    primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}
                  />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ px: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          My Activity
        </Typography>
        <List sx={{ py: 0.5, px: 0 }}>
          {myActivityItems.map(({ path, label, Icon }) => (
            <ListItem key={label} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                onClick={handleNavigate(path)}
                selected={isActive(path)}
                sx={{ minHeight: 38, px: 2 }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <Icon size={18} />
                </ListItemIcon>
                <ListItemText
                  primary={label}
                  primaryTypographyProps={{ fontSize: 13, fontWeight: 500 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{
          mt: 2,
          p: 2,
          borderRadius: 2,
          bgcolor: '#f9fafb',
          border: '1px solid #e5e7eb',
        }}
      >
        <Box>
          <Typography variant="subtitle2" fontWeight={700}>{currentUser.name.split(' ')[0]}, upgrade to Pro?</Typography>
          <Typography variant="caption" color="text.secondary">Unlock analytics & vendor insights</Typography>
        </Box>
      </Stack>
    </Box>
  )
}
