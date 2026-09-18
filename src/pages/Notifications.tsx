import {
  Container,
  Typography,
  Box,
  Stack,
  Card,
  CardContent,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Divider,
  Chip,
} from '@mui/material'
import { ArrowLeft, MailCheck, MessageSquare, AtSign, CheckCircle2, UserPlus, Store, Megaphone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { useApp } from '../context/AppContext'
import AppAvatar from '../components/common/AppAvatar'
import EmptyState from '../components/common/EmptyState'
import { formatTimeAgo } from '../utils/helpers'
import type { Notification } from '../types'

const NOTIF_ICONS: Record<Notification['type'], any> = {
  reply: MessageSquare,
  mention: AtSign,
  solution: CheckCircle2,
  follow: UserPlus,
  vendor_response: Store,
  topic_activity: Megaphone,
}

const NOTIF_COLORS: Record<Notification['type'], string> = {
  reply: '#eef2ff',
  mention: '#ecfeff',
  solution: '#d1fae5',
  follow: '#fef3c7',
  vendor_response: '#dbeafe',
  topic_activity: '#ede9fe',
}

export default function Notifications() {
  const navigate = useNavigate()
  const { notifications, users, markNotificationRead, markAllNotificationsRead } = useApp()

  const grouped = useMemo(() => {
    const now = new Date()
    const today: Notification[] = []
    const yesterday: Notification[] = []
    const earlier: Notification[] = []
    notifications.forEach(n => {
      const d = new Date(n.createdAt)
      const diff = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
      if (diff === 0) today.push(n)
      else if (diff === 1) yesterday.push(n)
      else earlier.push(n)
    })
    return { today, yesterday, earlier }
  }, [notifications])

  const totalUnread = notifications.filter(n => !n.isRead).length

  const handleClick = (n: Notification) => {
    markNotificationRead(n.id)
    if (n.postId) navigate(`/community/post/${n.postId}`)
  }

  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Button startIcon={<ArrowLeft />} onClick={() => navigate('/community')} sx={{ mb: 2, textTransform: 'none' }}>
        Back
      </Button>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5, fontSize: { xs: 24, md: 30 } }}>Notifications</Typography>
          <Typography variant="body2" color="text.secondary">
            {totalUnread} unread · {notifications.length} total
          </Typography>
        </Box>
        {totalUnread > 0 && (
          <Button
            size="small"
            variant="outlined"
            startIcon={<MailCheck />}
            onClick={markAllNotificationsRead}
          >
            Mark all as read
          </Button>
        )}
      </Stack>

      {notifications.length === 0 ? (
        <EmptyState type="no_notifications" />
      ) : (
        <Card>
          <CardContent sx={{ p: 0 }}>
            <Group label="Today" items={grouped.today} onClick={handleClick} users={users} />
            <Group label="Yesterday" items={grouped.yesterday} onClick={handleClick} users={users} />
            <Group label="Earlier" items={grouped.earlier} onClick={handleClick} users={users} last />
          </CardContent>
        </Card>
      )}
    </Container>
  )
}

function Group({ label, items, onClick, users, last }: {
  label: string
  items: Notification[]
  onClick: (n: Notification) => void
  users: any[]
  last?: boolean
}) {
  if (items.length === 0) return null
  return (
    <Box>
      <Box sx={{ px: 2.5, py: 1.5, bgcolor: '#f9fafb' }}>
        <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase" letterSpacing={0.5}>
          {label} · {items.length}
        </Typography>
      </Box>
      <List disablePadding>
        {items.map((n, i) => {
          const actor = users.find(u => u.id === n.actorId)
          const Icon = NOTIF_ICONS[n.type]
          return (
            <Box key={n.id}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => onClick(n)}
                  sx={{
                    px: 2.5,
                    py: 2,
                    bgcolor: n.isRead ? 'transparent' : '#f8fafc',
                    '&:hover': { bgcolor: '#f9fafb' },
                  }}
                >
                  <ListItemAvatar sx={{ minWidth: 44 }}>
                    <Box sx={{ position: 'relative' }}>
                      <AppAvatar src={actor?.avatar} name={actor?.name || ''} size="sm" />
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: -2,
                          right: -2,
                          width: 20,
                          height: 20,
                          borderRadius: '50%',
                          bgcolor: NOTIF_COLORS[n.type],
                          border: '2px solid #fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={10} color='#374151' />
                      </Box>
                    </Box>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight={n.isRead ? 400 : 600} sx={{ fontSize: 14, lineHeight: 1.4 }}>
                        {n.message}
                      </Typography>
                    }
                    secondary={
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">{formatTimeAgo(n.createdAt)}</Typography>
                        {!n.isRead && (
                          <Chip
                            label="New"
                            size="small"
                            sx={{ height: 16, fontSize: 9, fontWeight: 700, bgcolor: '#eef2ff', color: '#4f46e5', borderRadius: 6 }}
                          />
                        )}
                      </Stack>
                    }
                  />
                </ListItemButton>
              </ListItem>
              {!last && i < items.length - 1 && <Divider sx={{ ml: 8 }} />}
            </Box>
          )
        })}
      </List>
    </Box>
  )
}
