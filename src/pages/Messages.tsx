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
  TextField,
  IconButton,
  Avatar,
  Chip,
  Grid,
  Hidden,
} from '@mui/material'
import { ArrowLeft, Send, Paperclip, Smile, Phone, Video, MoreVertical, Plus, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import AppAvatar from '../components/common/AppAvatar'
import UserRoleBadge from '../components/common/UserRoleBadge'
import VerifiedBadge from '../components/common/VerifiedBadge'
import EmptyState from '../components/common/EmptyState'
import { formatTimeAgo, formatDate } from '../utils/helpers'

export default function Messages() {
  const navigate = useNavigate()
  const { conversations, messages, users, vendors, currentUserId, sendMessage, getUserById, getVendorById } = useApp()

  const [selectedId, setSelectedId] = useState<string | null>(conversations[0]?.id || null)
  const [newMsg, setNewMsg] = useState('')
  const [showMobileList, setShowMobileList] = useState(!selectedId)

  const currentUser = getUserById(currentUserId)!
  const selectedConv = conversations.find(c => c.id === selectedId)
  const convMessages = selectedId ? messages[selectedId] || [] : []

  const getOtherUser = (conv: typeof conversations[0]) => {
    const otherId = conv.participantIds.find(id => id !== currentUserId)!
    const user = getUserById(otherId)
    const vendor = vendors.find(v => v.ownerId === otherId)
    return { user, vendor }
  }

  const handleSend = () => {
    if (!newMsg.trim() || !selectedId) return
    sendMessage(selectedId, newMsg.trim())
    setNewMsg('')
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3, px: { xs: 1, md: 3 } }}>
      <Button startIcon={<ArrowLeft />} onClick={() => navigate('/community')} sx={{ mb: 2, textTransform: 'none', display: { xs: 'none', md: 'inline-flex' } }}>
        Back to community
      </Button>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} sx={{ mb: 2, px: 1 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: 22, md: 28 }, mb: 0.3 }}>Messages</Typography>
          <Typography variant="body2" color="text.secondary">{conversations.length} conversations</Typography>
        </Box>
        <Button variant="contained" size="small" startIcon={<Plus />}>New Message</Button>
      </Stack>

      <Card sx={{ height: { xs: 'calc(100vh - 200px)', md: 620 }, overflow: 'hidden' }}>
        <Grid container sx={{ height: '100%' }}>
          <Grid item xs={12} md={4} sx={{
            borderRight: { md: '1px solid #e5e7eb' },
            display: { xs: showMobileList ? 'block' : 'none', md: 'block' },
            height: '100%',
            overflow: 'auto',
          }}>
            <Box sx={{ p: 2, borderBottom: '1px solid #e5e7eb' }}>
              <TextField
                placeholder="Search conversations..."
                size="small"
                fullWidth
                InputProps={{ startAdornment: <Box component="span" sx={{ mr: 1, display: 'inline-flex', color: 'text.secondary' }}><Search size={18} /></Box> }}
              />
            </Box>
            {conversations.length === 0 ? (
              <EmptyState type="no_messages" compact />
            ) : (
              <List disablePadding>
                {conversations.map((conv, i) => {
                  const { user, vendor } = getOtherUser(conv)
                  const displayName = vendor?.companyName || user?.name || 'Unknown'
                  const avatarSrc = vendor?.logo || user?.avatar
                  return (
                    <Box key={conv.id}>
                      <ListItemButton
                        onClick={() => { setSelectedId(conv.id); setShowMobileList(false) }}
                        sx={{
                          py: 2,
                          px: 2,
                          bgcolor: selectedId === conv.id ? '#eef2ff' : 'transparent',
                          '&:hover': { bgcolor: selectedId === conv.id ? '#e0e7ff' : '#f9fafb' },
                        }}
                      >
                        <ListItemAvatar sx={{ minWidth: 48 }}>
                          <AppAvatar
                            src={avatarSrc}
                            name={displayName}
                            size="md"
                            sx={vendor ? { borderRadius: 1.5 } : undefined}
                            online={i % 3 === 0}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Stack direction="row" alignItems="center" spacing={0.8}>
                              <Typography variant="subtitle2" fontWeight={700} noWrap>{displayName}</Typography>
                              {vendor?.verified && <VerifiedBadge type="vendor" sx={{ height: 16 }} />}
                              {user && !vendor && <UserRoleBadge role={user.role} showIcon={false} sx={{ height: 16, fontSize: 9 }} />}
                            </Stack>
                          }
                          secondary={
                            <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.3 }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                  maxWidth: 160,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  fontWeight: conv.unreadCount > 0 ? 700 : 400,
                                  color: conv.unreadCount > 0 ? '#111827' : 'text.secondary',
                                }}
                              >
                                {conv.lastMessage}
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0, ml: 0.5 }}>
                                {formatTimeAgo(conv.lastMessageAt)}
                              </Typography>
                            </Stack>
                          }
                          secondaryTypographyProps={{ sx: { mt: 0 } }}
                        />
                        {conv.unreadCount > 0 && (
                          <Chip
                            label={conv.unreadCount}
                            size="small"
                            color="primary"
                            sx={{ ml: 1, height: 18, minWidth: 18, borderRadius: 9, fontWeight: 700, fontSize: 10 }}
                          />
                        )}
                      </ListItemButton>
                      {i < conversations.length - 1 && <Divider sx={{ ml: 8 }} />}
                    </Box>
                  )
                })}
              </List>
            )}
          </Grid>

          <Grid item xs={12} md={8} sx={{
            display: { xs: !showMobileList ? 'flex' : 'none', md: 'flex' },
            height: '100%',
            flexDirection: 'column',
          }}>
            {!selectedConv ? (
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EmptyState type="no_messages" compact />
              </Box>
            ) : (() => {
              const { user, vendor } = getOtherUser(selectedConv)
              const displayName = vendor?.companyName || user?.name || 'Unknown'
              const avatarSrc = vendor?.logo || user?.avatar
              return (
                <>
                  <Box sx={{
                    p: 2,
                    borderBottom: '1px solid #e5e7eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <IconButton size="small" sx={{ display: { md: 'none' } }} onClick={() => setShowMobileList(true)}>
                        <ArrowLeft />
                      </IconButton>
                      <AppAvatar
                        src={avatarSrc}
                        name={displayName}
                        size="sm"
                        sx={vendor ? { borderRadius: 1.5 } : undefined}
                      />
                      <Box>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="subtitle2" fontWeight={700}>{displayName}</Typography>
                          {vendor?.verified && <VerifiedBadge type="vendor" sx={{ height: 16 }} />}
                        </Stack>
                        {selectedConv.relatedPostTitle && (
                          <Typography variant="caption" color="primary.main" sx={{ display: 'block', mt: 0.3, cursor: 'pointer' }}
                            onClick={() => selectedConv.relatedPostId && navigate(`/community/post/${selectedConv.relatedPostId}`)}>
                            Re: {selectedConv.relatedPostTitle.slice(0, 60)}...
                          </Typography>
                        )}
                      </Box>
                    </Stack>
                    <Stack direction="row" spacing={0.5}>
                      <IconButton size="small"><Phone /></IconButton>
                      <IconButton size="small"><Video /></IconButton>
                      <IconButton size="small"><MoreVertical /></IconButton>
                    </Stack>
                  </Box>

                  <Box sx={{ flex: 1, overflow: 'auto', p: 2.5, bgcolor: '#f9fafb' }}>
                    {convMessages.length === 0 ? (
                      <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <EmptyState type="no_messages" customTitle={`Start the conversation with ${displayName.split(' ')[0]}`} customSubtitle="Say hi and get things rolling!" />
                      </Box>
                    ) : (
                      <Stack spacing={2}>
                        {convMessages.map(msg => {
                          const mine = msg.senderId === currentUserId
                          const sender = mine ? currentUser : getUserById(msg.senderId)
                          return (
                            <Stack key={msg.id} direction="row" spacing={1.5} justifyContent={mine ? 'flex-end' : 'flex-start'}>
                              {!mine && <AppAvatar src={sender?.avatar} name={sender?.name || ''} size="xs" />}
                              <Box sx={{ maxWidth: { xs: '80%', md: '65%' } }}>
                                <Box
                                  sx={{
                                    p: 1.8,
                                    borderRadius: mine ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
                                    bgcolor: mine ? '#4f46e5' : '#fff',
                                    color: mine ? '#fff' : '#111827',
                                    border: mine ? 'none' : '1px solid #e5e7eb',
                                    boxShadow: mine ? '0 1px 2px rgba(79,70,229,0.2)' : 'none',
                                  }}
                                >
                                  <Typography variant="body2" sx={{ fontSize: 14, lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                    {msg.content}
                                  </Typography>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{
                                  display: 'block',
                                  mt: 0.4,
                                  ml: mine ? 'auto' : 4,
                                  textAlign: mine ? 'right' : 'left',
                                  fontSize: 10,
                                }}>
                                  {formatTimeAgo(msg.createdAt)} {mine && (msg.isRead ? '· Read' : '· Sent')}
                                </Typography>
                              </Box>
                            </Stack>
                          )
                        })}
                      </Stack>
                    )}
                  </Box>

                  <Box sx={{ p: 2, borderTop: '1px solid #e5e7eb' }}>
                    <Stack direction="row" alignItems="flex-end" spacing={1.5}>
                      <IconButton size="small" sx={{ mb: 0.5 }}><Paperclip /></IconButton>
                      <TextField
                        fullWidth
                        multiline
                        rows={1}
                        maxRows={4}
                        placeholder={`Message ${displayName.split(' ')[0]}...`}
                        value={newMsg}
                        onChange={e => setNewMsg(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
                        }}
                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: 10 } }}
                      />
                      <IconButton size="small" sx={{ mb: 0.5 }}><Smile /></IconButton>
                      <Button
                        variant="contained"
                        size="small"
                        endIcon={<Send />}
                        onClick={handleSend}
                        disabled={!newMsg.trim()}
                        sx={{ minWidth: 90, height: 40 }}
                      >
                        Send
                      </Button>
                    </Stack>
                  </Box>
                </>
              )
            })()}
          </Grid>
        </Grid>
      </Card>
    </Container>
  )
}
