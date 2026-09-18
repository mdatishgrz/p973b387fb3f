import {
  Container, Typography, Box, Stack, Card, CardContent, Grid,
  Tabs, Tab, Button, Chip,
} from '@mui/material'
import { ArrowLeft, FilePlus, MessagesSquare, CheckCircle, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useApp } from '../context/AppContext'
import PostCard from '../components/community/PostCard'
import EmptyState from '../components/common/EmptyState'
import { formatNumber } from '../utils/helpers'

type MyPostsTab = 'all' | 'published' | 'drafts' | 'closed' | 'solved'

export default function MyPosts() {
  const navigate = useNavigate()
  const { posts, currentUserId, answers } = useApp()
  const [tab, setTab] = useState<MyPostsTab>('all')

  const myPosts = posts.filter(p => p.authorId === currentUserId)
  const myAnswers = Object.values(answers).flat().filter(a => a.authorId === currentUserId)
  const mySolutions = myAnswers.filter(a => a.isSolution)
  const totalViews = myPosts.reduce((acc, p) => acc + p.views, 0)
  const myQuestions = myPosts.filter(p => p.type === 'question')

  const getFilteredPosts = () => {
    switch (tab) {
      case 'published': return myPosts.filter(p => p.status !== undefined)
      case 'drafts': return []
      case 'closed': return myPosts.filter(p => p.status === 'closed')
      case 'solved': return myPosts.filter(p => p.status === 'solved')
      default: return myPosts
    }
  }

  const stats = [
    { icon: <FilePlus />, label: 'Total Posts', value: formatNumber(myPosts.length), color: '#4f46e5', bg: '#eef2ff' },
    { icon: <MessagesSquare />, label: 'Questions', value: formatNumber(myQuestions.length), color: '#0284c7', bg: '#e0f2fe' },
    { icon: <FilePlus />, label: 'Answers', value: formatNumber(myAnswers.length), color: '#059669', bg: '#d1fae5' },
    { icon: <CheckCircle />, label: 'Solutions', value: formatNumber(mySolutions.length), color: '#d97706', bg: '#fef3c7' },
    { icon: <Eye />, label: 'Total Views', value: formatNumber(totalViews), color: '#7c3aed', bg: '#ede9fe' },
  ]

  const filtered = getFilteredPosts()

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Button startIcon={<ArrowLeft />} onClick={() => navigate('/community')} sx={{ mb: 2, textTransform: 'none' }}>
        Back
      </Button>

      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} spacing={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5, fontSize: { xs: 24, md: 30 } }}>My Posts</Typography>
          <Typography variant="body2" color="text.secondary">Manage your posts, questions, and marketplace activity.</Typography>
        </Box>
        <Button variant="contained" onClick={() => navigate('/community/create')}>+ New Post</Button>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {stats.map(s => (
          <Grid item xs={6} sm={4} md={2.4} key={s.label}>
            <Card sx={{ bgcolor: s.bg, border: 'none', boxShadow: 'none', height: '100%' }}>
              <CardContent sx={{ p: 2, textAlign: 'center' }}>
                <Box sx={{ color: s.color, mb: 0.5 }}>{s.icon}</Box>
                <Typography variant="h6" fontWeight={800} sx={{ fontSize: 20, color: s.color }}>{s.value}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.3, fontSize: 11 }}>{s.label}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Card sx={{ mb: 3 }}>
        <Box sx={{ px: { xs: 1, md: 2 } }}>
          <Tabs value={tab} onChange={(_, v: MyPostsTab) => setTab(v)} sx={{ minHeight: 48, '& .MuiTab-root': { minHeight: 48 } }}>
            <Tab label={`All (${myPosts.length})`} value="all" />
            <Tab label={`Published (${myPosts.length})`} value="published" />
            <Tab label="Drafts (0)" value="drafts" />
            <Tab label="Closed (0)" value="closed" />
            <Tab label={`Solved (${myPosts.filter(p => p.status === 'solved').length})`} value="solved" />
          </Tabs>
        </Box>
      </Card>

      {filtered.length === 0 ? (
        <EmptyState
          type="no_posts"
          customTitle={`No ${tab !== 'all' ? tab : 'posts'} yet`}
          customSubtitle={tab === 'drafts' ? 'Save drafts of posts you\'re not ready to publish yet.' : 'Create your first post to share with the community.'}
          action={{ label: 'Create Post', onClick: () => navigate('/community/create') }}
        />
      ) : (
        filtered.map(p => <PostCard key={p.id} post={p} />)
      )}
    </Container>
  )
}
