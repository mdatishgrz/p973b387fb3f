import {
  Box,
  Container,
  Stack,
  Typography,
  Button,
  Tabs,
  Tab,
  Chip,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material'
import { Plus, Compass, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import PostCard from '../components/community/PostCard'
import EmptyState from '../components/common/EmptyState'
import type { FeedTab, PostTypeFilter } from '../types'
import { POST_TYPE_META } from '../utils/helpers'
import { POST_TYPE_ICON } from '../utils/postTypeIcons'

export default function CommunityHome() {
  const navigate = useNavigate()
  const { posts } = useApp()

  const [feedTab, setFeedTab] = useState<FeedTab>('foryou')
  const [typeFilter, setTypeFilter] = useState<PostTypeFilter>('all')

  const filteredPosts = posts.filter(post => {
    if (typeFilter !== 'all' && post.type !== typeFilter) return false
    if (feedTab === 'unanswered') return post.type === 'question' && (post.answerCount || 0) === 0
    return true
  }).sort((a, b) => {
    switch (feedTab) {
      case 'latest': return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
  })

  const postTypeFilters: PostTypeFilter[] = [
    'all', 'question', 'vendor_request', 'knowledge', 'experience', 'discussion', 'poll', 'partnership',
  ]

  return (
    <Box>
      <Box sx={{
        bgcolor: 'linear-gradient(135deg, #eef2ff 0%, #faf5ff 100%)',
        background: 'linear-gradient(135deg, #eef2ff 0%, #ecfdf5 50%, #faf5ff 100%)',
        py: { xs: 3, md: 5 },
        mb: 3,
        borderBottom: '1px solid #e5e7eb',
      }}>
        <Container maxWidth="lg">
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h4" fontWeight={800} sx={{ fontSize: { xs: 24, md: 32 }, mb: 0.5 }}>
                Community
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, fontSize: { xs: 14, md: 15 } }}>
                Ask questions, discover vendors, share knowledge, and connect with businesses.
              </Typography>
            </Box>
            <Stack direction={{ xs: 'row' }} spacing={1.5} sx={{ flexShrink: 0 }}>
              <Button
                variant="outlined"
                size="medium"
                startIcon={<Compass size={18} />}
                onClick={() => navigate('/community/explore')}
              >
                Explore Topics
              </Button>
              <Button
                variant="contained"
                size="medium"
                startIcon={<Plus size={18} />}
                onClick={() => navigate('/community/create')}
              >
                Create Post
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Stack sx={{ mb: 2, bgcolor: '#fff', borderRadius: 2, border: '1px solid #e5e7eb' }}>
          <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between" sx={{ px: { xs: 1, md: 2 }, pt: 1 }}>
            <Tabs
              value={feedTab}
              onChange={(_, v) => setFeedTab(v)}
              TabIndicatorProps={{ sx: { display: { xs: 'block', md: 'block' } } }}
              sx={{
                minHeight: 48,
                '& .MuiTabs-flexContainer': { gap: 0 },
                '& .MuiTab-root': { minHeight: 48, px: 2, minWidth: 'auto' },
                width: '100%',
                overflowX: 'auto',
              }}
              variant="scrollable"
              scrollButtons={false}
            >
              <Tab label="For You" value="foryou" />
              <Tab label="Latest" value="latest" />
              <Tab label="Popular" value="popular" />
              <Tab label="Unanswered" value="unanswered" />
            </Tabs>
            <IconButton size="small" sx={{ display: { xs: 'none', md: 'inline-flex' } }} aria-label="Filters">
              <Tooltip title="More filters">
                <SlidersHorizontal />
              </Tooltip>
            </IconButton>
          </Stack>
          <Divider />
          <Box sx={{ p: { xs: 1, md: 2 }, overflow: 'auto' }}>
            <Stack direction="row" spacing={1} sx={{ flexWrap: 'nowrap' }}>
              {postTypeFilters.map(t => {
                const Icon = t !== 'all' ? POST_TYPE_ICON[t] : null
                return (
                  <Chip
                    key={t}
                    label={t === 'all' ? 'All' : POST_TYPE_META[t].label}
                    icon={Icon ? <Icon size={14} /> : undefined}
                    onClick={() => setTypeFilter(t)}
                    color={typeFilter === t ? 'primary' : 'default'}
                    variant={typeFilter === t ? 'filled' : 'outlined'}
                    size="small"
                    sx={{
                      flexShrink: 0,
                      fontWeight: typeFilter === t ? 700 : 500,
                      fontSize: 12,
                      bgcolor: typeFilter === t ? '#4f46e5' : '#fff',
                      borderColor: '#d1d5db',
                      '& .MuiChip-icon': { color: typeFilter === t ? '#fff' : '#6b7280' },
                      '&:hover': {
                        bgcolor: typeFilter === t ? '#4338ca' : '#f9fafb',
                      },
                    }}
                  />
                )
              })}
            </Stack>
          </Box>
        </Stack>

        {filteredPosts.length === 0 ? (
          <EmptyState type="no_posts" />
        ) : (
          filteredPosts.map(post => <PostCard key={post.id} post={post} />)
        )}
      </Container>
    </Box>
  )
}
