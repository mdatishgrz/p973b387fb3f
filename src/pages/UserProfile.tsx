import {
  Box,
  Container,
  Typography,
  Stack,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Tabs,
  Tab,
} from '@mui/material'
import { MapPin, Calendar, FilePlus, MessagesSquare, MessageSquare } from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import AppAvatar from '../components/common/AppAvatar'
import VerifiedBadge from '../components/common/VerifiedBadge'
import UserRoleBadge from '../components/common/UserRoleBadge'
import PostCard from '../components/community/PostCard'
import TagChip from '../components/common/TagChip'
import EmptyState from '../components/common/EmptyState'
import { formatDate, formatNumber } from '../utils/helpers'

export default function UserProfile() {
  const { username } = useParams()
  const navigate = useNavigate()
  const { getUserByUsername, posts, answers, showSnackbar } = useApp()
  const user = getUserByUsername(username || '')
  const [tab, setTab] = useState(0)

  if (!user) {
    return <Container maxWidth="lg" sx={{ py: 6 }}><EmptyState type="no_search" customTitle="User not found" /></Container>
  }

  const userPosts = posts.filter(p => p.authorId === user.id)
  const userAnswers = Object.values(answers).flat().filter(a => a.authorId === user.id)
  const questionPosts = userPosts.filter(p => p.type === 'question')

  return (
    <Box>
      <Box sx={{ height: { xs: 140, md: 200 }, background: 'linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)' }} />

      <Container maxWidth="lg" sx={{ position: 'relative', mt: { xs: -10, md: -12 } }}>
        <Card>
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Stack direction={{ xs: 'row', md: 'column' }} spacing={{ xs: 2, md: 0 }} alignItems={{ xs: 'center', md: 'center' }} sx={{ mt: { xs: -8, md: -14 } }}>
                <AppAvatar
                  src={user.avatar}
                  name={user.name}
                  sx={{
                    width: { xs: 100, md: 150 },
                    height: { xs: 100, md: 150 },
                    borderRadius: '50%',
                    border: '4px solid #fff',
                    boxShadow: 3,
                    fontSize: 48,
                  }}
                />
              </Stack>
              <Box flexGrow={1} width="100%">
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={{ xs: 1, md: 3 }} alignItems={{ md: 'flex-start' }} justifyContent="space-between">
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 0.5 }}>
                      <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: 22, md: 28 } }}>{user.name}</Typography>
                      {user.verified && <VerifiedBadge type="user" />}
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>@{user.username}</Typography>
                    <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mb: 1.5 }}>
                      <UserRoleBadge role={user.role} />
                      <Stack direction="row" alignItems="center" spacing={0.3} sx={{ color: 'text.secondary' }}>
                        <MapPin size={16} />
                        <Typography variant="body2" sx={{ fontSize: 13 }}>{user.location}</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" spacing={0.3} sx={{ color: 'text.secondary' }}>
                        <Calendar size={16} />
                        <Typography variant="body2" sx={{ fontSize: 13 }}>Joined {formatDate(user.memberSince)}</Typography>
                      </Stack>
                    </Stack>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 560, lineHeight: 1.6 }}>
                      {user.bio}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1.5} sx={{ flexShrink: 0 }}>
                    <Button variant="outlined" startIcon={<MessageSquare />} onClick={() => { showSnackbar('Opening conversation...', 'info'); navigate('/community/messages') }}>
                      Message
                    </Button>
                  </Stack>
                </Stack>

                <Grid container spacing={2} sx={{ mt: 3 }}>
                  <Grid item xs={6} sm={4} md={3}>
                    <StatCard icon={<FilePlus />} label="Posts" value={formatNumber(user.postsCount || userPosts.length)} color="#4f46e5" bg="#eef2ff" />
                  </Grid>
                  <Grid item xs={6} sm={4} md={3}>
                    <StatCard icon={<MessagesSquare />} label="Answers" value={formatNumber(user.answersCount || userAnswers.length)} color="#059669" bg="#d1fae5" />
                  </Grid>
                  <Grid item xs={6} sm={4} md={3}>
                    <StatCard icon={<MessageSquare />} label="Helpful" value={formatNumber(user.helpfulCount)} color="#0284c7" bg="#e0f2fe" />
                  </Grid>
                </Grid>

                {user.interests.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" fontWeight={700} color="text.secondary" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 11 }}>
                      Interests
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {user.interests.map(i => <TagChip key={i} tag={i} clickable />)}
                    </Stack>
                  </Box>
                )}
              </Box>
            </Stack>

            <Box sx={{ mt: 4 }}>
              <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 44 }}>
                <Tab label={`Posts (${userPosts.length})`} sx={{ minHeight: 44 }} />
                <Tab label={`Questions (${questionPosts.length})`} sx={{ minHeight: 44 }} />
                <Tab label={`Answers (${userAnswers.length})`} sx={{ minHeight: 44 }} />
                <Tab label="Saved Topics" sx={{ minHeight: 44 }} />
              </Tabs>
            </Box>

            <Box sx={{ py: 3 }}>
              {tab === 0 && (userPosts.length === 0 ? <EmptyState type="no_posts" compact /> : userPosts.map(p => <PostCard key={p.id} post={p} compact />))}
              {tab === 1 && (questionPosts.length === 0 ? <EmptyState type="no_posts" compact customTitle="No questions asked yet" /> : questionPosts.map(p => <PostCard key={p.id} post={p} compact />))}
              {tab === 2 && (userAnswers.length === 0 ? <EmptyState type="no_answers" compact /> : (
                <Stack spacing={1.5}>
                  {userAnswers.map(a => {
                    const post = posts.find(p => p.id === a.postId)
                    if (!post) return null
                    return (
                      <Card key={a.id} sx={{ cursor: 'pointer' }} onClick={() => navigate(`/community/post/${a.postId}#answer-${a.id}`)}>
                        <CardContent sx={{ p: 2.5 }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                            Answer on: <strong style={{ color: '#4f46e5' }}>{post.title}</strong>
                          </Typography>
                          <Typography variant="body2" sx={{ lineHeight: 1.6, whiteSpace: 'pre-wrap',
                            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {a.content}
                          </Typography>
                          <Stack direction="row" spacing={2} sx={{ mt: 1.5 }}>
                            {a.isSolution && <Chip size="small" label="Solution" sx={{ bgcolor: '#d1fae5', color: '#047857', fontWeight: 700, fontSize: 10, height: 18 }} />}
                          </Stack>
                        </CardContent>
                      </Card>
                    )
                  })}
                </Stack>
              ))}
              {tab === 3 && user.interests.length === 0 ? (
                <EmptyState type="no_topics" compact />
              ) : (
                <Stack direction="row" flexWrap="wrap" useFlexGap spacing={1.5}>
                  {user.interests.map(i => (
                    <Card key={i} sx={{ minWidth: 180, p: 0 }}>
                      <CardContent>
                        <Typography variant="subtitle2" fontWeight={700}>{i}</Typography>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              )}
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

function StatCard({ icon, label, value, color, bg }: { icon: React.ReactNode; label: string; value: string; color: string; bg: string }) {
  return (
    <Card sx={{ bgcolor: bg, border: 'none', boxShadow: 'none', height: '100%' }}>
      <CardContent sx={{ p: 2, textAlign: 'center' }}>
        <Box sx={{ color, mb: 0.5 }}>{icon}</Box>
        <Typography variant="h6" fontWeight={800} sx={{ fontSize: 20, color }}>{value}</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 11, mt: 0.3 }}>{label}</Typography>
      </CardContent>
    </Card>
  )
}
